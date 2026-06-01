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
  const parsedStatus = appointmentStatusSchema.safeParse(rawStatus);

  if (!parsedStatus.success) {
    return {
      success: false,
      error: "Invalid appointment status value provided.",
    };
  }

  const status = parsedStatus.data;
  
  try {
    const supabase = await createClientServerComponent();

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      return {
        success: false,
        error: "Not authenticated.",
      };
    }

    const { data: codev, error: codevError } = await supabase
      .from("codev")
      .select("role_id")
      .eq("id", authUser.id)
      .single();

    if (codevError || !codev) {
      return {
        success: false,
        error: "User profile not found.",
      };
    }

    const { data: rolePerms, error: roleError } = await supabase
      .from("roles")
      .select("applicants")
      .eq("id", codev.role_id)
      .single();

    if (roleError || !rolePerms?.applicants) {
      return {
        success: false,
        error: "You don't have permission to update appointments.",
      };
    }

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId);

    if (error) {
      console.error("Supabase Database Mutation Error:", error?.message);
      return {
        success: false,
        error: "Failed to persist database updates.",
      };
    }

    revalidatePath("/home/admin-controls/appointments");

    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Unexpected Server Action Exception Block:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An internal unexpected server error occurred.",
    };
  }
}