"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SettingsCard from "@/app/home/settings/_components/SettingsCard";
import { H1 } from "@/components/shared/dashboard";
import { settingsCardData } from "@/constants/settings";
import { createClientClientComponent } from "@/utils/supabase/client";
import PageContainer from "../_components/PageContainer";

import Loading from "./loading";

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

// Admin-only cards that require role_id = 1
const ADMIN_ONLY_PATHS = [
  "/home/settings/news-banners",
  "/home/settings/services",
];

// Map specific settings routes to their respective permission keys
const settingsPermissionMap: Record<string, PermissionKey> = {
  "/home/settings/profile": "resume",
  "/home/settings/permissions": "permissions",
  "/home/settings/roles": "roles",
};

const Settings = () => {
  const [supabase, setSupabase] = useState<any>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize Supabase client
  useEffect(() => {
    const client = createClientClientComponent();
    setSupabase(client);
  }, []);

  // Get current user's role_id by mapping auth email to codev.role_id
  useEffect(() => {
    if (!supabase) return;

    async function fetchUserRole() {
      try {
        // Get auth user
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user?.email) {
          console.error("Failed to get session:", sessionError);
          setLoading(false);
          return;
        }

        // Map email to codev profile to get role_id
        const { data: codevData, error: codevError } = await supabase
          .from("codev")
          .select("role_id")
          .eq("email_address", session.user.email)
          .single();

        if (codevError || !codevData) {
          console.error("Failed to fetch user role:", codevError);
          setLoading(false);
          return;
        }

        setRoleId(codevData.role_id);
      } catch (err) {
        console.error("Error fetching user role:", err);
        setLoading(false);
      }
    }

    fetchUserRole();
  }, [supabase]);

  // Fetch role permissions once we have roleId
  useEffect(() => {
    if (!supabase || roleId === null) return;

    async function fetchRolePermissions() {
      try {
        const { data: roleData, error: roleError } = await supabase
          .from("roles")
          .select(
            "dashboard, kanban, time_tracker, interns, applicants, inhouse, clients, projects, settings, orgchart, resume, permissions, roles"
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

  // Helper function to check a permission
  const hasPermission = (permission: PermissionKey): boolean => {
    return !!rolePermissions?.[permission];
  };

  if (loading) {
    return (
      <PageContainer>
        <Loading />
      </PageContainer>
    );
  }

  if (!rolePermissions || roleId === null) {
    return (
      <PageContainer>
        <div className="mx-auto p-4">Unable to determine permissions.</div>
      </PageContainer>
    );
  }

  // Filter settings cards based on role
  const filteredCards = settingsCardData.filter((card) => {
    // Rule 1: Admin-only cards (News Banners, Services)
    // Only visible if user has role_id = 1 (Admin)
    if (ADMIN_ONLY_PATHS.includes(card.path)) {
      return roleId === 1;
    }

    // Rule 2: Check specific permission mapping
    // For cards like Profile, Permissions, Roles
    const permissionKey = settingsPermissionMap[card.path];
    if (permissionKey) {
      return hasPermission(permissionKey);
    }

    // Rule 3: Default fallback - require general "settings" permission
    return hasPermission("settings");
  });

  return (
    <PageContainer maxWidth="xl">
      <H1>Settings</H1>
      <div className="mt-4 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
    </PageContainer>
  );
};

export default Settings;