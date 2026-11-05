"use client";

import { ModalSlot } from "@/components/global/modals/ModalSlot";
import ProjectContributorPickerModal from "@/components/home/projects/ProjectContributorPickerModal";
import ProjectCreateDrawer from "@/components/home/projects/ProjectCreateDrawer";

export default function ProjectOverlays() {
  return (
    <>
      <ModalSlot type="projectContributorPicker">
        <ProjectContributorPickerModal />
      </ModalSlot>
      <ModalSlot type="projectCreateDrawer">
        <ProjectCreateDrawer />
      </ModalSlot>
    </>
  );
}
