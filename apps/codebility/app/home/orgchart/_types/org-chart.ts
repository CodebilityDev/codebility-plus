export type TeamMemberCardProps = {
  id?: string
  team?: string 
  profile_id: {
    first_name: string;
    last_name: string;
    main_position: string;
    image_url: string;
  } | undefined
};

export type OrgChartProps = {
  data: TeamMemberCardProps[];
};
