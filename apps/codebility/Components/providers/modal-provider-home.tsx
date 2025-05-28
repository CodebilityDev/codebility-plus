"use client";

import { useEffect, useState } from "react";
import DashboardCurrentProjectModal from "@/app/home/(dashboard)/_components/DashboardCurrentProjectModal";
import ClientAddModal from "@/app/home/clients/_components/ClientAddModal";
import ClientEditModal from "@/app/home/clients/_components/ClientEditModal";
import ProfileModal from "@/app/home/interns/_components/ProfileModal";
import BoardAddModal from "@/app/home/kanban/_components/BoardAddModal";
import KanbanAddMembersModal from "@/app/home/kanban/[id]/_components/kanban_modals/KanbanAddMembersModal";
import ColumnAddModal from "@/app/home/kanban/[id]/_components/kanban_modals/KanbanColumnAddModal";
import TaskAddModal from "@/app/home/kanban/[id]/_components/tasks/TaskAddModal";
import TaskViewModal from "@/app/home/kanban/[id]/_components/tasks/TaskViewModal";
import ProjectAddModal from "@/app/home/projects/_components/ProjectAddModal";
import ProjectDeleteModal from "@/app/home/projects/_components/ProjectDeleteModal";
import ProjectEditModal from "@/app/home/projects/_components/ProjectEditModal";
import ProjectViewModal from "@/app/home/projects/_components/ProjectViewModal";
import ApplicantsEditModal from "@/Components/modals/ApplicantsEditModal";
import PrivacyPolicyModal from "@/Components/modals/PrivacyPolicyModal";
import TermsOfServiceModal from "@/Components/modals/TermsOfServiceModal";
import TimeTrackerModal from "@/Components/modals/TimeTrackerModal";

import TaskDeleteModal from "../../app/home/kanban/[id]/_components/tasks/TaskDeleteModal";
import TaskEditModal from "../../app/home/kanban/[id]/_components/tasks/TaskEditModal";
import DeleteWarningModal from "../modals/DeleteWarningModal";
import TechStackModal from "../modals/TechStackModal";

export const ModalProviderHome = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <TaskAddModal />
      <TaskViewModal />
      <TaskEditModal />
      <TaskDeleteModal />

      <BoardAddModal />
      <BoardAddModal />
      <ColumnAddModal />

      <KanbanAddMembersModal />

      <ProjectAddModal />
      <ProjectEditModal />
      <ProjectViewModal />
      <ProjectDeleteModal />

      <ClientAddModal />
      <ClientEditModal />

      <ApplicantsEditModal />
      <PrivacyPolicyModal />
      <TermsOfServiceModal />

      <ProfileModal />

      <TimeTrackerModal />

      <DeleteWarningModal />

      <TechStackModal />

      <DashboardCurrentProjectModal />
    </>
  );
};
