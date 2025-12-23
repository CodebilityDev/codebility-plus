"use client";

import { ReactNode, useEffect, useState } from "react"; 
import { useModal } from "@/hooks/use-modal";
import { createClientClientComponent } from "@/utils/supabase/client";

interface Props {
  projectId: string;
  children: ReactNode;
}

export default function DashboardCurrentProjectButton({
  projectId,
  children,
}: Props) {
  const { onOpen } = useModal();
  const [isDisabled, setIsDisabled] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  const handleClick = () => {
    if (!isDisabled) {
      onOpen("dashboardCurrentProjectModal", { projectId });
    }
  };
  
  useEffect(() => {
    const supabaseClient = createClientClientComponent();
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchProjectStatus = async () => {
      try {
        // Get current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setIsDisabled(true);
          return;
        }

        // BUG FIX: Check if user is still a member of the project
        const { data: membership, error: membershipError } = await supabase
          .from("project_members")
          .select("id")
          .eq("codev_id", user.id)
          .eq("project_id", projectId)
          .single();

        if (membershipError || !membership) {
          setIsDisabled(true);
          return;
        }

        // BUG FIX: Verify project is still active before enabling button
        const { data: project, error: projectError } = await supabase
          .from("projects")
          .select("status, kanban_display")
          .eq("id", projectId)
          .single();

        if (projectError || !project) {
          setIsDisabled(true);
          return;
        }

        // BUG FIX: Only enable button if project has active status
        const projectStatus = project.status?.toLowerCase();
        const isActiveProject = 
          projectStatus === "active" || 
          projectStatus === "inprogress" || 
          projectStatus === "pending";

        // Enable button only if:
        // 1. Project is active/inprogress/pending
        // 2. User is a member
        // 3. Kanban display is enabled (optional, depending on your requirements)
        setIsDisabled(!isActiveProject);

      } catch (error) {
        console.error("Error fetching project status:", error);
        setIsDisabled(true);
      }
    };

    fetchProjectStatus();
  }, [projectId, supabase]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`w-full transition-opacity ${
        isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
}