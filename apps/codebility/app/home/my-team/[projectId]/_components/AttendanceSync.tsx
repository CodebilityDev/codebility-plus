"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { syncAttendancePoints } from "../actions/attendance-sync";

interface AttendanceSyncProps {
  codevId: string;
}

export default function AttendanceSync({ codevId }: AttendanceSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAttendancePoints(codevId);
      
      if (result.success) {
        toast.success(`Synced ${result.attendanceCount} attendance records (${result.totalPoints} points)`);
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
    >
      <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Syncing...' : 'Sync Points'}
    </Button>
  );
}