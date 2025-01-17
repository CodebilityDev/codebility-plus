import Image from "next/image";
import { Codev } from "@/types/home/codev";
import { Edit2, Eye } from "lucide-react";

import { Button } from "@codevs/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@codevs/ui/card";

import { StatusBadge } from "../shared/status-badge";

const defaultImage = "/assets/svgs/icon-codebility-black.svg";

interface CodevCardProps {
  data: Codev;
  onEdit: () => void;
  onDelete: () => void;
}

export function CodevCard({ data, onEdit, onDelete }: CodevCardProps) {
  const capitalize = (str: string | undefined | null) => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  };

  return (
    <Card className="bg-light-300 dark:bg-dark-100 border-light-700 dark:border-dark-200 flex h-[420px] flex-col">
      <CardHeader className="space-y-4 text-center">
        <div className="flex justify-center">
          <Image
            src={data.image_url || defaultImage}
            alt={`${data.first_name} avatar`}
            width={80}
            height={80}
            className="bg-light-800 dark:bg-dark-200 border-light-700 dark:border-dark-200 rounded-full border-2"
          />
        </div>
        <div className="space-y-2">
          <h3 className="dark:text-light-900 text-lg font-semibold text-black">
            {capitalize(data.first_name)} {capitalize(data.last_name)}
          </h3>
          <StatusBadge status={data.internal_status} />
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray dark:text-light-500">Position:</span>
            <span className="dark:text-light-900 text-black">
              {data.main_position || "-"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray dark:text-light-500">Type:</span>
            <span className="dark:text-light-900 text-black">
              {capitalize(data.type) || "-"}
            </span>
          </div>
        </div>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="space-y-1">
            <p className="text-gray dark:text-light-500 text-sm">Projects:</p>
            <ul className="dark:text-light-900 list-disc pl-4 text-sm text-black">
              {data.projects.slice(0, 2).map((project) => (
                <li key={project.id}>{capitalize(project.name)}</li>
              ))}
              {data.projects.length > 2 && (
                <li className="text-gray dark:text-light-500">
                  +{data.projects.length - 2} more
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Tech Stack */}
        {data.tech_stacks && data.tech_stacks.length > 0 && (
          <div className="space-y-1">
            <p className="text-gray dark:text-light-500 text-sm">Tech Stack:</p>
            <div className="flex flex-wrap gap-1">
              {data.tech_stacks.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="bg-light-800 dark:bg-dark-200 dark:text-light-900 rounded-md px-2 py-0.5 text-xs text-black"
                >
                  {tech}
                </span>
              ))}
              {data.tech_stacks.length > 3 && (
                <span className="text-gray dark:text-light-500 text-xs">
                  +{data.tech_stacks.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-light-700 dark:border-dark-200 flex justify-between border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="dark:text-light-900 dark:hover:text-light-900/80 text-black hover:text-black/80"
        >
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="dark:text-light-900 dark:hover:text-light-900/80 text-black hover:text-black/80"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
          >
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
