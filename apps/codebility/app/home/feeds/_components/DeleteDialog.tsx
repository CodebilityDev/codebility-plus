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
  isLoading?: boolean;
}

export function DeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-light-300 dark:bg-dark-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="dark:text-light-900 text-black">
            Delete Post
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray dark:text-light-500">
            Are you sure you want to delete this post? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            disabled={isLoading}
            className="border-light-700 dark:border-dark-200 
                       bg-light-800 dark:bg-dark-200 dark:text-light-900 text-black"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
