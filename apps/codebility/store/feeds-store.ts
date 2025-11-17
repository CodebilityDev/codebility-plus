import { create } from "zustand";
import { getPosts, PostType } from "../app/home/feeds/_services/query";

interface FeedsState {
  posts: PostType[];
  isFetchingPosts: boolean;  // only for feed fetch
  fetchPosts: () => Promise<void>;
  updatePost: (postId: string | number, data: Partial<PostType>) => void;
  setPosts: (posts: PostType[]) => void;
}

export const useFeedsStore = create<FeedsState>((set) => ({
  posts: [],
  isFetchingPosts: true,

  fetchPosts: async () => {
    set({ isFetchingPosts: true });
    const posts = await getPosts();
    set({ posts, isFetchingPosts: false });
  },

  updatePost: (postId, data) =>
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === postId ? { ...p, ...data } : p
      ),
    })),

  setPosts: (posts) => set({ posts }),
}));
