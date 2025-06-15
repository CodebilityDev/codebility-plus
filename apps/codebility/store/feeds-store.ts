import {create} from "zustand";
import { getPosts, PostType } from "../app/home/feeds/_services/query";

interface FeedsState {
  posts: PostType[];
  fetchPosts: () => Promise<void>;
  setPosts: (posts: PostType[]) => void;
}

export const useFeedsStore = create<FeedsState>((set) => ({
  posts: [],
  fetchPosts: async () => {
    const posts = await getPosts();
    set({ posts });
  },
  setPosts: (posts) => set({ posts }),
}));
