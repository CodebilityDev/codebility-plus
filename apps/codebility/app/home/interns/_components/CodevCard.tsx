"use client";

import DefaultAvatar from "@/Components/DefaultAvatar";
import Box from "@/Components/shared/dashboard/Box";
import { useModal } from "@/hooks/use-modal-users";
import {
  Codev,
  CodevPoints,
  InternalStatus,
  Project,
} from "@/types/home/codev";

import { Badge } from "@codevs/ui/badge";
import { Button } from "@codevs/ui/button";

import { StatusBadge } from "../../in-house/_components/shared/status-badge";

interface CodevCardProps {
  codev: Codev;
}

export default function CodevCard({ codev }: CodevCardProps) {
  const { onOpen } = useModal();

  // Helper function to safely check array length
  const hasItems = (arr: any[] | undefined): arr is any[] => {
    return Array.isArray(arr) && arr.length > 0;
  };

  return (
    <Box className="h-full w-full rounded-lg border-none px-0 transition-all hover:shadow-lg">
      <div className="flex h-full flex-col">
        {/* Header Section */}
        <div className="relative p-4 text-center">
          <div className="relative mx-auto">
            {codev.image_url ? (
              <div className="relative mx-auto h-24 w-24">
                <img
                  src={codev.image_url}
                  alt={`${codev.first_name}'s avatar`}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            ) : (
              <DefaultAvatar size={96} className="mx-auto" />
            )}
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {codev.first_name} {codev.last_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {codev.display_position || "No Position"}
            </p>
            <StatusBadge
              status={(codev.internal_status as InternalStatus) || "AVAILABLE"}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4 bg-gray-50 p-4 dark:bg-gray-800">
          {/* Tech Stack */}
          {hasItems(codev.tech_stacks) && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1">
                {codev.tech_stacks.map((tech) => (
                  <Badge
                    key={tech}
                    variant="outline"
                    className="text-xs capitalize"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Projects
            </h4>
            <div className="flex flex-wrap gap-1">
              {hasItems(codev.projects) ? (
                codev.projects.map((project) => (
                  <Badge
                    key={project.id}
                    className="bg-blue-100 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {project.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="outline" className="text-xs">
                  Available for Projects
                </Badge>
              )}
            </div>
          </div>

          {/* Skill Points */}
          {hasItems(codev.codev_points) && (
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill Points
              </h4>
              <div className="flex flex-wrap gap-1">
                {codev.codev_points.map((point) => (
                  <Badge
                    key={point.skill_category_id}
                    variant="outline"
                    className="text-xs font-medium"
                  >
                    {point.points} pts
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Years of Experience */}
          {codev.years_of_experience !== undefined && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {codev.years_of_experience}{" "}
              {codev.years_of_experience === 1 ? "year" : "years"} of experience
            </div>
          )}
        </div>

        {/* Footer */}
        <Button
          onClick={() => onOpen("profileModal", codev)}
          className="mt-auto w-full rounded-t-none bg-blue-600 text-white hover:bg-blue-700"
        >
          View Profile
        </Button>
      </div>
    </Box>
  );
}
