"use client";

import Image from "next/image";
import { Users } from "lucide-react";
import { SimpleMemberData } from "@/app/home/projects/actions";

// CDN fallback avatar — consistent with rest of codebase
const DEFAULT_AVATAR =
  "https://codebility-cdn.pages.dev/assets/images/default-avatar-200x200.jpg";

interface TeamLeadersDisplayProps {
  teamLead: SimpleMemberData | null;
  subLead: SimpleMemberData | null;
}

/**
 * Capitalize first letter of each word in a name.
 * Keeps consistent formatting regardless of DB casing.
 */
const formatName = (firstName: string, lastName: string): string =>
  `${firstName.charAt(0).toUpperCase()}${firstName.slice(1)} ${lastName.charAt(0).toUpperCase()}${lastName.slice(1)}`;

/**
 * TeamLeadersDisplay
 *
 * Renders a leadership section with two cards: Team Lead and Sublead.
 * Each card shows: avatar, full name, role label badge.
 * If no sublead is assigned, shows a "No sublead assigned" placeholder.
 * If no team lead exists, renders nothing (should not happen in practice).
 */
const TeamLeadersDisplay = ({ teamLead, subLead }: TeamLeadersDisplayProps) => {
  // No team lead = section has nothing to show
  if (!teamLead) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Team Leadership
      </h3>

      <div className="flex flex-wrap gap-3">
        {/* Team Lead card */}
        <LeaderCard member={teamLead} roleLabel="Lead" />

        {/* Sublead card — or placeholder if none assigned */}
        {subLead ? (
          <LeaderCard member={subLead} roleLabel="Sublead" />
        ) : (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-700/30">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-400 dark:text-gray-500">
              No sublead assigned
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

interface LeaderCardProps {
  member: SimpleMemberData;
  roleLabel: "Lead" | "Sublead";
}

/**
 * LeaderCard
 *
 * Single leader card: avatar + full name + role badge.
 * Lead badge is blue, Sublead badge is purple — matches existing
 * project modal styling from CBP-116.
 */
const LeaderCard = ({ member, roleLabel }: LeaderCardProps) => {
  const avatarSrc = member.image_url || DEFAULT_AVATAR;
  const fullName = formatName(member.first_name, member.last_name);
  const isLead = roleLabel === "Lead";

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-600 dark:bg-gray-700/50">
      {/* Avatar */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-gray-700">
        <Image
          src={avatarSrc}
          alt={fullName}
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Name + badge */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          {fullName}
        </span>
        <span
          className={`mt-0.5 w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
            isLead
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
              : "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
          }`}
        >
          {roleLabel}
        </span>
      </div>
    </div>
  );
};

export default TeamLeadersDisplay;