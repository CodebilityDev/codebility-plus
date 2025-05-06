"use client";

import { ReactNode, useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

  const handleClick = () => {
    if (!isDisabled) {
      onOpen("dashboardCurrentProjectModal", { projectId });
    }
  };

  useEffect(() => {
    const fetchKanbanDisplay = async () => {
      const supabase = createClientComponentClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return;

      const { data: membership } = await supabase
        .from("project_members")
        .select("id")
        .eq("codev_id", user.id)
        .eq("project_id", projectId)
        .single();

      if (!membership) return;

      const { data: project } = await supabase
        .from("projects")
        .select("kanban_display")
        .eq("id", projectId)
        .single();

      setIsDisabled(project?.kanban_display !== true);
    };

    fetchKanbanDisplay();
  }, [projectId]);

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`shrink-0 text-xs transition-opacity  ${
        isDisabled ? "cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}
