"use client";

import PostView from "@/app/home/feeds/_components/PostView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visuallyHidden";

interface FeedPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const FeedPostModal: React.FC<FeedPostModalProps> = ({
  isOpen,
  onClose,
  postId,
}) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      
    >
      <DialogHeader>
        <DialogTitle>
          <VisuallyHidden>Post</VisuallyHidden>
        </DialogTitle>
      </DialogHeader>
      <DialogContent className="flex max-w-2xl max-h-[80vh] flex-col overflow-auto">
        <PostView postId={postId} />
      </DialogContent>
    </Dialog>
  );
};

export default FeedPostModal;
