"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

import { getPermissionsAction } from "@/actions/global/permissions";
import { PERMISSION_KEYS } from "@/constants/global/permissions";
import type { PermissionKey, RolePermissions } from "@/types/global/permissions";

interface PermissionsContextValue {
  permissions: RolePermissions;
  has: (key: PermissionKey) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

function createEmptyPermissions(): RolePermissions {
  const permissions = {} as RolePermissions;

  for (const key of PERMISSION_KEYS) {
    permissions[key] = false;
  }

  return permissions;
}

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<RolePermissions>(
    createEmptyPermissions,
  );

  useEffect(() => {
    let active = true;

    void getPermissionsAction().then((result) => {
      if (active) {
        setPermissions(result);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const value: PermissionsContextValue = {
    permissions,
    has: (key) => permissions[key],
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions(): PermissionsContextValue {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error(
      "usePermissions must be used inside PermissionsProvider",
    );
  }

  return context;
}
