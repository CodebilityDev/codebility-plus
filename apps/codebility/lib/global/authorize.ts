import type { CurrentUserProfile } from "@/types/global/current-user";
import type { PermissionKey, RolePermissions } from "@/types/global/permissions";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { getAccess } from "@/lib/global/permissions";
import { getCurrentCodev } from "@/lib/global/current-codev";
import { logPerf } from "@/lib/global/timing";

export interface Identity {
  userId: string;
  codev: CurrentUserProfile | null;
  permissions: RolePermissions;
  hasFullAccess: boolean;
}

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthorizationError";
  }
}

const OWNERSHIP_COLUMNS = ["codev_id", "owner_id", "created_by"] as const;

function ownerOf(
  table: string,
  record: Record<string, unknown>,
): string | null {
  if (table === "codev") {
    return typeof record.id === "string" ? record.id : null;
  }

  for (const column of OWNERSHIP_COLUMNS) {
    const value = record[column];

    if (typeof value === "string") return value;
  }

  return null;
}

export async function requireIdentity(): Promise<Identity> {
  const startedAt = performance.now();
  const supabase = await createClientServerComponent();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new AuthorizationError("Unauthorized");
  }

  const access = await getAccess();
  const codev = await getCurrentCodev();
  logPerf("authorize.identity", startedAt);

  return {
    userId: user.id,
    codev,
    permissions: access.permissions,
    hasFullAccess: access.hasFullAccess,
  };
}

export async function authorize(
  permission?: PermissionKey,
  resource?: { table: string; id: string },
): Promise<Identity> {
  const identity = await requireIdentity();

  if (permission && !identity.permissions[permission]) {
    throw new AuthorizationError(
      `Forbidden: missing permission "${permission}"`,
    );
  }

  if (resource && !identity.hasFullAccess) {
    const startedAt = performance.now();
    const supabase = await createClientServerComponent();

    const client = supabase as unknown as {
      from: (table: string) => {
        select: (columns: string) => {
          eq: (
            column: string,
            value: string,
          ) => {
            single: () => Promise<{
              data: Record<string, unknown> | null;
              error: unknown;
            }>;
          };
        };
      };
    };

    const { data, error } = await client
      .from(resource.table)
      .select("*")
      .eq("id", resource.id)
      .single();

    logPerf("authorize.resource", startedAt);

    if (error || !data) {
      throw new AuthorizationError("Forbidden: resource not accessible");
    }

    const owner = ownerOf(
      resource.table,
      data,
    );

    if (owner !== identity.userId) {
      throw new AuthorizationError("Forbidden: not the owner");
    }
  }

  return identity;
}
