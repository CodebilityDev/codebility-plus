// app/api/cron/meeting-reminders/route.ts
import { createNotificationAction } from "@/lib/actions/notification.actions";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // ✅ Create Supabase client with service role for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // ✅ FIX: Use Manila timezone (Asia/Manila = UTC+8)
    const nowUTC = new Date();
    const nowManila = new Date(
      nowUTC.toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );

    const currentDay = nowManila
      .toLocaleDateString("en-US", { 
        weekday: "long",
        timeZone: "Asia/Manila" 
      })
      .toLowerCase();
    
    const currentHour = nowManila.getHours();
    const currentMinute = nowManila.getMinutes();

    console.log(`[Cron] Manila time: ${nowManila.toLocaleString("en-US", { timeZone: "Asia/Manila" })}`);
    console.log(`[Cron] Current day: ${currentDay}, Hour: ${currentHour}, Minute: ${currentMinute}`);

    // ✅ Query projects with Supabase syntax
    const { data: projectsWithMeetings, error: projectsError } = await supabase
      .from("project")
      .select(
        `
        *,
        teamLead:team_lead_id(*),
        teamMembers:project_members(user:user_id(*))
      `,
      )
      .not("meeting_schedule", "is", null);

    if (projectsError) {
      console.error("Error fetching projects:", projectsError);
      return NextResponse.json(
        { success: false, error: "Failed to fetch projects" },
        { status: 500 },
      );
    }

    let notificationsSent = 0;

    for (const project of projectsWithMeetings || []) {
      // ✅ Validate project has required fields
      if (!project.id || !project.name) {
        console.warn("Skipping project with missing id or name");
        continue;
      }

      const projectId: string = project.id;
      const projectName: string = project.name;

      const schedule = project.meeting_schedule as {
        selectedDays: string[];
        time: string;
        meetingLink?: string;
      } | null;

      // Check if today is a meeting day
      if (
        !schedule?.time ||
        !schedule?.selectedDays ||
        !schedule.selectedDays.includes(currentDay)
      ) {
        continue;
      }

      // Parse and validate time
      const timeParts = schedule.time.split(":");
      if (timeParts.length !== 2 || !timeParts[0] || !timeParts[1]) continue;

      const meetingHour = parseInt(timeParts[0]);
      const meetingMinute = parseInt(timeParts[1]);

      if (isNaN(meetingHour) || isNaN(meetingMinute)) continue;

      const meetingTimeInMinutes = meetingHour * 60 + meetingMinute;
      const currentTimeInMinutes = currentHour * 60 + currentMinute;
      const timeDifference = meetingTimeInMinutes - currentTimeInMinutes;

      console.log(`[Project: ${projectName}] Meeting at ${schedule.time}, Time difference: ${timeDifference} minutes`);

      // Build team members array
      const teamMembers = project.teamMembers
        ? project.teamMembers.map((pm: any) => pm.user).filter(Boolean)
        : [];
      const allMembers = project.teamLead
        ? [project.teamLead, ...teamMembers]
        : teamMembers;

      if (allMembers.length === 0) continue;

      // Helper to format time
      const formatTime = (time24: string): string => {
        const parts = time24.split(":");
        if (parts.length !== 2 || !parts[0] || !parts[1]) return time24;
        
        const hour = parseInt(parts[0]);
        const minutes = parts[1];
        
        if (isNaN(hour)) return time24;
        
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
      };

      const formattedTime = formatTime(schedule.time);

      // ✅ MORNING REMINDER (8:00-8:15 AM Manila time for meetings today)
      if (currentHour === 8 && currentMinute < 15) {
        console.log(`[${projectName}] Sending MORNING reminder`);
        
        const notificationPromises = allMembers.map((member) =>
          createNotificationAction({
            recipientId: member.id,
            title: "📅 Meeting Scheduled Today",
            message: `Reminder: "${projectName}" team meeting today at ${formattedTime}\n\nPlatform: Discord\n\nMake sure you're available!`,
            type: "event",
            priority: "medium",
            actionUrl: `/home/my-team/${projectId}`,
            metadata: {
              projectId,
              projectName,
              meetingTime: schedule.time,
              meetingTimeFormatted: formattedTime,
              platform: "Discord",
              reminderType: "morning",
              timestamp: nowManila.toISOString(),
            },
          }),
        );

        await Promise.all(notificationPromises);
        notificationsSent += notificationPromises.length;
      }

      // ✅ 30-MINUTE REMINDER (25-35 minutes before meeting)
      if (timeDifference >= 25 && timeDifference <= 35) {
        console.log(`[${projectName}] Sending 30-MINUTE reminder`);
        
        const notificationPromises = allMembers.map((member) =>
          createNotificationAction({
            recipientId: member.id,
            title: "⏰ Meeting Starting Soon",
            message: `"${projectName}" team meeting starts in 30 minutes (${formattedTime})\n\nJoin the Discord voice channel`,
            type: "event",
            priority: "high",
            actionUrl: `/home/my-team/${projectId}`,
            metadata: {
              projectId,
              projectName,
              meetingTime: schedule.time,
              meetingTimeFormatted: formattedTime,
              platform: "Discord",
              reminderType: "30min",
              timestamp: nowManila.toISOString(),
            },
          }),
        );

        await Promise.all(notificationPromises);
        notificationsSent += notificationPromises.length;
      }

      // ✅ MEETING START NOTIFICATION (at meeting time, -5 to +5 min window)
      if (timeDifference >= -5 && timeDifference <= 5) {
        console.log(`[${projectName}] Sending START notification`);
        
        const notificationPromises = allMembers.map((member) =>
          createNotificationAction({
            recipientId: member.id,
            title: "🔴 Meeting Starting Now!",
            message: `"${projectName}" team meeting is starting now!\n\nJoin the Discord voice channel now!`,
            type: "event",
            priority: "urgent",
            actionUrl: `/home/my-team/${projectId}`,
            metadata: {
              projectId,
              projectName,
              meetingTime: schedule.time,
              meetingTimeFormatted: formattedTime,
              platform: "Discord",
              reminderType: "start",
              timestamp: nowManila.toISOString(),
            },
          }),
        );

        await Promise.all(notificationPromises);
        notificationsSent += notificationPromises.length;
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      manilaTime: nowManila.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
      currentDay,
      timestamp: nowManila.toISOString(),
      projectsChecked: projectsWithMeetings?.length || 0,
    });
  } catch (error) {
    console.error("Error sending meeting reminders:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}