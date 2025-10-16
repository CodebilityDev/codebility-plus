// apps/codebility/app/home/my-team/_components/MemberDetailModal.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DefaultAvatar from "@/components/DefaultAvatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SimpleMemberData } from "@/app/home/projects/actions";
import {
  Mail,
  Calendar,
  Trophy,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@codevs/ui/tabs";
import MemberRating from "./MemberRating";
import MemberChecklist from "./MemberChecklist";

interface MemberPoints {
  totalPoints: number;
  attendancePoints: number;
}

interface MemberDetailModalProps {
  isOpen: boolean;
  member: SimpleMemberData | null;
  isTeamLead?: boolean;
  projectId?: string;
  onClose: () => void;
}

const MemberDetailModal = ({ 
  isOpen, 
  member, 
  isTeamLead = false, 
  projectId,
  onClose 
}: MemberDetailModalProps) => {
  const [memberPoints, setMemberPoints] = useState<MemberPoints | null>(null);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);

  // Load member points for the header display
  useEffect(() => {
    if (isOpen && member) {
      loadMemberPoints();
    }
  }, [isOpen, member]);

  const loadMemberPoints = async () => {
    if (!member) return;
    
    setIsLoadingPoints(true);
    try {
      const response = await fetch(`/api/codev/${member.id}/points`);
      if (response.ok) {
        const data = await response.json() as { totalPoints?: number; attendancePoints?: number };
        setMemberPoints({
          totalPoints: data.totalPoints || 0,
          attendancePoints: data.attendancePoints || 0
        });
      }
    } catch (error) {
      console.error("Error loading member points:", error);
    } finally {
      setIsLoadingPoints(false);
    }
  };

  if (!isOpen || !member) return null;

  const formatName = (firstName: string, lastName: string): string => 
    `${firstName.charAt(0).toUpperCase()}${firstName.slice(1).toLowerCase()} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1).toLowerCase()}`;

  const imageUrl = member.image_url || "/assets/images/default-avatar-200x200.jpg";
  const displayName = formatName(member.first_name, member.last_name);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`mobile:max-w-[95vw] flex max-h-[75vh] min-h-[75vh] flex-col
        overflow-y-auto sm:max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]
        bg-white/30 backdrop-blur-md dark:bg-slate-900/80 border border-white/30 dark:border-white/20 shadow-2xl
        `}
      >
        <DialogHeader>
          <div className="mobile:flex-col flex gap-6 p-4 sm:flex-col sm:justify-between 2xl:flex-row 2xl:justify-start">
            <div className="mobile:flex-col mobile:justify-center mobile:items-center sm:flex-row flex gap-4 sm:items-start sm:justify-start">
              <div className="relative flex-shrink-0">
                {/* Profile Image */}
                {member.image_url ? (
                  <div className="relative h-32 w-32">
                    <Image
                      src={imageUrl}
                      alt={`${displayName}'s profile`}
                      className="rounded-full object-cover"
                      fill
                    />
                  </div>
                ) : (
                  <DefaultAvatar size={128} />
                )}
                {isTeamLead && (
                  <div className="absolute -bottom-2 -right-2 rounded-full bg-blue-500 px-3 py-1">
                    <span className="text-sm font-bold text-white">Team Lead</span>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex flex-col gap-2">
                <DialogTitle className="text-2xl font-bold">
                  {displayName}
                </DialogTitle>

                <div className="flex flex-col gap-1">
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {member.display_position || "Team Member"}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Active</span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined {new Date(member.joined_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mobile:flex-col mobile:items-center flex gap-4 sm:items-start sm:justify-between 2xl:justify-start">
              {/* Contact Information */}
              <div className="mobile:flex-row mobile:gap-4 flex sm:flex-col gap-3">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  value={member.email_address}
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Joined"
                  value={new Date(member.joined_at).toLocaleDateString()}
                />
                {memberPoints && (
                  <InfoItem
                    icon={<Trophy className="h-4 w-4" />}
                    label="Total Points"
                    value={memberPoints.totalPoints.toString()}
                  />
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className="mobile:flex-col-reverse absolute right-4 top-12 flex items-center gap-4">
              <div className="bg-green-500 rounded px-2 py-1 text-xs text-white font-medium">
                Active
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Content Tabs */}
        <Tabs defaultValue="rating" className="mobile:mt-2 flex flex-col gap-6">
          <TabsList className="mobile:text-sm mobile:gap-2 mobile:grid-cols-2 grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm dark:bg-white/10 border border-white/30 dark:border-white/20">
            <TabsTrigger value="rating">Rating</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
          </TabsList>

          {/* Rating Tab - 10-Star Rating System */}
          <TabsContent value="rating" className="space-y-6">
            <MemberRating memberId={member.id} projectId={projectId || ''} />
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-6">
            <MemberChecklist memberId={member.id} projectId={projectId || ''} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Helper Component for displaying info items
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) => {
  if (!value) return null;

  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="mobile:hidden text-sm text-gray-500 sm:hidden">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
};

export default MemberDetailModal;