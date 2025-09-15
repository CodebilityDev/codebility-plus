"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserInactiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserInactiveModal: React.FC<UserInactiveModalProps> = ({
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
          <DialogTitle className="text-center">
            You are currently inactive
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray text-center text-sm">
          Your account is currently inactive. Please Contanct Admins to reactivate
          your account.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default UserInactiveModal;
