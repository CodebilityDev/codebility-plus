import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea-home";

export default function CreatePost() {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <Textarea
        placeholder="What's on your mind?"
        className="w-full"
        rows={3}
      />
      <Button className="mt-3 bg-blue-500 text-white hover:bg-blue-600">
        Post
      </Button>
    </div>
  );
}
