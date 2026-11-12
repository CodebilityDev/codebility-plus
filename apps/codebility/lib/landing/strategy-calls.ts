import "server-only";

import { createClient } from "@supabase/supabase-js";

import {
  strategyCallDurationMinutes,
  strategyCallTimes,
} from "@/constants/landing/strategy-call";

const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const SLOT_DURATION_MS = strategyCallDurationMinutes * 60_000;
const CALENDAR_TIME_ZONE =
  process.env.GOOGLE_CALENDAR_TIME_ZONE?.trim() ?? "Asia/Manila";

interface GoogleCalendarConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  calendarId: string;
}

interface GoogleCalendarEvent {
  id?: string | null;
  htmlLink?: string | null;
  hangoutLink?: string | null;
  status?: string | null;
  transparency?: string | null;
  start?: {
    date?: string | null;
    dateTime?: string | null;
  } | null;
  end?: {
    date?: string | null;
    dateTime?: string | null;
  } | null;
  conferenceData?: {
    entryPoints?: {
      entryPointType?: string | null;
      uri?: string | null;
    }[] | null;
  } | null;
}

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

export interface CreateStrategyCallEventInput {
  name: string;
  email: string;
  budget: string;
  needs: string[];
  details: string;
  date: string;
  time: string;
  bookingReference: string;
}

export interface CreateStrategyCallEventResult {
  eventId: string;
  eventUrl: string | null;
  meetingLink: string | null;
}

export class GoogleCalendarApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GoogleCalendarApiError";
    this.status = status;
  }
}

let accessTokenCache: { token: string; expiresAt: number } | null = null;

export function createStrategyCallAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.DB_SERVICE_ROLE ?? process.env.SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase is not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

function getGoogleCalendarConfig(): GoogleCalendarConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();
  const calendarId = process.env.GOOGLE_CALENDAR_ID?.trim();

  if (!clientId || !clientSecret || !refreshToken || !calendarId) {
    throw new Error("Google Calendar is not configured.");
  }

  return { clientId, clientSecret, refreshToken, calendarId };
}

function getSlotStart(date: string, slot: string) {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(slot);

  if (!match) {
    throw new Error("Invalid strategy call time.");
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const meridiem = match[3];

  if (meridiem === "PM" && hours !== 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;

  return new Date(
    date +
      "T" +
      String(hours).padStart(2, "0") +
      ":" +
      String(minutes).padStart(2, "0") +
      ":00+08:00",
  );
}

function nextIsoDate(date: string) {
  const next = new Date(date + "T00:00:00Z");
  next.setUTCDate(next.getUTCDate() + 1);
  return next.toISOString().slice(0, 10);
}

function eventOverlapsSlot(
  event: GoogleCalendarEvent,
  date: string,
  slotStart: Date,
  slotEnd: Date,
) {
  if (event.status === "cancelled" || event.transparency === "transparent") {
    return false;
  }

  const allDayStart = event.start?.date;
  if (allDayStart) {
    const allDayEnd = event.end?.date ?? nextIsoDate(allDayStart);
    return allDayStart <= date && date < allDayEnd;
  }

  const startTime = event.start?.dateTime;
  const endTime = event.end?.dateTime;

  if (!startTime || !endTime) return false;

  const eventStart = new Date(startTime);
  const eventEnd = new Date(endTime);

  return eventStart < slotEnd && eventEnd > slotStart;
}

export function isGoogleCalendarConfigured() {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim() &&
      process.env.GOOGLE_REFRESH_TOKEN?.trim() &&
      process.env.GOOGLE_CALENDAR_ID?.trim(),
  );
}

async function getAccessToken() {
  if (accessTokenCache && Date.now() < accessTokenCache.expiresAt) {
    return accessTokenCache.token;
  }

  const config = getGoogleCalendarConfig();
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as
    | GoogleTokenResponse
    | null;

  if (!response.ok || !payload?.access_token) {
    console.error(
      "[strategy-call] Token refresh failed:",
      payload?.error ?? response.status,
      payload?.error_description ?? "",
    );
    throw new GoogleCalendarApiError(
      response.status,
      "Google Calendar authentication failed.",
    );
  }

  const lifetime = Math.max((payload.expires_in ?? 3600) - 60, 30);

  accessTokenCache = {
    token: payload.access_token,
    expiresAt: Date.now() + lifetime * 1000,
  };

  return payload.access_token;
}

async function calendarRequest<T>(path: string, init?: RequestInit) {
  const config = getGoogleCalendarConfig();
  const token = await getAccessToken();
  const headers = new Headers(init?.headers);

  headers.set("Authorization", "Bearer " + token);
  if (init?.body) headers.set("Content-Type", "application/json");

  const response = await fetch(
    CALENDAR_API_BASE +
      "/calendars/" +
      encodeURIComponent(config.calendarId) +
      path,
    {
      ...init,
      headers,
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    accessTokenCache = null;
  }

  if (!response.ok) {
    console.error(
      "[strategy-call] Calendar request failed:",
      response.status,
      path,
    );
    throw new GoogleCalendarApiError(
      response.status,
      "Google Calendar request failed.",
    );
  }

  return payload as T;
}

async function getCalendarEvents(date: string) {
  const start = new Date(date + "T00:00:00+08:00");
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const query = new URLSearchParams({
    timeMin: start.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: "true",
    orderBy: "startTime",
    maxResults: "2500",
  });

  const data = await calendarRequest<{ items?: GoogleCalendarEvent[] }>(
    "/events?" + query.toString(),
  );

  return data.items ?? [];
}

async function getBookedStrategyTimes(date: string) {
  const supabase = createStrategyCallAdminClient();
  const { data, error } = await supabase
    .from("strategy_calls")
    .select("appointment_time, status")
    .eq("appointment_date", date);

  if (error) {
    throw new Error("Failed to load strategy calls.");
  }

  const appointments =
    (data as {
      appointment_time: string;
      status: string | null;
    }[] | null) ?? [];

  return appointments
    .filter((appointment) => appointment.status !== "cancelled")
    .map((appointment) => appointment.appointment_time);
}

export async function getUnavailableStrategyTimes(date: string) {
  const [events, bookedTimes] = await Promise.all([
    getCalendarEvents(date),
    getBookedStrategyTimes(date),
  ]);

  return strategyCallTimes.filter((slot) => {
    if (bookedTimes.includes(slot)) return true;

    const slotStart = getSlotStart(date, slot);
    const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MS);

    return events.some((event) =>
      eventOverlapsSlot(event, date, slotStart, slotEnd),
    );
  });
}

export async function createStrategyCallEvent(
  input: CreateStrategyCallEventInput,
): Promise<CreateStrategyCallEventResult> {
  const start = getSlotStart(input.date, input.time);
  const end = new Date(start.getTime() + SLOT_DURATION_MS);
  const description = [
    "Strategy call booked through codebility.tech",
    "",
    "Name: " + input.name,
    "Email: " + input.email,
    "Budget: " + input.budget,
    "Needs: " + input.needs.join(", "),
    input.details.trim() ? "Details: " + input.details.trim() : null,
    "Reference: " + input.bookingReference,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const query = new URLSearchParams({
    sendUpdates: "all",
    conferenceDataVersion: "1",
  });

  const event = await calendarRequest<GoogleCalendarEvent>(
    "/events?" + query.toString(),
    {
      method: "POST",
      body: JSON.stringify({
        summary: "Codebility strategy call - " + input.name,
        description,
        start: {
          dateTime: start.toISOString(),
          timeZone: CALENDAR_TIME_ZONE,
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: CALENDAR_TIME_ZONE,
        },
        attendees: [{ email: input.email, displayName: input.name }],
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false,
        reminders: { useDefault: true },
        conferenceData: {
          createRequest: {
            requestId: input.bookingReference,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
        extendedProperties: {
          private: { strategyCallReference: input.bookingReference },
        },
      }),
    },
  );

  if (!event.id) {
    throw new Error("Google Calendar did not return an event ID.");
  }

  const meetingLink =
    event.hangoutLink ??
    event.conferenceData?.entryPoints?.find(
      (entry) => entry.entryPointType === "video",
    )?.uri ??
    null;

  return {
    eventId: event.id,
    eventUrl: event.htmlLink ?? null,
    meetingLink,
  };
}

export async function deleteStrategyCallEvent(eventId: string) {
  try {
    await calendarRequest(
      "/events/" + encodeURIComponent(eventId) + "?sendUpdates=all",
      { method: "DELETE" },
    );
  } catch (error) {
    console.error("[strategy-call] Failed to clean up event:", error);
  }
}
