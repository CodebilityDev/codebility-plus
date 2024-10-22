export type DeclinedApplicant = {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  portfolio_website: string;
  github_link: string;
  tech_stacks: string[];
  image_url: string | null;
};
