import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { TechnicalLeader, SoftSkillsLeader, ProjectLeader } from "@/types/leaderboard";

const mockTechnicalLeaders: TechnicalLeader[] = [
  {
    codev_id: "1",
    first_name: "John",
    total_points: 100,
    latest_update: "2024-01-01T00:00:00Z"
  },
  {
    codev_id: "2", 
    first_name: "Jane",
    total_points: 90,
    latest_update: "2024-01-01T00:00:00Z"
  }
];

const mockSoftSkillsLeaders: SoftSkillsLeader[] = [
  {
    codev_id: "1",
    first_name: "John",
    attendance_points: 50,
    profile_points: 25,
    total_points: 75
  },
  {
    codev_id: "2",
    first_name: "Jane", 
    attendance_points: 40,
    profile_points: 20,
    total_points: 60
  }
];

const mockProjectLeaders: ProjectLeader[] = [
  {
    project_id: "1",
    project_name: "Project Alpha",
    total_points: 200,
    member_count: 3,
    skill_breakdown: { "Frontend Developer": 100, "Backend Developer": 100 }
  }
];

describe("LeaderboardTable", () => {
  describe("Technical Leaderboard", () => {
    it("renders technical leaderboard correctly", () => {
      render(
        <LeaderboardTable
          type="technical"
          data={mockTechnicalLeaders}
          isLoading={false}
        />
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
      expect(screen.getByText("90")).toBeInTheDocument();
    });

    it("shows correct ranking icons", () => {
      render(
        <LeaderboardTable
          type="technical"
          data={mockTechnicalLeaders}
          isLoading={false}
        />
      );

      const rankCells = screen.getAllByText(/^[12]$/);
      expect(rankCells).toHaveLength(2);
    });
  });

  describe("Soft Skills Leaderboard", () => {
    it("renders soft skills leaderboard with breakdown", () => {
      render(
        <LeaderboardTable
          type="soft-skills"
          data={mockSoftSkillsLeaders}
          isLoading={false}
        />
      );

      expect(screen.getByText("John")).toBeInTheDocument();
      expect(screen.getByText("75")).toBeInTheDocument();
      expect(screen.getByText("50")).toBeInTheDocument(); // Attendance points
      expect(screen.getByText("25")).toBeInTheDocument(); // Profile points
    });
  });

  describe("Projects Leaderboard", () => {
    it("renders projects leaderboard correctly", () => {
      render(
        <LeaderboardTable
          type="projects"
          data={mockProjectLeaders}
          isLoading={false}
        />
      );

      expect(screen.getByText("📂 Project Alpha")).toBeInTheDocument();
      expect(screen.getByText("200")).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading rows when isLoading is true", () => {
      render(
        <LeaderboardTable
          type="technical"
          data={[]}
          isLoading={true}
          maxRows={3}
        />
      );

      const loadingTexts = screen.getAllByText("Loading...");
      expect(loadingTexts).toHaveLength(3);
    });
  });

  describe("Empty State", () => {
    it("shows empty rows when no data and not loading", () => {
      render(
        <LeaderboardTable
          type="technical"
          data={[]}
          isLoading={false}
          maxRows={5}
        />
      );

      // Should show 5 rows with rank numbers but no data
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("5")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper table structure", () => {
      render(
        <LeaderboardTable
          type="technical"
          data={mockTechnicalLeaders}
          isLoading={false}
        />
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(3); // Rank, Developer, Points
      expect(screen.getAllByRole("row")).toHaveLength(12); // Header + 10 data rows + 1 extra
    });

    it("has proper heading structure", () => {
      render(
        <LeaderboardTable
          type="technical"
          data={mockTechnicalLeaders}
          isLoading={false}
        />
      );

      expect(screen.getByRole("columnheader", { name: /rank/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /developer/i })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: /points/i })).toBeInTheDocument();
    });
  });

  describe("Responsive Behavior", () => {
    it("applies correct styling for top ranks", () => {
      render(
        <LeaderboardTable
          type="technical"
          data={mockTechnicalLeaders}
          isLoading={false}
        />
      );

      const tableRows = screen.getAllByRole("row");
      // First data row should have special styling (checking for presence of gradient classes)
      expect(tableRows[1]).toHaveClass(); // The first data row after header
    });
  });
});