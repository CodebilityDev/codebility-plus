"use client";

import { useEffect, useState } from "react";
import AddRoleModal from "@/Components/modals/AddRoleModal";
import ApplicantsAddModal from "@/Components/modals/ApplicantsAddModal";
import ApplicantsEditModal from "@/Components/modals/ApplicantsEditModal";
import BoardAddModal from "@/Components/modals/BoardAddModal";
import ClientAddModal from "@/Components/modals/ClientAddModal";
import ClientEditModal from "@/Components/modals/ClientEditModal";
import DeleteRoleModal from "@/Components/modals/DeleteRoleModal";
import EditRoleModal from "@/Components/modals/EditRoleModal";
import ListAddModal from "@/Components/modals/ListAddModal";
import PrivacyPolicyModal from "@/Components/modals/PrivacyPolicyModal";
import ProfileModal from "@/Components/modals/ProfileModal";
import ProjectAddModal from "@/Components/modals/ProjectAddModal";
import ProjectDeleteModal from "@/Components/modals/ProjectDeleteModal";
import ProjectEditModal from "@/Components/modals/ProjectEditModal";
import ProjectViewModal from "@/Components/modals/ProjectViewModal";
import ServiceCategoriesDeleteModal from "@/Components/modals/ServiceCategoriesDeleteModal";
import ServiceCategoriesModal from "@/Components/modals/ServiceCategoriesModal";
import ServicesModal from "@/Components/modals/ServicesModal";
import TaskAddModal from "@/Components/modals/TaskAddModal";
import TaskViewEditModal from "@/Components/modals/TaskViewEditModal";
import TaskViewModal from "@/Components/modals/TaskViewModal";
import TermsOfServiceModal from "@/Components/modals/TermsOfServiceModal";
import TimeTrackerModal from "@/Components/modals/TimeTrackerModal";

import ProjectMembersModal from "../modals/ProjectMembersModal";

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
      <TaskViewEditModal />
      <TaskViewModal />

      <BoardAddModal />
      <BoardAddModal />
      <ListAddModal />

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

      <ApplicantsAddModal />
      <ApplicantsEditModal />
      <PrivacyPolicyModal />
      <TermsOfServiceModal />

      <ProfileModal />

      <TimeTrackerModal />

      <AddRoleModal />
      <EditRoleModal />
      <DeleteRoleModal />
    </>
  );
};
