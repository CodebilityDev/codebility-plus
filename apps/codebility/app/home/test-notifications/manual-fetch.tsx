"use client";

import { useState } from "react";
import { Button } from "@codevs/ui/button";
import { Card } from "@codevs/ui/card";
import { fetchNotifications } from "./actions";

export function ManualFetchTest() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Manually fetching notifications...");
      const result = await fetchNotifications();
      console.log("Manual fetch result:", result);
      
      if (result.error) {
        setError(result.error);
      } else {
        setNotifications(result.data || []);
      }
    } catch (err) {
      console.error("Manual fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mt-8">
      <h3 className="text-lg font-semibold mb-4">Manual Notification Fetch Test</h3>
      
      <Button 
        onClick={handleFetchNotifications}
        disabled={isLoading}
        className="mb-4"
      >
        {isLoading ? "Fetching..." : "Fetch Notifications"}
      </Button>

      {error && (
        <div className="text-red-500 mb-4">
          Error: {error}
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Found {notifications.length} notifications
        </p>
        
        {notifications.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((n, i) => (
              <div key={i} className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                <div className="font-medium">{n.title}</div>
                <div className="text-gray-600">{n.message}</div>
                <div className="text-xs text-gray-500">
                  ID: {n.id} | Type: {n.type} | Read: {n.read ? "Yes" : "No"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}