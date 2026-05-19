import { Suspense } from "react";
import { createClientServerComponent } from "@/utils/supabase/server"; 
import { AppointmentTable } from "./_components/AppointmentTable";

export const revalidate = 0; // Ensures fresh real-time parameters on view loads

export default async function AppointmentsAdminPage() {
  const supabase = await createClientServerComponent();

  // Queries row elements straight from your verified "appointments" table
  const { data: appointmentsData, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Admin Initial Data Fetch Exception:", error.message);
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center text-red-400">
        <p className="text-sm font-medium">
          An error occurred while retrieving appointment data. Please check connection scopes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full min-h-screen text-neutral-200">
      {/* Header Info Meta Panels */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
          Client Appointment Management
        </h1>
        <p className="text-xs text-neutral-400 max-w-2xl">
          Review prospect information fields captured through the three-step contact pipeline widget. 
          Click on any list row entry to open the full survey analytics drawer layout.
        </p>
      </div>

      {/* Replaced unknown Loader with a clean inline CSS custom loader layout block */}
      <Suspense 
        fallback={
          <div className="flex h-64 w-full flex-col gap-3 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-700 border-t-purple-500" />
            <p className="text-xs text-neutral-500 animate-pulse">Gathering pipeline entries...</p>
          </div>
        }
      >
        <AppointmentTable initialData={appointmentsData || []} />
      </Suspense>
    </div>
  );
}