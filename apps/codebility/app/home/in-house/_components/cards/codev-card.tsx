import Image from "next/image";
import { Codev } from "@/types/home/codev";
import { Edit2, Eye, Trash2 } from "lucide-react";

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
  const capitalize = (str: string | undefined | null) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "-";

  return (
    <Card className="bg-light-300 dark:bg-dark-100 border-light-700 dark:border-dark-200 flex h-full flex-col">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <Image
            src={data.image_url || defaultImage}
            alt={`${data.first_name} avatar`}
            width={80}
            height={80}
            className="border-light-700 dark:border-dark-200 h-20 w-20 rounded-full border-2 object-cover"
          />
        </div>
        <div className="space-y-2">
          <h3 className="dark:text-light-900 truncate text-lg font-semibold text-black">
            {capitalize(data.first_name)} {capitalize(data.last_name)}
          </h3>
          <StatusBadge status={data.internal_status || "TRAINING"} />
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray dark:text-light-500">Position:</span>
          <span className="dark:text-light-900 truncate text-black">
            {data.display_position || "-"}
          </span>
        </div>

        {data.projects && data.projects.length > 0 && (
          <div>
            <p className="text-gray dark:text-light-500 text-sm">Projects:</p>
            <ul className="dark:text-light-900 list-disc space-y-1 pl-4 text-sm text-black">
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

        {data.tech_stacks && data.tech_stacks.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {data.tech_stacks.slice(0, 24).map((stack) => (
                <Image
                  key={stack}
                  src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
                  alt={stack}
                  width={25}
                  height={25}
                  className="h-[25px] w-[25px] rounded object-cover"
                />
              ))}
              {data.tech_stacks.length > 24 && (
                <span className="text-gray dark:text-light-500 text-xs">
                  +{data.tech_stacks.length - 24} more
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-light-700 dark:border-dark-200 flex justify-center gap-2 border-t py-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => alert("View action")}
          className="dark:text-light-900 hover:bg-light-800 dark:hover:bg-dark-200 p-1 text-black"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="dark:text-light-900 hover:bg-light-800 dark:hover:bg-dark-200 p-1 text-black"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
