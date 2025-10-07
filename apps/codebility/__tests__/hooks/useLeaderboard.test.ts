import { renderHook, waitFor } from "@testing-library/react";
import { useLeaderboard } from "@/hooks/useLeaderboard";

// Mock the API calls
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("useLeaderboard", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe("Technical Leaderboard", () => {
    it("fetches technical leaderboard data correctly", async () => {
      const mockData = {
        leaders: [
          {
            codev_id: "1",
            first_name: "John",
            total_points: 100,
            latest_update: "2024-01-01T00:00:00Z"
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      } as Response);

      const { result } = renderHook(() =>
        useLeaderboard({
          type: "technical",
          category: "Frontend Developer",
          timePeriod: "all"
        })
      );

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData.leaders);
      expect(result.current.state.error).toBeNull();
    });

    it("handles API errors correctly", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: "Server error" })
      } as Response);

      const { result } = renderHook(() =>
        useLeaderboard({
          type: "technical",
          category: "Frontend Developer"
        })
      );

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.state.error).toBeTruthy();
      expect(result.current.state.error?.message).toBe("Server error");
    });
  });

  describe("Soft Skills Leaderboard", () => {
    it("fetches soft skills data correctly", async () => {
      const mockData = {
        leaders: [
          {
            codev_id: "1",
            first_name: "John",
            attendance_points: 50,
            profile_points: 25,
            total_points: 75
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      } as Response);

      const { result } = renderHook(() =>
        useLeaderboard({
          type: "soft-skills"
        })
      );

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData.leaders);
    });
  });

  describe("Projects Leaderboard", () => {
    it("fetches projects data correctly", async () => {
      const mockData = {
        leaders: [
          {
            project_id: "1",
            project_name: "Project Alpha",
            total_points: 200,
            member_count: 3,
            skill_breakdown: { "Frontend Developer": 100 }
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      } as Response);

      const { result } = renderHook(() =>
        useLeaderboard({
          type: "projects",
          timePeriod: "weekly"
        })
      );

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData.leaders);
    });
  });

  describe("Refetch functionality", () => {
    it("can refetch data", async () => {
      const mockData = { leaders: [] };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData
      } as Response);

      const { result } = renderHook(() =>
        useLeaderboard({ type: "technical", category: "Frontend Developer" })
      );

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      // Clear the mock calls
      mockFetch.mockClear();

      // Refetch
      await result.current.refetch();

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe("Category and time period changes", () => {
    it("updates category correctly", async () => {
      const mockData = { leaders: [] };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData
      } as Response);

      const { result } = renderHook(() =>
        useLeaderboard({ type: "technical", category: "Frontend Developer" })
      );

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      // Change category
      result.current.setCategory("Backend Developer");

      // Should trigger new fetch
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("Backend%20Developer")
      );
    });

    it("updates time period correctly", async () => {
      const mockData = { leaders: [] };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockData
      } as Response);

      const { result } = renderHook(() =>
        useLeaderboard({ type: "projects", timePeriod: "all" })
      );

      await waitFor(() => {
        expect(result.current.state.isLoading).toBe(false);
      });

      // Change time period
      result.current.setTimePeriod("weekly");

      // Should trigger new fetch
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("timeFilter=weekly")
      );
    });
  });
});