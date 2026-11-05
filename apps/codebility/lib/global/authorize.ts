import type { CurrentUserProfile } from "@/types/global/current-user";
import type { PermissionKey, RolePermissions } from "@/types/global/permissions";
import { getSessionIdentity } from "@/lib/global/session";
import { createClientServerComponent } from "@/lib/global/supabase-server";
import { logPerf } from "@/lib/global/timing";

export interface Identity {
  userId: string;
  codev: CurrentUserProfile | null;
  permissions: RolePermissions;
  hasFullAccess: boolean;
}

export type AuthorizationCode = "unauthenticated" | "forbidden";

export class AuthorizationError extends Error {
  readonly code: AuthorizationCode;

  constructor(code: AuthorizationCode, message: string) {
    super(message);
    this.name = "AuthorizationError";
    this.code = code;
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
  const { userId, codev, access } = await getSessionIdentity();

  if (!userId) {
    throw new AuthorizationError("unauthenticated", "Unauthorized");
  }

  logPerf("authorize.identity", startedAt);

  return {
    userId,
    codev,
    permissions: access.permissions,
    hasFullAccess: access.hasFullAccess,
  };
}

export async function authorize(
  permission: PermissionKey,
  resource?: { table: string; id: string },
): Promise<Identity> {
  const identity = await requireIdentity();

  if (!identity.permissions[permission]) {
    throw new AuthorizationError(
      "forbidden",
      `Forbidden: missing permission "${permission}"`,
    );
  }

  if (resource && !identity.hasFullAccess) {
    await assertOwnership(identity, resource);
  }

  return identity;
}

async function assertOwnership(
  identity: Identity,
  resource: { table: string; id: string },
): Promise<void> {
  const startedAt = performance.now();
  const supabase = await createClientServerComponent();

  const client = supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (
          column: string,
          value: string,
        ) => {
          maybeSingle: () => Promise<{
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
    .maybeSingle();

  logPerf("authorize.resource", startedAt);

  if (error || !data) {
    throw new AuthorizationError(
      "forbidden",
      "Forbidden: resource not accessible",
    );
  }

  const owner = ownerOf(resource.table, data);

  if (owner !== identity.userId) {
    throw new AuthorizationError("forbidden", "Forbidden: not the owner");
  }
}
