// Client-side attendance service functions
export const ATTENDANCE_POINTS_PER_DAY = 2;

// Client-side function to get attendance data
export async function getAttendanceForMonth(
  projectId: string,
  year: number,
  month: number,
) {
  try {
    const startDate = new Date(year, month, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split("T")[0];

    const response = await fetch(
      `/api/attendance?projectId=${projectId}&startDate=${startDate}&endDate=${endDate}`,
    );
    const data = (await response.json()) as {
      error?: string;
      attendance?: unknown;
    };

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch attendance");
    }

    return { success: true, data: data.attendance || [] };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: [],
    };
  }
}

// Client-side function to save attendance
export async function saveAttendanceRecord(record: {
  codev_id: string;
  project_id: string;
  date: string;
  status: string;
  check_in?: string;
  check_out?: string;
}) {
  try {
    const response = await fetch("/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(record),
    });

    const data = (await response.json()) as {
      error?: string;
    };

    if (!response.ok) {
      console.error("Attendance save failed:", data);
      throw new Error(data.error || "Failed to save attendance");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error saving attendance:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Client-side function to get codev points
export async function getCodevTotalPoints(codevId: string) {
  try {
    const response = await fetch(`/api/codev/${codevId}/points`);
    const data = (await response.json()) as {
      error?: string;
      totalPoints?: number;
      attendancePoints?: number;
      points?: unknown;
    };

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch points");
    }

    return {
      success: true,
      totalPoints: data.totalPoints || 0,
      attendancePoints: data.attendancePoints || 0,
      data: data.points || [],
    };
  } catch (error) {
    console.error("Error fetching codev points:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      totalPoints: 0,
      attendancePoints: 0,
      data: [],
    };
  }
}
