"use client";

import EditSprintForm from "@/app/home/kanban/_components/EditSprintForm";
import { KanbanSprintData } from "@/app/home/kanban/[projectId]/page";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditSprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  sprint: KanbanSprintData;
}

const EditSprintModal: React.FC<EditSprintModalProps> = ({
  isOpen,
  onClose,
  sprint,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>Edit Sprint</DialogTitle>
        </DialogHeader>
        <EditSprintForm
          onSuccess={onClose}
          className="flex-grow"
          sprint={sprint}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditSprintModal;
