import { cacheLife, cacheTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/global/cache-tags";
import { getCachedLandingAdminsData } from "@/lib/global/landing-admins-cached";
import { createClientAnon } from "@/lib/global/supabase-anon";
import type { Codev } from "@/types/global/codev";
import type {
  LandingTeamData,
  LandingTeamPage,
  TeamFilter,
  TeamMember,
} from "@/types/global/landing-people";

const FOUNDER_USER_ID = process.env.NEXT_PUBLIC_FOUNDER_USER_ID ?? "";
const TEAM_PAGE_SIZE = 4;
const FEATURED_NAMES = [
  "Jan Phillip Dacallos",
  "Hallen Corpuz",
  "Bon Jury Pecaoco",
];

const CODEV_SELECT =
  "id, first_name, last_name, image_url, display_position, role_id";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function mapMember(
  member: Codev,
  badgeRole: TeamMember["badgeRole"],
  badgeLabel: string,
): TeamMember {
  const name = `${member.first_name} ${member.last_name}`.trim();

  return {
    id: member.id,
    name,
    role: member.display_position?.trim() ?? badgeLabel,
    initials: initials(name),
    imageSrc: member.image_url ?? undefined,
    badgeRole,
    badgeLabel,
  };
}

async function getCachedLandingCodevs() {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.codevsProfiles);

  const supabase = createClientAnon();
  const { data, count, error } = await supabase
    .from("codev")
    .select(CODEV_SELECT, { count: "exact" })
    .eq("role_id", 10)
    .eq("availability_status", true)
    .order("landing_rank_score", { ascending: false, nullsFirst: false })
    .order("id", { ascending: true });

  if (error) {
    console.error("Supabase query error (landing-team-codevs):", error);
    return { count: 0, members: [] as TeamMember[] };
  }

  return {
    count: count ?? 0,
    members: (data as Codev[]).map((member) =>
      mapMember(member, "codev", "CoDev"),
    ),
  };
}

export async function getLandingTeamData(): Promise<LandingTeamData> {
  const [adminsData, codevData] = await Promise.all([
    getCachedLandingAdminsData(),
    getCachedLandingCodevs(),
  ]);

  const admins = (adminsData?.admins ?? []).map((member) =>
    mapMember(member, "admin", "Admin"),
  );
  const mentors = (adminsData?.mentors ?? []).map((member) =>
    mapMember(member, "mentor", "Mentor"),
  );
  const featuredMentor = mentors.find((member) =>
    FEATURED_NAMES.includes(member.name),
  );
  const sortedMentors = featuredMentor
    ? [
        featuredMentor,
        ...mentors.filter((member) => member.id !== featuredMentor.id),
      ]
    : mentors;
  const codevs = codevData.members;

  const founder =
    admins.find((member) => member.id === FOUNDER_USER_ID) ??
    admins.find((member) => /founder|ceo/i.test(member.role)) ??
    admins[0];

  const sortedAdmins = founder
    ? [
        { ...founder, role: "Founder / CEO" },
        ...admins.filter((member) => member.id !== founder.id),
      ]
    : admins;

  const featuredCandidates = [
    sortedAdmins[0],
    ...FEATURED_NAMES.map((name) =>
      [...sortedMentors, ...codevs].find((member) => member.name === name),
    ),
    sortedMentors[0],
    ...codevs,
  ];
  const featured: TeamMember[] = [];

  for (const candidate of featuredCandidates) {
    if (
      candidate &&
      !featured.some((member) => member.id === candidate.id)
    ) {
      featured.push(candidate);
    }
    if (featured.length === 4) break;
  }

  const seen = new Set<string>();
  const all: TeamMember[] = [];

  for (const member of [
    ...featured,
    ...sortedAdmins,
    ...sortedMentors,
    ...codevs,
  ]) {
    if (seen.has(member.id)) continue;
    seen.add(member.id);
    all.push(member);
  }

  const counts = {
    admins: admins.length,
    mentors: sortedMentors.length,
    codevs: codevData.count,
    all: all.length,
  };

  return {
    counts,
    featured,
    all,
    admins: sortedAdmins,
    mentors: sortedMentors,
    codevs,
  };
}

export async function getCachedLandingTeamPage(
  filter: TeamFilter,
  page: number,
): Promise<LandingTeamPage> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.landingAdmins);
  cacheTag(CACHE_TAGS.codevsProfiles);

  const data = await getLandingTeamData();
  const members =
    filter === "admins"
      ? data.admins
      : filter === "mentors"
        ? data.mentors
        : filter === "codevs"
          ? data.codevs
          : data.all;

  const totalPages = Math.ceil(members.length / TEAM_PAGE_SIZE);
  const currentPage = Math.min(
    Math.max(1, Math.floor(page)),
    Math.max(1, totalPages),
  );
  const from = (currentPage - 1) * TEAM_PAGE_SIZE;

  return {
    counts: data.counts,
    members: members.slice(from, from + TEAM_PAGE_SIZE),
    filter,
    page: currentPage,
    total: members.length,
    totalPages,
  };
}
