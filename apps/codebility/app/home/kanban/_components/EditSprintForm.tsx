import { useState } from "react";
import { Input } from "@/components/shared/dashboard/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

import { Textarea } from "@codevs/ui/textarea";

import { addPost } from "../../feeds/_services/action";
import { EditSprint } from "../[projectId]/actions";
import { KanbanSprintData } from "../[projectId]/page";

const EditSprintForm = ({
  className,
  onSuccess,
  sprint,
}: {
  className?: string;
  onSuccess?: () => void;
  sprint: KanbanSprintData;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    setIsSubmitting(true);

    try {
      const formData = new FormData(form);

      const { isSuccess, error } = await EditSprint(formData);

      if (!isSuccess) throw error;

      // Notify
      toast.success("Sprint edited successfully!");

      // Close modal on success
      if (onSuccess) onSuccess();

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error editing sprint:", error);
      toast.error("Failed to edit sprint.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${className}`}
    >
      {/* Hidden input */}
      <input type="hidden" name="sprintId" value={sprint.id} />
      <input type="hidden" name="boardId" value={sprint.board_id} />
      <input type="hidden" name="projectId" value={sprint.project_id} />

      <Input
        id="sprintName"
        name="sprintName"
        defaultValue={sprint.name}
        required
        className="mt-0 w-full"
      />

      <Input
        id="boardName"
        name="boardName"
        defaultValue={sprint.kanban_board?.name}
        required
        className="mt-0 w-full"
      />

      <Button type="submit" className="mt-4 w-full" disabled={isSubmitting}>
        {isSubmitting ? "Editing..." : "Edit Sprint"}
      </Button>
    </form>
  );
};

export default EditSprintForm;
