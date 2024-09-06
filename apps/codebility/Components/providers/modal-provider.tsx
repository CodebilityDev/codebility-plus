"use client";

import { useEffect, useState } from "react";
import FaqsModal from "@/app/(marketing)/_components/marketing_modals/marketing-faqs-modal";
import PrivacyPolicyModalHome from "@/app/(marketing)/_components/marketing_modals/marketing-privacy-policy-modal";
import TermsAndConditionModal from "@/app/(marketing)/_components/marketing_modals/marketing-terms-and-condition-modal";
import AddRoleModal from "@/Components/modals/AddRoleModal";
import AvailableTimeModal from "@/Components/modals/AvailableTimeModal";
import BoardAddModal from "@/Components/modals/BoardAddModal";
import ClientAddModal from "@/Components/modals/ClientAddModal";
import ClientEditModal from "@/Components/modals/ClientEditModal";
import ContactUsModal from "@/Components/modals/ContactUsModal";
import DeleteRoleModal from "@/Components/modals/DeleteRoleModal";
import EditRoleModal from "@/Components/modals/EditRoleModal";
import ListAddModal from "@/Components/modals/ListAddModal";
import PrivacyPolicyModal from "@/Components/modals/PrivacyPolicyModal";
import ProfileModal from "@/Components/modals/ProfileModal";
import ProjectAddModal from "@/Components/modals/ProjectAddModal";
import ProjectDeleteModal from "@/Components/modals/ProjectDeleteModal";
import ProjectEditModal from "@/Components/modals/ProjectEditModal";
import ProjectViewModal from "@/Components/modals/ProjectViewModal";
import ServicesModal from "@/Components/modals/ServicesModal";
import TaskAddModal from "@/Components/modals/TaskAddModal";
import TaskViewEditModal from "@/Components/modals/TaskViewEditModal";
import TaskViewModal from "@/Components/modals/TaskViewModal";
import TechStackModal from "@/Components/modals/TechStackModal";
import TermsOfServiceModal from "@/Components/modals/TermsOfServiceModal";
import TimeTrackerModal from "@/Components/modals/TimeTrackerModal";
import ServiceCategoriesDeleteModal from "@/Components/modals/ServiceCategoriesDeleteModal";
import ServiceCategoriesModal from "@/Components/modals/ServiceCategoriesModal";
import ApplicantsAddModal from "@/Components/modals/ApplicantsAddModal";
export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <TechStackModal />
      <AvailableTimeModal />

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

      <ClientAddModal />
      <ClientEditModal />

      <ServicesModal />
      <ServiceCategoriesModal />
      <ServiceCategoriesDeleteModal />

      <ApplicantsAddModal />

      <ContactUsModal />
      <PrivacyPolicyModal />
      <TermsOfServiceModal />

      <ProfileModal />

      <TimeTrackerModal />

      <TermsAndConditionModal />
      <PrivacyPolicyModalHome />
      <FaqsModal />

      <AddRoleModal />
      <EditRoleModal />
      <DeleteRoleModal />
    </>
  );
};
