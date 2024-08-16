"use client"

import { useEffect, useState } from "react"
import AvailableTimeModal from "@/Components/modals/AvailableTimeModal"
import TaskAddModal from "@/Components/modals/TaskAddModal"
import TaskViewEditModal from "@/Components/modals/TaskViewEditModal"
import TechStackModal from "@/Components/modals/TechStackModal"
import ClientAddModal from "@/Components/modals/ClientAddModal"
import ClientEditModal from "@/Components/modals/ClientEditModal"
import ContactUsModal from "@/Components/modals/ContactUsModal"
import ProjectAddModal from "@/Components/modals/ProjectAddModal"
import ProjectEditModal from "@/Components/modals/ProjectEditModal"
import ProjectViewModal from "@/Components/modals/ProjectViewModal"
import ServicesModal from "@/Components/modals/ServicesModal"
import ProfileModal from "@/Components/modals/ProfileModal"
import TermsOfServiceModal from "@/Components/modals/TermsOfServiceModal"
import PrivacyPolicyModal from "@/Components/modals/PrivacyPolicyModal"
import TimeTrackerModal from "@/Components/modals/TimeTrackerModal"
import ListAddModal from "@/Components/modals/ListAddModal"
import BoardAddModal from "@/Components/modals/BoardAddModal"
import TermsAndConditionModal from "@/app/(home)/components/modals/TermsAndConditionModal"
import PrivacyPolicyModalHome from "@/app/(home)/components/modals/PrivacyPolicyModal"
import ProjectDeleteModal from "@/Components/modals/ProjectDeleteModal"
import TaskViewModal from "@/Components/modals/TaskViewModal"
import AddRoleModal from "@/Components/modals/AddRoleModal"
import EditRoleModal from "@/Components/modals/EditRoleModal"
import DeleteRoleModal from "@/Components/modals/DeleteRoleModal"
import FaqsModal from "@/app/(home)/components/modals/FaqsModal"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) {
    return null
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
  )
}
