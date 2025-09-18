"use client";

import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { ChevronLeft, ChevronRight, Circle, Save, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SimpleMemberData } from "@/app/home/projects/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";
import { toast } from "react-hot-toast";
import { saveAttendance, getMonthlyAttendance, bulkSaveAttendance } from "../actions";

const ATTENDANCE_POINTS_PER_DAY = 2;

type AttendanceStatus = "present" | "absent" | "holiday" | "weekend";

interface AttendanceData {
  [key: string]: AttendanceStatus; // key format: "memberId-YYYY-MM-DD"
}

interface AttendanceGridProps {
  teamMembers: SimpleMemberData[];
  teamLead: SimpleMemberData | null;
  projectId: string;
  onHasChangesUpdate?: (hasChanges: boolean) => void;
  allowWeekendMeetings?: boolean;
}

const AttendanceGrid = forwardRef<any, AttendanceGridProps>(({ teamMembers, teamLead, projectId, onHasChangesUpdate, allowWeekendMeetings = false }, ref) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [attendanceData, setAttendanceData] = useState<AttendanceData>({});

  // Safely combine team lead and members
  const safeTeamMembers = teamMembers || [];
  const allMembers = teamLead ? [teamLead, ...safeTeamMembers] : safeTeamMembers;

  // Get days in selected month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Get day of week (0 = Sunday, 6 = Saturday)
  const getDayOfWeek = (year: number, month: number, day: number) => {
    return new Date(year, month, day).getDay();
  };

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load attendance data from database
  useEffect(() => {
    const loadAttendance = async () => {
      setIsLoading(true);
      try {
        const result = await getMonthlyAttendance(projectId, selectedYear, selectedMonth);
        
        if (result.success && result.data) {
          const dbData: AttendanceData = {};
          
          // First, set all weekends
          allMembers.forEach(member => {
            monthDays.forEach(day => {
              const dayOfWeek = getDayOfWeek(selectedYear, selectedMonth, day);
              const dateKey = `${member.id}-${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                dbData[dateKey] = "weekend";
              }
            });
          });
          
          // Then apply saved attendance data
          result.data.forEach((record: any) => {
            const dateKey = `${record.codev_id}-${record.date}`;
            dbData[dateKey] = record.status;
          });
          
          setAttendanceData(dbData);
        } else {
          // Generate default data if no records exist
          const defaultData: AttendanceData = {};
          allMembers.forEach(member => {
            monthDays.forEach(day => {
              const dayOfWeek = getDayOfWeek(selectedYear, selectedMonth, day);
              const dateKey = `${member.id}-${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                defaultData[dateKey] = "weekend";
              } else {
                defaultData[dateKey] = "absent";
              }
            });
          });
          setAttendanceData(defaultData);
        }
      } catch (error) {
        console.error("Error loading attendance:", error);
        toast.error("Failed to load attendance data");
      } finally {
        setIsLoading(false);
      }
    };

    if (allMembers.length > 0) {
      loadAttendance();
    }
  }, [selectedMonth, selectedYear, allMembers.length, projectId]);

  // Toggle attendance status
  const toggleAttendance = (memberId: string, day: number) => {
    const dateKey = `${memberId}-${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const currentStatus = attendanceData[dateKey] || "absent";
    const dayOfWeek = getDayOfWeek(selectedYear, selectedMonth, day);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Don't allow weekend changes unless explicitly enabled
    if (isWeekend && !allowWeekendMeetings) return;
    
    let newStatus: AttendanceStatus;
    if (currentStatus === "present") newStatus = "absent";
    else if (currentStatus === "absent" || (isWeekend && currentStatus === "weekend")) newStatus = "present";
    else if (currentStatus === "holiday") return; // Don't change holiday status
    else newStatus = "absent";
    
    setAttendanceData(prev => ({
      ...prev,
      [dateKey]: newStatus
    }));
    setHasUnsavedChanges(true);
  };

  // Save all attendance changes
  const saveAllAttendance = useCallback(async () => {
    setIsSaving(true);
    try {
      const records: any[] = [];
      
      allMembers.forEach(member => {
        monthDays.forEach(day => {
          const dayOfWeek = getDayOfWeek(selectedYear, selectedMonth, day);
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          // Skip weekends unless meetings are allowed
          if (isWeekend && !allowWeekendMeetings) return;
          
          const dateKey = `${member.id}-${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const status = attendanceData[dateKey] || "absent";
          const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          records.push({
            codev_id: member.id,
            project_id: projectId,
            date: dateStr,
            status: status as any,
            check_in: status === "present" || status === "late" ? "09:00" : undefined,
            check_out: status === "present" || status === "late" ? "18:00" : undefined
          });
        });
      });
      
      const result = await bulkSaveAttendance(records);
      
      if (result.success) {
        toast.success("Attendance saved successfully! Points have been updated.");
        setHasUnsavedChanges(false);
      } else {
        toast.error(result.error || "Failed to save attendance");
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  }, [allMembers, monthDays, selectedYear, selectedMonth, attendanceData, projectId, allowWeekendMeetings]);

  // Expose save function to parent via ref
  useImperativeHandle(ref, () => ({
    saveAllAttendance
  }), [saveAllAttendance]);

  // Notify parent component about changes
  useEffect(() => {
    if (onHasChangesUpdate) {
      onHasChangesUpdate(hasUnsavedChanges);
    }
  }, [hasUnsavedChanges, onHasChangesUpdate]);

  // Count present days for a member
  const countPresentDays = (memberId: string) => {
    let count = 0;
    monthDays.forEach(day => {
      const dateKey = `${memberId}-${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (attendanceData[dateKey] === "present") count++;
    });
    return count;
  };

  // Get status icon
  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return <Circle className="h-4 w-4 sm:h-5 sm:w-5 fill-green-500 text-green-500" />;
      case "absent":
        return <Circle className="h-4 w-4 sm:h-5 sm:w-5 fill-red-500 text-red-500" />;
      case "weekend":
        return <Circle className="h-4 w-4 sm:h-5 sm:w-5 fill-blue-500 text-blue-500" />;
      case "holiday":
        return <Circle className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-500 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300" />;
    }
  };

  // Navigate months
  const goToPreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Early return if no members
  if (!allMembers || allMembers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-12 dark:border-gray-700">
        <Calendar className="h-12 w-12 text-gray-400" />
        <h4 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No team members to track attendance
        </h4>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Add team members to start tracking attendance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full max-w-full overflow-hidden">

      {/* Attendance Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 overflow-hidden max-w-full lg:max-w-6xl xl:max-w-7xl">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-900 p-2 sm:p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                Attendance Tracker
              </h3>
              {allowWeekendMeetings && (
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  Weekend meetings enabled
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="p-1 h-8 w-8"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700 dark:text-gray-300" />
              </Button>
              <Select
                value={String(selectedMonth)}
                onValueChange={(value) => setSelectedMonth(Number(value))}
              >
                <SelectTrigger className="w-[80px] sm:w-[100px] text-gray-900 dark:text-white h-7 sm:h-8 text-xs sm:text-sm">
                  <SelectValue className="text-gray-900 dark:text-white" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {monthNames.map((month, index) => (
                    <SelectItem key={index} value={String(index)} className="text-gray-900 dark:text-gray-100">
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(selectedYear)}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger className="w-[75px] sm:w-[85px] text-gray-900 dark:text-white h-7 sm:h-8 text-xs sm:text-sm">
                  <SelectValue className="text-gray-900 dark:text-white" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800">
                  {[2024, 2025, 2026].map((year) => (
                    <SelectItem key={year} value={String(year)} className="text-gray-900 dark:text-gray-100">
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="p-1 h-8 w-8"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-700 dark:text-gray-300" />
              </Button>
            </div>
          </div>
        </div>

      {/* Attendance Grid */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="sticky left-0 z-10 bg-gray-50 dark:bg-gray-900 text-left p-1 sm:p-2 text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 w-28 sm:w-36">
                <span className="hidden sm:inline">Team Member</span>
                <span className="sm:hidden">Member</span>
              </th>
              {monthDays.map(day => {
                const dayOfWeek = getDayOfWeek(selectedYear, selectedMonth, day);
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                return (
                  <th
                    key={day}
                    className={`p-0 text-center text-[9px] font-medium w-7 sm:w-8 ${
                      isWeekend 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="font-medium text-[8px] sm:text-[10px]">{day}</div>
                  </th>
                );
              })}
              <th className="sticky right-0 z-10 bg-green-50 dark:bg-green-900/20 text-center p-1 text-[9px] font-medium text-gray-700 dark:text-gray-300 w-14 sm:w-16">
                <div className="text-[8px] sm:text-[10px]">Days</div>
                <div className="text-[8px] sm:text-[10px] font-normal text-gray-500">Pts</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {allMembers.map((member, index) => {
              const isLead = teamLead?.id === member.id;
              return (
                <tr
                  key={member.id}
                  className={`border-b border-gray-200 dark:border-gray-700 ${
                    index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'
                  }`}
                >
                  <td className="sticky left-0 z-10 bg-inherit p-1 sm:p-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-[9px] sm:text-[11px] text-gray-900 dark:text-white truncate max-w-[50px] sm:max-w-[100px]">
                          <span className="sm:hidden">{member.first_name.charAt(0)}. {member.last_name.charAt(0)}.</span>
                          <span className="hidden sm:inline">{member.first_name} {member.last_name}</span>
                        </span>
                        {isLead && (
                          <span className="rounded bg-blue-100 px-0.5 py-0 text-[7px] text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                            TL
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 hidden sm:block truncate">
                        {member.display_position || "Member"}
                      </div>
                    </div>
                  </td>
                  {monthDays.map(day => {
                    const dayOfWeek = getDayOfWeek(selectedYear, selectedMonth, day);
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    const dateKey = `${member.id}-${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const status = attendanceData[dateKey] || "absent";
                    
                    return (
                      <td
                        key={day}
                        className={`p-0 sm:p-0.5 text-center w-7 sm:w-8 ${
                          isWeekend ? 'bg-gray-100 dark:bg-gray-800' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center p-1">
                          {isWeekend && !allowWeekendMeetings ? (
                            <div className="cursor-not-allowed">
                              {getStatusIcon(status)}
                            </div>
                          ) : (
                            <button
                              onClick={() => toggleAttendance(member.id, day)}
                              className="hover:scale-110 transition-transform p-1"
                            >
                              {getStatusIcon(status)}
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="sticky right-0 z-10 bg-green-50 dark:bg-green-900/20 text-center p-0.5">
                    <div className="space-y-0">
                      <div className="font-semibold text-[10px] sm:text-xs text-green-700 dark:text-green-400">
                        {countPresentDays(member.id)}
                      </div>
                      <div className="text-[8px] sm:text-[10px] text-gray-600 dark:text-gray-400 leading-tight">
                        +{countPresentDays(member.id) * ATTENDANCE_POINTS_PER_DAY}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-900 p-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1">
              <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-green-500 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">
                <span className="hidden sm:inline">Present ({ATTENDANCE_POINTS_PER_DAY} pts/day)</span>
                <span className="sm:hidden">Present</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-red-500 text-red-500" />
              <span className="text-gray-600 dark:text-gray-400">
                <span className="hidden sm:inline">Absent (0 pts)</span>
                <span className="sm:hidden">Absent</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Circle className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-blue-500 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">Weekend</span>
            </div>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
            <span className="hidden sm:inline">Total points this month:</span>
            <span className="sm:hidden">Total:</span>
            <span className="font-semibold text-green-600 dark:text-green-400 ml-1">
              {allMembers.reduce((total, member) => total + (countPresentDays(member.id) * ATTENDANCE_POINTS_PER_DAY), 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
});

AttendanceGrid.displayName = 'AttendanceGrid';

export default AttendanceGrid;