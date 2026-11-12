"use client";

import { ArrowRight } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/global/design-system/Button";
import { MemberChip } from "@/components/global/design-system/MemberChip";
import { RoleBadge } from "@/components/global/design-system/RoleBadge";
import { Tab, Tabs, TabsList } from "@/components/global/design-system/Tabs";
import { communityFilters } from "@/constants/landing/codevs/codevs-content";
import type {
  CommunityData,
  CommunityTrack,
} from "@/types/landing/codevs/community";

const PREVIEW_COUNT = 12;

function CodevsCommunityList({ members, total }: CommunityData) {
  const [track, setTrack] = React.useState<CommunityTrack>("all");
  const [expanded, setExpanded] = React.useState(false);

  const filtered =
    track === "all"
      ? members
      : members.filter((member) => member.tracks.includes(track));
  const visible = expanded ? filtered : filtered.slice(0, PREVIEW_COUNT);
  const hidden = filtered.length - visible.length;

  function handleTrackChange(next: string) {
    setTrack(next as CommunityTrack);
    setExpanded(false);
  }

  return (
    <div className="flex flex-col items-center gap-[var(--cb-space-32)]">
      <Tabs
        value={track}
        onValueChange={handleTrackChange}
        className="w-full sm:w-auto"
      >
        <TabsList
          aria-label="Filter CoDevs by track"
          className="w-full sm:w-auto"
        >
          {communityFilters.map((filter) => (
            <Tab
              key={filter.value}
              value={filter.value}
              aria-controls="community-members"
              count={filter.value === "all" ? total : undefined}
              className="shrink-0"
            >
              {filter.label}
            </Tab>
          ))}
        </TabsList>
      </Tabs>

      {visible.length > 0 ? (
        <ul
          id="community-members"
          aria-live="polite"
          className="flex max-w-[1120px] flex-wrap justify-center gap-[var(--cb-space-12)]"
        >
          {visible.map((member) => (
            <li key={member.id} className="max-w-full">
              <MemberChip
                name={member.name}
                role={member.role}
                initials={member.initials}
                avatarSrc={member.imageSrc}
                href={`/profiles/${member.id}`}
                highlighted={member.mentor}
                badge={
                  member.mentor ? (
                    <RoleBadge
                      role="mentor"
                      className="h-[22px] shrink-0 px-[var(--cb-space-12)]"
                    />
                  ) : null
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <p
          id="community-members"
          className="py-[var(--cb-space-24)] text-sm text-[color:var(--cb-text-muted)]"
        >
          No CoDevs in this track yet.
        </p>
      )}

      {hidden > 0 ? (
        <Button
          variant="outline"
          aria-controls="community-members"
          onClick={() => setExpanded(true)}
        >
          View all CoDevs
          <ArrowRight
            aria-hidden
            className="h-[var(--cb-size-16)] w-[var(--cb-size-16)]"
          />
        </Button>
      ) : null}
    </div>
  );
}

export { CodevsCommunityList };
