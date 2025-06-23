"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/Components/ui/dialog";

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
            You are currently Inactive
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray text-center text-sm">
          Your account is currently inactive. For assistance, please contact us
          at codebility.dev@gmail.com.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default UserInactiveModal;
