"use server";

// Import your actual server utility file relative to the utils folder mapping
import { createClientServerComponent } from "@/utils/supabase/server"; 
import { revalidatePath } from "next/cache";
import { appointmentStatusSchema } from "./types";

/**
 * Server Action to securely update the status text field of a client appointment.
 * Enforces server-side type safety via Zod parsing before mutating database rows.
 * * @param appointmentId - The unique UUID string identifier of the appointment
 * @param rawStatus - The target status string token collected from the UI client drop-down
 */
export async function updateAppointmentStatus(
  appointmentId: string,
  rawStatus: string
) {
  // 1. Enforce strict type validation on the server boundary
  const parsedStatus = appointmentStatusSchema.safeParse(rawStatus);

  if (!parsedStatus.success) {
    return {
      success: false,
      error: "Invalid appointment status value provided.",
    };
  }

  const status = parsedStatus.data;
  
  try {
    // 2. Await the async server client initialization to bind header cookies properly
    const supabase = await createClientServerComponent();

    // 3. Execute the update query on your verified "appointments" table
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId);

    if (error) {
      console.error("Supabase Database Mutation Error:", error.message);
      return {
        success: false,
        error: "Failed to persist database updates.",
      };
    }

    // 4. Force Next.js to purge cached layouts and fetch clean data instantly
    revalidatePath("/home/admin-controls/appointments");

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Unexpected Server Action Exception Block:", error);
    return {
      success: false,
      error: error?.message || "An internal unexpected server error occurred.",
    };
  }
}