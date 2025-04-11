export type TeamMemberCardProps = {
  id: string;
  first_name: string;
  last_name: string;
  display_position: string;
  image_url: string;
  application_status: string;
};

export type OrgChartProps = {
  data: TeamMemberCardProps[];
};
