"use client";

import { useState, useTransition } from "react";
import { FaqSection } from "./_components/FaqSection";
import { CommunityQuestions } from "./_components/CommunityQuestions";
import { NewQuestionModal, type NewQuestionValues } from "./_components/NewQuestionModal";
import {
  createHelpTicket,
  updateHelpTicket,
  uploadTicketAttachment,
  deleteTicketAttachment,
  getHelpTickets,
  type FaqItemRow,
  type HelpTicketWithRelations,
} from "./actions";
import { toast } from "sonner";

type HelpCenterClientProps = {
  initialFaqItems: FaqItemRow[];
  initialTickets: HelpTicketWithRelations[];
  isAdmin: boolean;
  currentCodevId: string | null;
};

export function HelpCenterClient({
  initialFaqItems,
  initialTickets,
  isAdmin,
  currentCodevId,
}: HelpCenterClientProps) {
  const [tickets, setTickets] = useState(initialTickets);
  const [isNewQuestionOpen, setIsNewQuestionOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<HelpTicketWithRelations | null>(null);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function refetchTickets() {
    const { data } = await getHelpTickets();
    if (data) setTickets(data);
  }

  function handleNewQuestion(values: NewQuestionValues) {
    setSubmitError(null);
    startTransition(async () => {
      const result = await createHelpTicket({
        title: values.title,
        description: values.description,
        tags: values.tags,
      });

      if (result.error || !result.data) {
        setSubmitError(result.error ?? "Something went wrong");
        toast.error(result.error ?? "Failed to post question");
        return;
      }

      for (const file of values.attachments) {
        const uploadResult = await uploadTicketAttachment(result.data.id, file);
        if (uploadResult.error) {
          console.error("Attachment upload failed:", uploadResult.error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setIsNewQuestionOpen(false);
      toast.success("Question posted");
      await refetchTickets();
    });
  }

  function handleEditQuestion(ticket: HelpTicketWithRelations) {
    setSubmitError(null);
    setTimeout(() => setEditingTicket(ticket), 150);
  }

  function handleSaveEdit(values: NewQuestionValues) {
    if (!editingTicket) return;
    setSubmitError(null);
    startTransition(async () => {
      const result = await updateHelpTicket({
        id: editingTicket.id,
        title: values.title,
        description: values.description,
        tags: values.tags,
      });

      if (result.error) {
        setSubmitError(result.error);
        toast.error(result.error);
        return;
      }

      // Delete attachments the user removed, including their storage objects.
      for (const attachmentId of values.removedAttachmentIds) {
        const attachment = editingTicket.attachments.find((a) => a.id === attachmentId);
        if (!attachment) continue;
        const deleteResult = await deleteTicketAttachment(attachment.id, attachment.file_path);
        if (deleteResult.error) {
          console.error("Failed to delete attachment:", deleteResult.error);
          toast.error(`Failed to remove ${attachment.file_name}`);
        }
      }

      // Upload any newly added attachments.
      for (const file of values.attachments) {
        const uploadResult = await uploadTicketAttachment(editingTicket.id, file);
        if (uploadResult.error) {
          console.error("Attachment upload failed:", uploadResult.error);
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      setEditingTicket(null);
      toast.success("Question updated");
      await refetchTickets();
    });
  }

  

  return (
    <div className="space-y-6 rounded-3xl bg-violet-50/40 p-6 dark:bg-slate-900/40">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          Help Center
        </h1>
        <p className="text-slate-400 dark:text-slate-500">
          Find answers to common questions or ask the community.
        </p>
      </div>

      {submitError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
          {submitError}
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[360px_1fr]">
        <FaqSection
          initialItems={initialFaqItems}
          isAdmin={isAdmin}
          onContactUs={() => setIsNewQuestionOpen(true)}
        />
        <CommunityQuestions
          tickets={tickets}
          isAdmin={isAdmin}
          currentCodevId={currentCodevId}
          onNewQuestion={() => setIsNewQuestionOpen(true)}
          onEditQuestion={handleEditQuestion}
          onTicketsChange={refetchTickets}
        />
      </div>

      <NewQuestionModal
        open={isNewQuestionOpen}
        onOpenChange={setIsNewQuestionOpen}
        onSubmit={handleNewQuestion}
        isSubmitting={isPending}
      />

      <NewQuestionModal
        open={!!editingTicket}
        onOpenChange={(open) => {
          if (!open) setEditingTicket(null);
        }}
        onSubmit={handleSaveEdit}
        isSubmitting={isPending}
        mode="edit"
        initialValues={
          editingTicket
            ? {
                title: editingTicket.title,
                description: editingTicket.description,
                tags: editingTicket.tags,
                attachments: editingTicket.attachments,
              }
            : undefined
        }
      />
    </div>
  );
}