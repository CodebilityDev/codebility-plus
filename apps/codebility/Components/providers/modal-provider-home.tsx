"use client";

import { useEffect, useState } from "react";
import ClientAddModal from "@/app/home/clients/_components/ClientAddModal";
import ClientEditModal from "@/app/home/clients/_components/ClientEditModal";
import BoardAddModal from "@/app/home/kanban/_components/BoardAddModal";
import ColumnAddModal from "@/app/home/kanban/[id]/_components/kanban_modals/KanbanColumnAddModal";
import TaskAddModal from "@/app/home/kanban/[id]/_components/tasks/TaskAddModal";
import TaskViewModal from "@/app/home/kanban/[id]/_components/tasks/TaskViewModal";
import ProjectAddModal from "@/app/home/projects/_components/ProjectAddModal";
import ProjectDeleteModal from "@/app/home/projects/_components/ProjectDeleteModal";
import ProjectEditModal from "@/app/home/projects/_components/ProjectEditModal";
import ProjectViewModal from "@/app/home/projects/_components/ProjectViewModal";
import AddRoleModal from "@/app/home/settings/roles/_components/AddRoleModal";
import DeleteRoleModal from "@/app/home/settings/roles/_components/DeleteRoleModal";
import EditRoleModal from "@/app/home/settings/roles/_components/EditRoleModal";
import ApplicantsEditModal from "@/Components/modals/ApplicantsEditModal";
import PrivacyPolicyModal from "@/Components/modals/PrivacyPolicyModal";
import ProfileModal from "@/Components/modals/ProfileModal";
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

      <AddRoleModal />
      <EditRoleModal />
      <DeleteRoleModal />
      <DeleteWarningModal />

      <TechStackModal />
    </>
  );
};
