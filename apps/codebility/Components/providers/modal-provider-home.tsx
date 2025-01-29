"use client";

import { useEffect, useState } from "react";
import ClientAddModal from "@/app/home/clients/_components/ClientAddModal";
import ClientEditModal from "@/app/home/clients/_components/ClientEditModal";
import BoardAddModal from "@/app/home/kanban/_components/BoardAddModal";
import ColumnAddModal from "@/app/home/kanban/[id]/_components/kanban_modals/ListAddModal";
import TaskAddModal from "@/app/home/kanban/[id]/_components/tasks/TaskAddModal";
import TaskViewModal from "@/app/home/kanban/[id]/_components/tasks/TaskViewModal";
import ProjectAddModal from "@/app/home/projects/_components/ProjectAddModal";
import ProjectDeleteModal from "@/app/home/projects/_components/ProjectDeleteModal";
import ProjectEditModal from "@/app/home/projects/_components/ProjectEditModal";
import ProjectViewModal from "@/app/home/projects/_components/ProjectViewModal";
import AddRoleModal from "@/Components/modals/AddRoleModal";
import ApplicantsEditModal from "@/Components/modals/ApplicantsEditModal";
import DeleteRoleModal from "@/Components/modals/DeleteRoleModal";
import EditRoleModal from "@/Components/modals/EditRoleModal";
import PrivacyPolicyModal from "@/Components/modals/PrivacyPolicyModal";
import ProfileModal from "@/Components/modals/ProfileModal";
import ServiceCategoriesDeleteModal from "@/Components/modals/ServiceCategoriesDeleteModal";
import ServiceCategoriesModal from "@/Components/modals/ServiceCategoriesModal";
import ServicesModal from "@/Components/modals/ServicesModal";
import TermsOfServiceModal from "@/Components/modals/TermsOfServiceModal";
import TimeTrackerModal from "@/Components/modals/TimeTrackerModal";

import TaskDeleteModal from "../../app/home/kanban/[id]/_components/tasks/TaskDeleteModal";
import TaskEditModal from "../../app/home/kanban/[id]/_components/tasks/TaskEditModal";
import ProjectMembersModal from "../../app/home/projects/_components/ProjectMembersModal";
import DeleteWarningModal from "../modals/DeleteWarningModal";

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
      <ProjectMembersModal />

      <ClientAddModal />
      <ClientEditModal />

      <ServicesModal />
      <ServiceCategoriesModal />
      <ServiceCategoriesDeleteModal />

      <ApplicantsEditModal />
      <PrivacyPolicyModal />
      <TermsOfServiceModal />

      <ProfileModal />

      <TimeTrackerModal />

      <AddRoleModal />
      <EditRoleModal />
      <DeleteRoleModal />
      <DeleteWarningModal />
    </>
  );
};
