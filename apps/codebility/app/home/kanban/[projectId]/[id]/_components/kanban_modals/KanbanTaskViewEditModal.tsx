"use client";

import { ReactNode, memo, useCallback } from "react";
import { useModal } from "@/hooks/use-modal";
import { ExtendedTask } from "@/types/home/codev";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  task: ExtendedTask;
  onComplete?: (taskId: string) => void;
}

function KanbanTaskViewEditModal({
  children,
  task,
  onComplete,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { onOpen } = useModal();

  const handleClick = useCallback(() => {
    router.push(`${pathname}?taskId=${task.id}`, { scroll: false });
    onOpen("taskViewModal", task, onComplete);
  }, [onOpen, task, onComplete]);

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
}

export default memo(KanbanTaskViewEditModal);
