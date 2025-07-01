import { useState } from "react";
import { Input } from "@/Components/shared/dashboard/input";
import { Button } from "@/Components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

import { Textarea } from "@codevs/ui/textarea";

import { addPost } from "../_services/action";

const CreatePostForm = ({
  className,
  onSuccess,
}: {
  className?: string;
  onSuccess?: () => void;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
          folder: "postImage",
        });
      }

      const newPost = await addPost(title, content, user?.id, image_url!);

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
      <Textarea
        name="content"
        placeholder="Enter content"
        required
        className="h-[600px] w-full"
      />
      {/* Optional image input */}

      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
          } else {
            setImage(null);
          }
        }}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Post"}
      </Button>
    </form>
  );
};

export default CreatePostForm;
