import { useState } from "react";
import { Input } from "@/components/shared/dashboard/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

import { addPost } from "../_services/action";
import MarkdownEditor from "./MarkdownEditor";
import ThumbnailUpload from "./ThumbnailUpload";

const CreatePostForm = ({
  className,
  onSuccess,
}: {
  className?: string;
  onSuccess?: () => void;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageIds, setUploadedImageIds] = useState<string[]>([]);
  const fetchPosts = useFeedsStore((state) => state.fetchPosts);
  const { user } = useUserStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    setIsSubmitting(true);

    try {
      const formData = new FormData(form);

      const title = formData.get("title") as string;
      const content = formData.get("content") as string;
      const imageFile = image;

      let image_url;

      if (imageFile) {
        image_url = await uploadImage(imageFile, {
          bucket: "codebility",
          folder: "postImage/thumbnail",
        });
      }

      const newPost = await addPost({
        title,
        content,
        author_id: user?.id,
        image_url,
        content_image_ids: uploadedImageIds,
      });

      // Refresh Posts
      await fetchPosts();

      // Notify
      toast.success("Post created successfully!");

      // Close modal on success
      if (onSuccess) onSuccess();

      // Reset form
      form.reset();
      setImage(null);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${className}`}
    >
      <Input
        name="title"
        placeholder="Enter title"
        required
        className="w-full"
      />

      {/* Optional image input */}

      <ThumbnailUpload onChange={setImage} />

      <MarkdownEditor
        initialValue={"# Hello"}
        onChange={(v) => {
          // update hidden input
          const hiddenInput = document.querySelector<HTMLInputElement>(
            'input[name="content"]',
          );
          if (hiddenInput) hiddenInput.value = v;
        }}
        onImagesUploaded={setUploadedImageIds}
      />

      <input type="hidden" name="content" value={""} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
};

export default CreatePostForm;
