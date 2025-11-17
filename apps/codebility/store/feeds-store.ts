import { create } from "zustand";
import { getPosts, PostType } from "../app/home/feeds/_services/query";

interface FeedsState {
  posts: PostType[];
  isLoading: boolean;
  fetchPosts: () => Promise<void>;
  setPosts: (posts: PostType[]) => void;
}

export const useFeedsStore = create<FeedsState>((set) => ({
  posts: [],
  isLoading: true,

  fetchPosts: async () => {
    set({ isLoading: true });
    const posts = await getPosts();
    set({ posts, isLoading: false });
  },

  setPosts: (posts) => set({ posts }),
}));
