"use client";

import {
  acceptPromotionToCodev,
  declinePromotionToCodev,
} from "@/app/home/_services/actions";
import { Button } from "@/Components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";
import { useUserStore } from "@/store/codev-store";
import toast from "react-hot-toast";

interface PromoteToCodevModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  onPromotionAccepted?: () => void;
}

const PromoteToCodevModal: React.FC<PromoteToCodevModalProps> = ({
  isOpen,
  onClose,
  userId,
  onPromotionAccepted,
}) => {
  const { hydrate } = useUserStore.getState();

  const handleAccept = async (id: string) => {
    try {
      // Immediately notify parent component
      onPromotionAccepted?.();

      // Call the promotion API
      await acceptPromotionToCodev(id);

      // Update the store
      await hydrate();

      toast.success("Promoted to Codev!");
      onClose();
    } catch (error) {
      console.error("Error accepting promotion:", error);
      toast.error("Failed to accept promotion. Please try again.");
      // If there's an error, you might want to revert the optimistic update
    }
  };
  const handleDecline = async (id: string) => declinePromotionToCodev(id);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="flex max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle className="text-center">Become a Codev</DialogTitle>
        </DialogHeader>
        <p className="text-gray text-center text-sm">
          Congratulations! You’ve reached the required points to become a Codev.
          Would you like to proceed with your promotion?
        </p>
        <div className="flex justify-center gap-4">
          <Button
            className="text-white hover:bg-blue-700"
            onClick={() => {
              if (userId) {
                handleAccept(userId);
                onClose();
              }
            }}
          >
            Accept
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => {
              if (userId) {
                handleDecline(userId);
                onClose();
              }
            }}
          >
            Decline
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoteToCodevModal;
