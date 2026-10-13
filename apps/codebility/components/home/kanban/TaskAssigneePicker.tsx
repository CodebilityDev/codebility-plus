"use client";

import { useState } from "react";

import { Check, Plus, X } from "lucide-react";

import { useAssigneeCandidates } from "@/hooks/home/kanban/use-assignee-candidates";
import type { AssigneeOption } from "@/types/home/kanban/kanban";

import { Avatar, AvatarFallback, AvatarImage } from "@codevs/ui/avatar";
import { Button } from "@codevs/ui/button";
import { Input } from "@codevs/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@codevs/ui/popover";

function initials(candidate: AssigneeOption) {
  return `${candidate.firstName.charAt(0)}${candidate.lastName.charAt(0)}`;
}

export default function TaskAssigneePicker({
  label,
  multiple,
  disabledIds = [],
  onChange,
}: {
  label: string;
  multiple: boolean;
  disabledIds?: string[];
  onChange: (ids: string[]) => void;
}) {
  const [selected, setSelected] = useState<AssigneeOption[]>([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { candidates, isLoading, error } = useAssigneeCandidates(query);

  function toggle(candidate: AssigneeOption) {
    const exists = selected.some((entry) => entry.id === candidate.id);
    const next = exists
      ? selected.filter((entry) => entry.id !== candidate.id)
      : multiple
        ? [...selected, candidate]
        : [candidate];

    setSelected(next);
    onChange(next.map((entry) => entry.id));
  }

  function remove(candidate: AssigneeOption) {
    const next = selected.filter((entry) => entry.id !== candidate.id);

    setSelected(next);
    onChange(next.map((entry) => entry.id));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selected.map((member) => (
        <button
          key={member.id}
          type="button"
          onClick={() => remove(member)}
          aria-label={`Remove ${member.firstName} ${member.lastName}`}
          className="group relative h-9 w-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-customBlue-100"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={member.imageUrl ?? undefined}
              alt={`${member.firstName} ${member.lastName}`}
            />
            <AvatarFallback>{initials(member)}</AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 hidden items-center justify-center rounded-full bg-black/50 group-hover:flex">
            <X aria-hidden="true" className="h-4 w-4 text-white" />
          </span>
        </button>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            aria-label={`Add ${label}`}
            className="h-9 w-9 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-0">
          <div className="border-b p-2">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or username"
              aria-label={`Search ${label}`}
            />
          </div>
          <div className="max-h-64 overflow-y-auto p-1">
            {isLoading ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                Loading...
              </p>
            ) : candidates.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                No users found
              </p>
            ) : (
              <ul className="flex flex-col">
                {candidates.map((candidate) => {
                  const isSelected = selected.some(
                    (entry) => entry.id === candidate.id,
                  );
                  const isDisabled =
                    !isSelected && disabledIds.includes(candidate.id);

                  return (
                    <li key={candidate.id}>
                      <button
                        type="button"
                        onClick={() => toggle(candidate)}
                        disabled={isDisabled}
                        className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={candidate.imageUrl ?? undefined}
                            alt={`${candidate.firstName} ${candidate.lastName}`}
                          />
                          <AvatarFallback>{initials(candidate)}</AvatarFallback>
                        </Avatar>
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="truncate text-sm font-medium text-foreground">
                            {candidate.firstName} {candidate.lastName}
                          </span>
                          <span className="truncate text-xs text-muted-foreground">
                            {candidate.displayPosition ??
                              candidate.username ??
                              ""}
                          </span>
                        </span>
                        {isSelected ? (
                          <Check
                            aria-hidden="true"
                            className="h-4 w-4 text-customBlue-100"
                          />
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {error ? (
            <p role="alert" className="border-t p-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
