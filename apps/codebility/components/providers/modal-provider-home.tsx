"use client";

import { lazy, Suspense, type ComponentType } from "react";

import { useModal as useModalRoot } from "@/hooks/modals/use-modal";
import { useModal as useModalApplicants } from "@/hooks/modals/use-modal-applicants";
import { useModal as useModalClients } from "@/hooks/modals/use-modal-clients";
import { useModal as useModalProjects } from "@/hooks/modals/use-modal-projects";
import { useModal as useModalSprints } from "@/hooks/modals/use-modal-sprints";
import { useModal as useModalUsers } from "@/hooks/modals/use-modal-users";

/**
 * Renders only the single modal that is currently open, lazy-loading its chunk
 * on first use. Previously all 23 dialogs were mounted on every authenticated
 * page, which cost thousands of renders at startup; nothing is mounted now until
 * `onOpen("<type>")` fires.
 *
 * Modals are spread across seven independent Zustand stores, so this reads each
 * store's `type` and picks the first non-null one. Only one modal can be open at
 * a time by design: opening a second type on a different store while the first
 * is open would need a coordinator, which nothing currently does.
 */
const MODALS: Record<string, ComponentType<any>> = {
  // dashboard
  dashboardCurrentProjectModal: lazy(
    () => import("@/app/home/(dashboard)/_components/DashboardCurrentProjectModal"),
  ),

  // kanban
  boardAddModal: lazy(() => import("@/app/home/kanban/_components/BoardAddModal")),
  ColumnAddModal: lazy(
    () =>
      import("@/app/home/kanban/[projectId]/[id]/_components/kanban_modals/KanbanColumnAddModal"),
  ),
  taskAddModal: lazy(
    () => import("@/app/home/kanban/[projectId]/[id]/_components/tasks/TaskAddModal"),
  ),
  taskViewModal: lazy(
    () => import("@/app/home/kanban/[projectId]/[id]/_components/tasks/TaskViewModal"),
  ),
  taskEditModal: lazy(
    () => import("@/app/home/kanban/[projectId]/[id]/_components/tasks/TaskEditModal"),
  ),
  taskDeleteModal: lazy(
    () => import("@/app/home/kanban/[projectId]/[id]/_components/tasks/TaskDeleteModal"),
  ),

  // shared / root store
  techStackModal: lazy(() => import("@/components/modals/TechStackModal")),
  privacyPolicyModal: lazy(() => import("@/components/modals/PrivacyPolicyModal")),
  termsOfServiceModal: lazy(() => import("@/components/modals/TermsOfServiceModal")),
  timeTrackerTicketModal: lazy(() => import("@/components/modals/TimeTrackerModal")),
  scheduleModal: lazy(() => import("@/components/modals/AvailableTimeModal")),
  deleteWarningModal: lazy(() => import("@/components/modals/DeleteWarningModal")),
  surveyModal: lazy(() => import("@/components/modals/SurveyModal")),

  // projects store
  projectAddModal: lazy(() => import("@/app/home/projects/_components/ProjectAddModal")),
  projectEditModal: lazy(() => import("@/app/home/projects/_components/ProjectEditModal")),
  projectViewModal: lazy(() => import("@/app/home/projects/_components/ProjectViewModal")),
  projectDeleteModal: lazy(
    () => import("@/app/home/projects/_components/ProjectDeleteModal"),
  ),
  KanbanAddMembersModal: lazy(
    () =>
      import("@/app/home/kanban/[projectId]/[id]/_components/kanban_modals/KanbanAddMembersModal"),
  ),

  // clients store
  clientAddModal: lazy(() => import("@/app/home/clients/_components/ClientAddModal")),
  clientEditModal: lazy(() => import("@/app/home/clients/_components/ClientEditModal")),

  // users store
  profileModal: lazy(() => import("@/app/home/interns/_components/ProfileModal")),

  // sprints store
  sprintAddModal: lazy(
    () => import("@/app/home/kanban/[projectId]/_components/SprintAddModal"),
  ),

  // applicants store
  applicantsEditModal: lazy(() => import("@/components/modals/ApplicantsEditModal")),
};

function useOpenModalType(): string | null {
  const root = useModalRoot((s) => (s.isOpen ? s.type : null));
  const applicants = useModalApplicants((s) => (s.isOpen ? s.type : null));
  const clients = useModalClients((s) => (s.isOpen ? s.type : null));
  const projects = useModalProjects((s) => (s.isOpen ? s.type : null));
  const sprints = useModalSprints((s) => (s.isOpen ? s.type : null));
  const users = useModalUsers((s) => (s.isOpen ? s.type : null));

  return root ?? applicants ?? clients ?? projects ?? sprints ?? users ?? null;
}

export const ModalProviderHome = () => {
  const type = useOpenModalType();

  if (!type) return null;

  const Modal = MODALS[type];
  if (!Modal) return null;

  return (
    <Suspense fallback={null}>
      <Modal />
    </Suspense>
  );
};
