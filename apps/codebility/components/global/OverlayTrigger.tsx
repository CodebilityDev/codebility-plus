"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/global/ui/button";
import { useModal } from "@/hooks/global/use-modal";
import type { ModalType } from "@/types/global/hooks";

export default function OverlayTrigger({
  type,
  data,
  dataObject,
  className,
  children,
}: {
  type: ModalType;
  data?: unknown;
  dataObject?: unknown;
  className?: string;
  children: ReactNode;
}) {
  const { onOpen } = useModal();

  return (
    <Button type="button" className={className ?? "w-auto"} onClick={() => onOpen(type, data, dataObject)}>
      {children}
    </Button>
  );
}
