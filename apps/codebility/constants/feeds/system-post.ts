import type { PostType } from "@/types/feeds";

export const SYSTEM_POST: PostType = {
  id: "00000000-0000-0000-0000-000000000001",
  title: "Join the Codebility Feeds! 🚀",
  content: `Welcome to the Codebility Community Feed — the central space where developers connect, share ideas, and stay informed.

---

## 🧠 What This Feed Is For

This feed is built for two core purposes:

📢 **Organization-wide announcements**  
💬 **Community-driven posts from members**

Whether you're sharing an update, a helpful tip, a question, a learning resource, or something cool you're building — this is your space.

---

## ⭐ Earn as You Contribute

Your activity here is rewarded:

📝 Earn points for every post you create  
❤️ Gain more points when your posts receive likes and comments

The more value you bring to the community, the more you grow within it.

---

## ⏱ Posting Guidelines

To keep the feed high-quality and meaningful:

✓ Each member can create **one post per day**  
✓ Make it count — share something useful, inspiring, or thought-provoking

---

## 🚀 Build Together

This feed isn't just a timeline — it's a shared space to learn, collaborate, and grow as developers.

**Welcome to the community.**  
We're excited to see what you'll share!

**-Codebility Team**

`,
  image_url: "/assets/images/system-post-feed.png",
  created_at: "2026-02-11T00:00:00.000Z",
  author_id: {
    id: "00000000-0000-0000-0000-000000000000",
    first_name: "Codebility",
    last_name: "",
    image_url: "/favicon.ico",
  },
  upvote_count: 0,
  comment_count: 0,
  tags: [
    { tag_id: "system-1", name: "New Release" },
    { tag_id: "system-2", name: "Announcement" },
  ],
};