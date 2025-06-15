"use client";

import EditPostForm from "@/app/home/feeds/_components/EditPostForm";
import { PostType } from "@/app/home/feeds/_services/query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

interface EditPostModalProps {
  post: PostType;
  onPostUpdated: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  post,
  onPostUpdated,
  isOpen,
  onClose,
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
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <EditPostForm
          post={post}
          onPostUpdated={onPostUpdated}
          onSuccess={onClose}
          className="flex-grow"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditPostModal;
