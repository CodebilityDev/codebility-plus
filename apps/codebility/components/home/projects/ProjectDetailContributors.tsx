"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { removeContributor } from "@/actions/home/projects/contributors";
import OverlayTrigger from "@/components/global/OverlayTrigger";
import { Button } from "@/components/global/ui/button";
import type { ProjectContributor } from "@/types/home/projects/projects";

import { Avatar, AvatarFallback, AvatarImage } from "@codevs/ui/avatar";
import { Badge } from "@codevs/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}

export default function ProjectDetailContributors({
  projectId,
  contributors,
  canManage,
}: {
  projectId: string;
  contributors: ProjectContributor[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleRemove(codevId: string) {
    setPendingId(codevId);
    setError(null);

    try {
      await removeContributor(projectId, codevId);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not remove the contributor.",
      );
    } finally {
      setPendingId(null);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
        <CardTitle className="text-lg">Contributors</CardTitle>
        {canManage && <OverlayTrigger type="projectContributorPicker" data={{ projectId }}>Add contributors</OverlayTrigger>}
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {contributors.length === 0 ? (
          <p className="text-sm text-muted-foreground">No contributors yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {contributors.map((contributor) => (
              <li
                key={contributor.id}
                className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={contributor.imageUrl ?? undefined}
                    alt={`${contributor.firstName} ${contributor.lastName}`}
                  />
                  <AvatarFallback>
                    {contributor.firstName.charAt(0)}
                    {contributor.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">
                    {contributor.firstName} {contributor.lastName}
                  </span>
                  {contributor.displayPosition && (
                    <span className="truncate text-xs text-muted-foreground">
                      {contributor.displayPosition}
                    </span>
                  )}
                </span>
                <Badge variant="secondary">{contributor.role}</Badge>
                {contributor.joinedAt && (
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {formatDate(contributor.joinedAt)}
                  </span>
                )}
                {canManage && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-auto"
                    onClick={() => handleRemove(contributor.codevId)}
                    loading={pendingId === contributor.codevId}
                    loadingText="Removing..."
                  >
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
