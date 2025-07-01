import { useState } from "react";
import { Input } from "@/Components/shared/dashboard/input";
import { Button } from "@/Components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

import { Textarea } from "@codevs/ui/textarea";

import { addPost, editPost } from "../_services/action";
import { PostType } from "../_services/query";

const EditPostForm = ({
  post,
  className,
  onSuccess,
  onPostUpdated,
}: {
  post: PostType;
  className?: string;
  onSuccess?: () => void;
  onPostUpdated: () => void;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUserStore();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

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

      const newPost = await editPost(post.id, title, content, image_url!);

      // Notify
      toast.success("Post edited successfully!");

      // Close modal on success
      if (onSuccess) onSuccess();

      //Refresh post
      onPostUpdated();

      // Reset form
      form.reset();
      setImage(null);
    } catch (error) {
      console.error("Error editing post:", error);
      toast.error("Failed to edit post.");
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        name="content"
        placeholder="Enter content"
        required
        className="h-[600px] w-full"
        value={content}
        onChange={(e) => setContent(e.target.value)}
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
        {isSubmitting ? "Editing..." : "Edit Post"}
      </Button>
    </form>
  );
};

export default EditPostForm;
