import { useState } from "react";
import { Input } from "@/components/shared/dashboard/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { useFeedsStore } from "@/store/feeds-store";
import { uploadImage } from "@/utils/uploadImage";
import toast from "react-hot-toast";

import { Textarea } from "@codevs/ui/textarea";

import { addPost, editPost } from "../_services/action";
import { PostType } from "../_services/query";
import MarkdownEditor from "./MarkdownEditor";
import TagSelector from "./TagSelector";
import ThumbnailUpload from "./ThumbnailUpload";

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
  const [uploadedImageIds, setUploadedImageIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(
    post.tags.map((t) => Number(t.tag_id)),
  );

  const fetchPosts = useFeedsStore((state) => state.fetchPosts);

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

      await editPost({
        id: post.id,
        title,
        content,
        image_url: image_url!,
        content_image_ids: uploadedImageIds,
        tag_ids: selectedTagIds,
      });

      // Notify
      toast.success("Post edited successfully!");

      // Close modal on success
      if (onSuccess) onSuccess();

      //Refresh post
      await fetchPosts();
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
      className={`flex max-h-[calc(90vh-8rem)] flex-col gap-4 overflow-y-auto ${className}`}
    >
      <Input
        name="title"
        placeholder="Enter title"
        required
        className="w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Optional image input */}
      <div className="flex-none">
        <ThumbnailUpload onChange={setImage} defaultImage={post.image_url} />
      </div>

      <MarkdownEditor
        initialValue={content}
        onChange={(v) => {
          // update hidden input
          const hiddenInput = document.querySelector<HTMLInputElement>(
            'input[name="content"]',
          );
          if (hiddenInput) hiddenInput.value = v;
        }}
        onImagesUploaded={setUploadedImageIds}
      />

      <TagSelector
        selectedTags={selectedTagIds}
        onChange={(tags) => setSelectedTagIds(tags)}
      />

      <input type="hidden" name="content" value={""} />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Editing..." : "Edit Post"}
      </Button>
    </form>
  );
};

export default EditPostForm;
