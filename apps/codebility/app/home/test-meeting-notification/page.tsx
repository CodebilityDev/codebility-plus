"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Project {
  id: string;
  name: string;
  meeting_schedule: {
    selectedDays: string[];
    time: string;
  };
}

interface NotificationTestResult {
  success: boolean;
  notificationsSent: number;
  currentDay: string;
  manilaTime: string;
  timestamp: string;
  projectsChecked: number;
  error?: string;
  details?: any;
}

export default function TestMeetingNotificationPage() {
  const [isLoading, setIsLoading] = useState<'8am' | '30min' | 'start' | null>(null);
  const [results, setResults] = useState<NotificationTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [todaysProjects, setTodaysProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [showNotificationPreview, setShowNotificationPreview] = useState<'8am' | '30min' | 'start' | null>(null);

  const getCurrentManilaTime = () => {
    const now = new Date();
    const manilaTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Manila" }));
    return {
      formatted: manilaTime.toLocaleString("en-US", { timeZone: "Asia/Manila" }),
      hour: manilaTime.getHours(),
      minute: manilaTime.getMinutes(),
      day: manilaTime.toLocaleDateString("en-US", { 
        weekday: "long",
        timeZone: "Asia/Manila" 
      }).toLowerCase()
    };
  };

  const [currentTime, setCurrentTime] = useState<any>(null);

  const updateCurrentTime = () => {
    const time = getCurrentManilaTime();
    setCurrentTime(time);
  };

  const showUIPreview = (type: '8am' | '30min' | 'start') => {
    setShowNotificationPreview(type);
    setTimeout(() => setShowNotificationPreview(null), 5000); // Auto-hide after 5 seconds
  };

  const formatTime = (time24: string): string => {
    const parts = time24.split(":");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return time24;
    
    const hour = parseInt(parts[0]);
    const minutes = parts[1];
    
    if (isNaN(hour)) return time24;
    
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const fetchTodaysProjects = async () => {
    setProjectsLoading(true);
    try {
      const currentDay = getCurrentManilaTime().day;
      const response = await fetch('/api/projects/today', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentDay }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setTodaysProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching today\'s projects:', error);
      setTodaysProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    updateCurrentTime();
    fetchTodaysProjects();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const triggerNotification = async (type: '8am' | '30min' | 'start') => {
    setIsLoading(type);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/cron/meeting-reminders?testType=${type}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to trigger notifications');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error occurred');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meeting Notifications Test</h1>
          <p className="text-muted-foreground">
            Test the meeting reminder notification system with different trigger types
          </p>
        </div>

        {/* Current Time Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🕐 Current Manila Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Time</p>
                <p className="text-2xl font-mono">
                  {currentTime ? currentTime.formatted : 'Loading...'}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Day</p>
                <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold">
                  {currentTime ? currentTime.day : 'Loading...'}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Hour:Minute</p>
                <p className="text-lg font-mono">
                  {currentTime ? `${String(currentTime.hour).padStart(2, '0')}:${String(currentTime.minute).padStart(2, '0')}` : 'Loading...'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={updateCurrentTime} 
                variant="outline" 
                size="sm"
              >
                🔄 Refresh Time
              </Button>
              <Button 
                onClick={fetchTodaysProjects} 
                variant="outline" 
                size="sm"
                disabled={projectsLoading}
              >
                {projectsLoading ? '⏳' : '📂'} Refresh Projects
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Projects */}
        {todaysProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📅 Projects with Meetings Today
              </CardTitle>
              <CardDescription>
                These projects have meetings scheduled for {currentTime?.day}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {todaysProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/home/my-team/${project.id}`}
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium truncate">{project.name}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      Meeting at {project.meeting_schedule.time}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Preview Windows */}
        {showNotificationPreview && todaysProjects.length > 0 && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔔 Notification Preview - 
                {showNotificationPreview === '8am' && '📅 8 AM Morning'}
                {showNotificationPreview === '30min' && '⏰ 30 Minutes Before'}
                {showNotificationPreview === 'start' && '🔴 Meeting Start'}
              </CardTitle>
              <CardDescription>
                This is how the notification would appear to team members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="p-4 bg-white border rounded-lg shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {showNotificationPreview === '8am' && '📅'}
                      {showNotificationPreview === '30min' && '⏰'}
                      {showNotificationPreview === 'start' && '🔴'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {project.name} - Meeting Reminder
                      </h4>
                      <div className="text-gray-700 mb-3">
                        {showNotificationPreview === '8am' && (
                          <>Reminder: "{project.name}" team meeting today at {formatTime(project.meeting_schedule.time)}<br/><br/><br/><br/>Make sure you're available!</>
                        )}
                        {showNotificationPreview === '30min' && (
                          <>"{project.name}" team meeting starts in 30 minutes ({formatTime(project.meeting_schedule.time)})<br/><br/>Join the meeting at <Link href={`/home/my-team/${project.id}`} className="text-blue-600 underline hover:text-blue-800">/home/my-team/{project.id}</Link></>
                        )}
                        {showNotificationPreview === 'start' && (
                          <>"{project.name}" team meeting is starting now!<br/><br/>Join the meeting at <Link href={`/home/my-team/${project.id}`} className="text-blue-600 underline hover:text-blue-800">/home/my-team/{project.id}</Link></>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Test Triggers</CardTitle>
            <CardDescription>
              Click any button to test specific notification types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4">
              <Button 
                onClick={() => showUIPreview(todaysProjects.length > 0 ? '30min' : '8am')} 
                variant="outline"
                className="w-full"
              >
                👁️ Preview Notification UI (Example)
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-3">
                <Button 
                  onClick={() => triggerNotification('8am')} 
                  disabled={isLoading !== null}
                  className="w-full h-20 flex flex-col gap-2"
                  variant={isLoading === '8am' ? "secondary" : "default"}
                >
                  {isLoading === '8am' ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <div>📅</div>
                      <span>Test 8 AM Morning Reminders</span>
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => showUIPreview('8am')} 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  👁️ Preview UI
                </Button>
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => triggerNotification('30min')} 
                  disabled={isLoading !== null}
                  className="w-full h-20 flex flex-col gap-2"
                  variant={isLoading === '30min' ? "secondary" : "default"}
                >
                  {isLoading === '30min' ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <div>⏰</div>
                      <span>Test 30-Minute Before</span>
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => showUIPreview('30min')} 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  👁️ Preview UI
                </Button>
                {todaysProjects.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Will notify for:</span>
                    <div className="mt-1 space-y-1">
                      {todaysProjects.slice(0, 2).map((project) => (
                        <Link
                          key={project.id}
                          href={`/home/my-team/${project.id}`}
                          className="block hover:text-blue-600 truncate"
                        >
                          • {project.name}
                        </Link>
                      ))}
                      {todaysProjects.length > 2 && (
                        <div className="text-gray-400">+ {todaysProjects.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button 
                  onClick={() => triggerNotification('start')} 
                  disabled={isLoading !== null}
                  className="w-full h-20 flex flex-col gap-2"
                  variant={isLoading === 'start' ? "secondary" : "default"}
                >
                  {isLoading === 'start' ? (
                    <>
                      <div className="animate-spin">⏳</div>
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <div>🔴</div>
                      <span>Test Meeting Start</span>
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => showUIPreview('start')} 
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  👁️ Preview UI
                </Button>
                {todaysProjects.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium">Will notify for:</span>
                    <div className="mt-1 space-y-1">
                      {todaysProjects.slice(0, 2).map((project) => (
                        <Link
                          key={project.id}
                          href={`/home/my-team/${project.id}`}
                          className="block hover:text-blue-600 truncate"
                        >
                          • {project.name}
                        </Link>
                      ))}
                      {todaysProjects.length > 2 && (
                        <div className="text-gray-400">+ {todaysProjects.length - 2} more</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="border border-red-200 bg-red-50 text-red-800 px-4 py-3 rounded-md">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.success ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-green-500 rounded-full" />
                    Success
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full" />
                    Failed
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Notifications Sent</p>
                  <p className="text-2xl font-bold text-green-600">
                    {results.notificationsSent}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Projects Checked</p>
                  <p className="text-2xl font-bold">
                    {results.projectsChecked}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Current Day</p>
                  <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {results.currentDay}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Execution Time</p>
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {results.manilaTime}
                </p>
              </div>

              {/* Success/Failure Message */}
              <div className={`border px-4 py-3 rounded-md ${
                results.success 
                  ? 'border-green-200 bg-green-50 text-green-800' 
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}>
                {results.success ? (
                  results.notificationsSent > 0 ? (
                    <span>
                      ✅ Successfully sent <strong>{results.notificationsSent}</strong> notifications! 
                      Check your notification panel to see them.
                    </span>
                  ) : (
                    <span>
                      ℹ️ Test ran successfully but no notifications were sent. 
                      This might be because no meetings are scheduled for the current time/day, 
                      or duplicate prevention is active.
                    </span>
                  )
                ) : (
                  <span>
                    ❌ Test failed to execute. Check the error details above.
                  </span>
                )}
              </div>

              {/* Technical Details - FIXED STYLING */}
              <details className="space-y-2">
                <summary className="text-sm font-medium cursor-pointer hover:text-blue-600">
                  View Technical Details
                </summary>
                <pre className="text-xs bg-gray-100 text-gray-800 p-4 rounded overflow-auto max-h-96 border">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How the System Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">Notification Types:</h4>
              <ul className="text-sm space-y-1 ml-4 list-disc text-gray-600">
                <li><strong>📅 8 AM Morning:</strong> Daily summary sent to all teams with meetings scheduled for today</li>
                <li><strong>⏰ 30 Minutes Before:</strong> Urgent reminder sent exactly 30 minutes before each meeting</li>
                <li><strong>🔴 Meeting Start:</strong> "Starting now" notification sent exactly when the meeting begins</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Features:</h4>
              <ul className="text-sm space-y-1 ml-4 list-disc text-gray-600">
                <li>Only sends to teams with meetings scheduled for the current day</li>
                <li>Automatic duplicate prevention (1-hour window)</li>
                <li>Manila timezone (Asia/Manila) used for all calculations</li>
                <li>Real-time project and team member detection</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}