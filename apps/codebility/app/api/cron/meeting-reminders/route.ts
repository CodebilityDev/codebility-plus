// app/api/cron/meeting-reminders/route.ts
import { createNotificationAction } from "@/lib/actions/notification.actions";
import { createClientServerComponent } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Parse URL to get test type parameter 
    const url = new URL(request.url);
    const testType = url.searchParams.get('testType'); // '8am', '30min', 'start', or null for all

    const supabase = await createClientServerComponent();

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

    // Determine which notification types to send
    const isTestMode = !!testType; // this is for testing page purposes - if testType is provided, we are in test mode
    const shouldSend8AM = !testType || testType === '8am';
    const shouldSend30Min = !testType || testType === '30min';
    const shouldSendStart = !testType || testType === 'start';

    // Query projects without the problematic team_lead_id column
    const { data: projectsWithMeetings, error: projectsError } = await supabase
      .from("projects")
      .select(
        `
        id,
        name,
        meeting_schedule,
        meeting_link
      `,
      )
      .not("meeting_schedule", "is", null);

    if (projectsError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to fetch projects",
          details: {
            message: projectsError.message,
            hint: projectsError.hint
          }
        },
        { status: 500 },
      );
    }

    let notificationsSent = 0;

    // Helper function to get all team members
    const getTeamMembers = async (projectId: string) => {
      const allMembers: any[] = [];
      
      // Get all project members
      const { data: projectMembers, error: membersError } = await supabase
        .from("project_members")
        .select(`
          codev_id,
          role,
          codev:codev_id (
            id,
            first_name,
            last_name,
            email_address
          )
        `)
        .eq("project_id", projectId);
        
      if (membersError) {
        return [];
      }

      if (!projectMembers || projectMembers.length === 0) {
        return [];
      }
      
      for (const member of projectMembers) {
        // Ensure codev is a single object, not an array
        const codevData = Array.isArray(member.codev) ? member.codev[0] : member.codev;
        if (codevData) {
          allMembers.push(codevData);
        }
      }
      
      return allMembers;
    };

    for (const project of projectsWithMeetings || []) {
      // Validate project has required fields
      if (!project.id || !project.name) {
        continue;
      }

      const projectId: string = project.id;
      const projectName: string = project.name;

      const schedule = project.meeting_schedule as {
        selectedDays: string[];
        time: string;
        meetingLink?: string;
      } | null;

      // Always check if today is a meeting day (for both test and production)
      if (
        !schedule?.time ||
        !schedule?.selectedDays ||
        !schedule.selectedDays.includes(currentDay)
      ) {
        continue; // Skip projects without meetings today
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

      // Get team members
      const allMembers = await getTeamMembers(projectId);

      if (allMembers.length === 0) {
        continue; // Skip projects with no team members
      }

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

      // MORNING REMINDER (at 8:00 AM Manila time for meetings today, or always in test mode for 8am)
      if (shouldSend8AM && (isTestMode || (currentHour === 8 && currentMinute < 15))) {
        const notificationPromises = allMembers.map(async (member) => {
          try {
            const result = await createNotificationAction({
              recipientId: member.id,
              title: "📅 Meeting Today!",
              message: `Good morning! ☀️ You have a team meeting today at ${formattedTime} on Discord. Get your workspace ready and don't be late!`,
              type: "event",
              priority: "normal",
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
            });
            
            if (!result.error && result.data && result.data !== "skipped") {
              return result;
            }
            return null;
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(notificationPromises);
        const successfulNotifications = results.filter(r => r !== null).length;
        notificationsSent += successfulNotifications;
      }

      // 30-MINUTE REMINDER (exactly 30 minutes before meeting start, or always in test mode for this type)
      if (shouldSend30Min && (isTestMode || timeDifference === 30)) {
        const notificationPromises = allMembers.map(async (member) => {
          try {
            const result = await createNotificationAction({
              recipientId: member.id,
              title: "⏰ Meeting in 30 Minutes!",
              message: `Heads up! 🚀 Your team meeting starts in 30 minutes at ${formattedTime}. Wrap up what you're doing and hop on Discord!\n\nClick here to join [${projectName}](/home/my-team/${projectId})`,
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
            });
            
            if (!result.error && result.data && result.data !== "skipped") {
              return result;
            }
            return null;
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(notificationPromises);
        const successfulNotifications = results.filter(r => r !== null).length;
        notificationsSent += successfulNotifications;
      }

      // MEETING START NOTIFICATION (at exact meeting time, or always in test mode for this type)
      if (shouldSendStart && (isTestMode || timeDifference === 0)) {
        const notificationPromises = allMembers.map(async (member) => {
          try {
            const result = await createNotificationAction({
              recipientId: member.id,
              title: "🔴 Meeting is Live!",
              message: `It's go time! 🎉 Your team meeting is happening right now on Discord. Don't keep the team waiting!\n\nClick here to join [${projectName}](/home/my-team/${projectId})`,
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
            });
            
            if (!result.error && result.data && result.data !== "skipped") {
              return result;
            }
            return null;
          } catch (error) {
            return null;
          }
        });

        const results = await Promise.all(notificationPromises);
        const successfulNotifications = results.filter(r => r !== null).length;
        notificationsSent += successfulNotifications;
      }
    }

    return NextResponse.json({
      success: true,
      notificationsSent,
      manilaTime: nowManila.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
      currentDay,
      timestamp: nowManila.toISOString(),
      projectsChecked: projectsWithMeetings?.length || 0,
      testType: testType || 'all (production mode)',
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Internal server error",
        details: {
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        }
      },
      { status: 500 },
    );
  }
}