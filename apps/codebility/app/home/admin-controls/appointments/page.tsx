import { Suspense } from "react";
import { redirect } from "next/navigation"; // Required for safe server-side routing redirects
import { createClientServerComponent } from "@/utils/supabase/server"; 
import { AppointmentTable } from "./_components/AppointmentTable";

export const revalidate = 0; // Ensures fresh real-time parameters on view loads

export default async function AppointmentsAdminPage() {
  const supabase = await createClientServerComponent();

  // 1. Session boundary validation
  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
  if (authError || !authUser) {
    redirect("/login");
  }

  // 2. Fetch profile from 'codev' table to resolve the user's role_id
  const { data: codev, error: codevError } = await supabase
    .from("codev")
    .select("role_id")
    .eq("id", authUser.id)
    .single();

  if (codevError || !codev) {
    redirect("/home"); // Redirect to basic dashboard if profile is missing
  }

  // 3. Match the exact role gating ('applicants' permission) that guards /home/admin-controls
  const { data: rolePerms, error: roleError } = await supabase
    .from("roles")
    .select("applicants")
    .eq("id", codev.role_id)
    .single();

  if (roleError || !rolePerms?.applicants) {
    redirect("/home"); // Boot unauthorized users back to the standard home workspace
  }

  // 4. Authorized query execution matching the validated database columns
  const { data: appointmentsData, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Admin Initial Data Fetch Exception:", error.message);
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-600 dark:text-red-400">
        <p className="text-sm font-medium">
          An error occurred while retrieving appointment data.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-dark200_light900 text-2xl font-bold tracking-tight">
          Client Appointment Management
        </h1>
        <p className="max-w-2xl text-xs text-slate-600 dark:text-slate-400">
          Review inquiries submitted through the contact flow. Click any row to view full details and update status.
        </p>
      </div>

      <Suspense 
        fallback={
          <div className="background-light900_dark300 border-light_dark flex h-64 w-full flex-col items-center justify-center gap-3 rounded-xl border">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-purple-500 dark:border-slate-700" />
            <p className="animate-pulse text-xs text-slate-600 dark:text-slate-400">Loading appointments...</p>
          </div>
        }
      >
        <AppointmentTable initialData={appointmentsData || []} />
      </Suspense>
    </div>
  );
}