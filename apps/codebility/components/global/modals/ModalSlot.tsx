"use client";

import type { ReactNode } from "react";
import { useModal } from "@/hooks/global/use-modal";
import type { ModalType } from "@/types/global/hooks";

export function ModalSlot({
  type,
  children,
}: {
  type: ModalType;
  children: ReactNode;
}) {
  const { isOpen, type: activeType } = useModal();
  if (!isOpen || activeType !== type) return null;
  return children;
}
