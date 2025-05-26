"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SettingsCard from "@/app/home/settings/_components/SettingsCard";
import { H1 } from "@/Components/shared/dashboard";
import { settingsCardData } from "@/constants/settings";
import { createClientClientComponent } from "@/utils/supabase/client";

import Loading from "./loading";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RolePermissions = {
  dashboard: boolean;
  kanban: boolean;
  time_tracker: boolean;
  interns: boolean;
  applicants: boolean;
  inhouse: boolean;
  clients: boolean;
  projects: boolean;
  settings: boolean;
  orgchart: boolean;
  resume?: boolean;
  permissions?: boolean;
  roles?: boolean;
};

type PermissionKey = keyof RolePermissions;

// Map specific settings routes to their respective permission keys.
const settingsPermissionMap: Record<string, PermissionKey> = {
  "/home/settings/profile": "resume",
  "/home/settings/permissions": "permissions",
  "/home/settings/roles": "roles",
};

const Settings = () => {
  const supabase = createClientClientComponent();

  // Instead of using useUser, assume roleId is known (e.g. passed as a prop or hardcoded)
  const roleId = 2; // Replace with actual logic to obtain the user's roleId

  const [rolePermissions, setRolePermissions] =
    useState<RolePermissions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Helper function to check a permission
  const hasPermission = (permission: PermissionKey): boolean => {
    return !!rolePermissions?.[permission];
  };

  useEffect(() => {
    async function fetchRolePermissions() {
      try {
        // Fetch the role permissions from the "roles" table.
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select(
            "dashboard, kanban, time_tracker, interns, applicants, inhouse, clients, projects, settings, orgchart, resume, permissions, roles",
          )
          .eq("id", roleId)
          .single();

        if (roleError || !roleData) {
          console.error("Failed to fetch role permissions:", roleError);
          setLoading(false);
          return;
        }
        setRolePermissions(roleData);
      } catch (err) {
        console.error("Error fetching role permissions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRolePermissions();
  }, [supabase, roleId]);

  if (loading) {
    return <Loading />;
  }

  if (!rolePermissions) {
    return <div className="mx-auto p-4">Unable to determine permissions.</div>;
  }

  // Filter settings cards based on role permissions.
  // For a card whose path exists in the mapping, use its permission key;
  // otherwise, require the general "settings" permission.
  const filteredCards = settingsCardData.filter((card) => {
    const permissionKey = settingsPermissionMap[card.path] || "settings";
    return hasPermission(permissionKey);
  });

  return (
    <div className="mx-auto flex max-w-screen-xl flex-col gap-4 p-4">
      <H1>Settings</H1>
      <div className="grid w-full max-w-7xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCards.map((card) => (
          <Link key={card.path} href={card.path}>
            <SettingsCard
              imageName={card.imageName}
              imageAlt={card.imageAlt}
              title={card.title}
              description={card.description}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Settings;
