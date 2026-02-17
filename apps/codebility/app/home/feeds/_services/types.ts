// app/home/feeds/_services/types.ts

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