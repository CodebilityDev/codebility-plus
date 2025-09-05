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
      className="gap-2"
      title="Sync all team members' attendance points"
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Syncing Team...' : 'Sync All Points'}
    </Button>
  );
}