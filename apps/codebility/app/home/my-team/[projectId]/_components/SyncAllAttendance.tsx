"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { syncAllTeamAttendancePoints } from "../actions/attendance-sync";

interface SyncAllAttendanceProps {
  projectId: string;
  isTeamLead: boolean;
}

export default function SyncAllAttendance({ projectId, isTeamLead }: SyncAllAttendanceProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isTeamLead) return null;

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAllTeamAttendancePoints(projectId);
      
      if (result.success) {
        const successCount = result.results?.filter(r => r.success).length || 0;
        toast.success(`Synced attendance points for ${successCount} team members`);
        // Reload to show updated points
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to sync attendance points");
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("An error occurred while syncing");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      size="sm"
      variant="outline"
      className="h-7 w-7 border-gray-300 p-0 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      title="Sync All Attendance Points"
    >
      <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
    </Button>
  );
}