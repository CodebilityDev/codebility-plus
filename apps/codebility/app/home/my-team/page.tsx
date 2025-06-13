// my-team/page.tsx - Simple test version
import MyTeamPage from "./MyTeamPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Mock data for testing
const mockProjectData = [
  {
    project: {
      id: "proj-1",
      name: "Codebility Portal"
    },
    teamLead: {
      data: {
        id: "lead-1",
        first_name: "Jzeff",
        last_name: "Kendrew Somera",
        email_address: "jzeff@codebility.com",
        image_url: null,
        role: "team_leader",
        display_position: "CEO / Founder",
        joined_at: "2024-01-01T00:00:00Z"
      }
    },
    members: {
      data: [
        {
          id: "member-1",
          first_name: "John",
          last_name: "Doe",
          email_address: "john@codebility.com",
          image_url: null,
          role: "member",
          display_position: "Frontend Developer",
          joined_at: "2024-01-15T00:00:00Z"
        },
        {
          id: "member-2",
          first_name: "Jane",
          last_name: "Smith",
          email_address: "jane@codebility.com",
          image_url: null,
          role: "member",
          display_position: "Backend Developer",
          joined_at: "2024-01-20T00:00:00Z"
        }
      ]
    }
  }
];

const MyTeamServerPage = async () => {
  return <MyTeamPage projectData={mockProjectData} />;
};

export default MyTeamServerPage;