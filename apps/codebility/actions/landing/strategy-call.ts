"use server";

import { z } from "zod";

import { strategyCallTimes } from "@/constants/landing/strategy-call";
import {
  createStrategyCallAdminClient,
  createStrategyCallEvent,
  deleteStrategyCallEvent,
  getUnavailableStrategyTimes,
  GoogleCalendarApiError,
  isGoogleCalendarConfigured,
} from "@/lib/landing/strategy-calls";
import { isStrategyCallDate } from "@/utils/landing/strategy-call";

const strategyCallSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  budget: z.string().trim().max(100),
  needs: z.array(z.string().trim().max(100)).max(20),
  details: z.string().max(2000),
  appointmentDate: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),
  appointmentTime: z.enum(strategyCallTimes),
});

export async function getStrategyCallAvailability(date: string) {
  if (!isStrategyCallDate(date)) {
    return { error: "Choose a weekday from today onward." };
  }

  if (!isGoogleCalendarConfigured()) {
    return { error: "Scheduling is temporarily unavailable." };
  }

  try {
    const unavailable = await getUnavailableStrategyTimes(date);
    return { unavailable };
  } catch (error) {
    console.error("[strategy-call] Availability lookup failed:", error);
    return { error: "Unable to load availability. Please try again." };
  }
}

export async function createStrategyCall(body: unknown) {
  const parsed = strategyCallSchema.safeParse(body);

  if (!parsed.success) {
    return { error: "Please check your details and try again." };
  }

  const call = parsed.data;

  if (!isStrategyCallDate(call.appointmentDate)) {
    return { error: "Choose a weekday from today onward." };
  }

  if (!isGoogleCalendarConfigured()) {
    return {
      error: "Scheduling is temporarily unavailable. Please try again later.",
    };
  }

  try {
    const unavailable = await getUnavailableStrategyTimes(call.appointmentDate);

    if (unavailable.includes(call.appointmentTime)) {
      return {
        error: "That time was just taken. Please choose another slot.",
      };
    }

    const bookingReference = crypto.randomUUID();
    const calendarEvent = await createStrategyCallEvent({
      name: call.name,
      email: call.email,
      budget: call.budget,
      needs: call.needs,
      details: call.details,
      date: call.appointmentDate,
      time: call.appointmentTime,
      bookingReference,
    });

    const supabase = createStrategyCallAdminClient();
    const { data, error } = (await supabase
      .from("strategy_calls")
      .insert({
        name: call.name,
        email: call.email,
        budget: call.budget,
        needs: call.needs,
        details: call.details,
        appointment_date: call.appointmentDate,
        appointment_time: call.appointmentTime,
        google_event_id: calendarEvent.eventId,
        google_event_url: calendarEvent.eventUrl,
        meeting_link: calendarEvent.meetingLink,
        status: "confirmed",
      })
      .select("id")
      .single()) as {
      data: { id: string } | null;
      error: { message: string; code?: string } | null;
    };

    if (error || !data) {
      await deleteStrategyCallEvent(calendarEvent.eventId);

      if (error?.code === "23505") {
        return {
          error: "That time was just taken. Please choose another slot.",
        };
      }

      console.error("[strategy-call] Supabase insert error:", error);
      return { error: "Failed to save your call. Please try again." };
    }

    return {
      success: true,
      id: data.id,
      meetingLink: calendarEvent.meetingLink,
      eventUrl: calendarEvent.eventUrl,
    };
  } catch (error) {
    if (error instanceof GoogleCalendarApiError && error.status === 409) {
      return {
        error: "That time was just taken. Please choose another slot.",
      };
    }

    console.error("[strategy-call] Booking failed:", error);
    return {
      error: "We could not book the call. Please try again.",
    };
  }
}
