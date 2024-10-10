export type ViewType = {
  first_name: string;
  last_name: string;
};

export type User = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  pronoun: string;
  address: string;
  about: string;
  education: string;
  positions: string[];
  main_position: string;
  portfolio_website: string;
  updated_at: string;
  tech_stacks: string[];
  image_url: string;
  start_time: string;
  end_time: string;
};

export type Client = {
  id: number;
  name: string;
  logo: string | null;
  location: string | null;
  email: string | null;
  contact_number: string | null;
  linkedin_link: string | null;
  start_time: Date | null;
  end_time: Date | null;
  is_archive: boolean;
};

export type Member = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  position: string;
};
