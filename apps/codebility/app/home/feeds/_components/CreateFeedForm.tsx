import { useState } from "react";
import { Input } from "@/Components/shared/dashboard/input";
import { Button } from "@/Components/ui/button";

import { Textarea } from "@codevs/ui/textarea";

const CreateFeedForm = ({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void;
}) => {
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (image) formData.append("image", image);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        name="description"
        placeholder="Enter the description of the feed"
        required
        className="w-full"
      />
      <Input
        type="url"
        name="url"
        placeholder="Enter the URL of the feed"
        required
        className="w-full"
      />
      <Input
        type="file"
        name="image"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="w-full"
      />
      <Button type="submit" className="w-full">
        Create Feed
      </Button>
    </form>
  );
};

export default CreateFeedForm;
