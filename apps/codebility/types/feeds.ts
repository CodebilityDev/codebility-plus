// Shared feeds types

export type PostType = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  image_url?: string;

  author_id?: {
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string;
  };

  upvote_count?: number;
  comment_count?: number;

  tags: {
    tag_id: string;
    name: string | null;
  }[];
};

export interface UserMention {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  image_url: string | null;
  headline?: string | null;
}

export interface CommentWithMentions {
  id: string;
  content: string;
  created_at: string;
  commenter: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string | null;
  };
  mentions?: UserMention[];
}