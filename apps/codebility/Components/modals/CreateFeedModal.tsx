"use client";

import CreateFeedForm from "@/app/home/feeds/_components/CreateFeedForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

interface CreateFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateFeedModal: React.FC<CreateFeedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const handleFormSubmit = (data: FormData) => {
    console.log("Form Data:", Object.fromEntries(data.entries()));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Feed</DialogTitle>
        </DialogHeader>
        <CreateFeedForm onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateFeedModal;
