import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { getLandingTeamData } from "@/lib/global/landing-people";
import type { TeamMember } from "@/types/global/landing-people";
import type {
  CommunityCodev,
  CommunityData,
  CommunityTrack,
} from "@/types/landing/codevs/community";

const trackPatterns: [CommunityTrack, RegExp][] = [
  ["full-stack", /full[\s-]*stack/i],
  ["frontend", /front[\s-]*end/i],
  ["backend", /back[\s-]*end/i],
  ["mobile", /mobile|react native|flutter|android|ios/i],
  ["ui-ux", /\bui\b|\bux\b|design/i],
  ["qa", /\bqa\b|quality|test/i],
];

function tracksOf(member: TeamMember, mentor: boolean): CommunityTrack[] {
  const tracks = trackPatterns
    .filter(([, pattern]) => pattern.test(member.role))
    .map(([track]) => track);

  return mentor ? [...tracks, "mentors"] : tracks;
}

function toCommunityCodev(member: TeamMember, mentor: boolean): CommunityCodev {
  return {
    id: member.id,
    name: member.name,
    role: member.role,
    initials: member.initials,
    imageSrc: member.imageSrc,
    mentor,
    tracks: tracksOf(member, mentor),
  };
}

function withPhotosFirst(members: CommunityCodev[]) {
  return [
    ...members.filter((member) => member.imageSrc),
    ...members.filter((member) => !member.imageSrc),
  ];
}

export async function getCachedCodevsCommunity(): Promise<CommunityData> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.landingAdmins);
  cacheTag(CACHE_TAGS.codevsProfiles);

  const data = await getLandingTeamData();
  const mentors = data.mentors.map((member) => toCommunityCodev(member, true));
  const mentorIds = new Set(mentors.map((member) => member.id));
  const codevs = data.codevs
    .filter((member) => !mentorIds.has(member.id))
    .map((member) => toCommunityCodev(member, false));

  return {
    members: [...withPhotosFirst(mentors), ...withPhotosFirst(codevs)],
    total: mentors.length + data.counts.codevs,
  };
}
