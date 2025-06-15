import Image from "next/image";
import { Box } from "@/Components/shared/dashboard";
import { defaultAvatar } from "@/public/assets/images";
import { createClientServerComponent } from "@/utils/supabase/server";
import { format } from "date-fns";

import { PostType } from "../_services/query";

type Props = {
  params: {
    postId: string;
  };
};

export default async function PostPage({ params }: Props) {
  const supabase = await createClientServerComponent(); // ✅ ensure 'await' is here

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `*,
       author_id(
       first_name,
       last_name,
       image_url
       )`,
    )
    .eq("id", params.postId)
    .single<PostType>();

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading post: {error.message}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-[50%] max-w-screen-lg flex-col gap-4">
      <Box className="mx-auto w-full rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center">
            <Image
              src={post.author_id?.image_url || defaultAvatar}
              alt={`${post.author_id?.first_name}'s profile`}
              className="mr-4 h-12 w-12 rounded-full object-cover"
              width={40}
              height={40}
            />
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800 dark:text-gray-100">
                {post.author_id
                  ? `${post.author_id.first_name} ${post.author_id.last_name}`
                  : "Codebility"}
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(post.created_at), "MMM d, yyyy")}
            </p>
          </div>

          <img
            src={post.image_url || "/assets/images/bg-certificate.png"}
            alt="Post image"
            className="h-full w-full object-cover"
          />
          <p className="mb-4 mt-4 text-justify text-gray-600 dark:text-gray-400">
            {post.content}
          </p>
        </div>
      </Box>
    </div>
  );
}
