import { Box } from "@/components/shared/dashboard";
import { Sparkles, PlusCircle } from "lucide-react";

interface FirstPostPromptProps {
  onCreatePost: () => void;
}

export default function FirstPostPrompt({
  onCreatePost,
}: FirstPostPromptProps) {
  return (
    <Box className="group relative flex h-[300px] cursor-pointer flex-col justify-center rounded-xl p-6 transition hover:shadow-md">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm">
          <Sparkles className="h-7 w-7" />
        </div>

        <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-100">
          Create your first post
        </h2>

        <p className="mb-6 max-w-xs text-sm text-gray-500 dark:text-gray-400">
          Share something with the community and earn social points by posting 🚀
        </p>

        {/* CTA */}
        <button
          onClick={onCreatePost}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-blue-500 hover:to-cyan-500"
        >
          <PlusCircle className="h-4 w-4" />
          Create Post
        </button>
      </div>
    </Box>
  );
}
