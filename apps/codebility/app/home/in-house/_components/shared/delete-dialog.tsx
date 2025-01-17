import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@codevs/ui/alert-dialog";

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  name: string;
  isLoading?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  name,
  isLoading,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-light-300 dark:bg-dark-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-light-900 text-black">
            Delete Member
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray dark:text-light-500">
            Are you sure you want to delete {name}? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-light-800 dark:bg-dark-200 dark:text-light-900 border-light-700 dark:border-dark-200 text-black"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
