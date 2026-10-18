"use client";

import { useEffect, useState } from "react";

import { Check, Plus, X } from "lucide-react";

import { getAssigneesByIds } from "@/actions/home/kanban/assignees";
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

const assigneeCache = new Map<string, AssigneeOption>();

export default function TaskAssigneePicker({
  label,
  multiple,
  projectId,
  disabledIds = [],
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  multiple: boolean;
  projectId: string;
  disabledIds?: string[];
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}) {
  const [options, setOptions] = useState<Record<string, AssigneeOption>>(() => {
    const initial: Record<string, AssigneeOption> = {};

    for (const id of value) {
      const cached = assigneeCache.get(id);

      if (cached) initial[id] = cached;
    }

    return initial;
  });
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { candidates, isLoading, error } = useAssigneeCandidates(
    query,
    projectId,
  );
  const valueKey = value.join(",");

  useEffect(() => {
    const ids = valueKey ? valueKey.split(",") : [];
    const unknown = ids.filter((id) => !options[id] && !assigneeCache.has(id));

    if (unknown.length === 0) return;

    let active = true;

    getAssigneesByIds(unknown)
      .then((rows) => {
        if (rows.length === 0) return;

        for (const row of rows) assigneeCache.set(row.id, row);

        if (!active) return;

        setOptions((previous) => {
          const next = { ...previous };

          for (const row of rows) next[row.id] = row;

          return next;
        });
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [valueKey, options]);

  function lookup(id: string) {
    return options[id] ?? candidates.find((entry) => entry.id === id);
  }

  function toggle(candidate: AssigneeOption) {
    const exists = value.includes(candidate.id);
    const next = exists
      ? value.filter((id) => id !== candidate.id)
      : multiple
        ? [...value, candidate.id]
        : [candidate.id];

    onChange(next);
  }

  function remove(id: string) {
    onChange(value.filter((entry) => entry !== id));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {value.map((id) => {
        const member = lookup(id);

        if (!member) return null;

        return (
          <button
            key={id}
            type="button"
            onClick={() => remove(id)}
            disabled={disabled}
            aria-label={`Remove ${member.firstName} ${member.lastName}`}
            className="group relative h-9 w-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-customBlue-100 disabled:pointer-events-none disabled:opacity-50"
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
        );
      })}
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (!disabled) setOpen(next);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            disabled={disabled}
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
                  const isSelected = value.includes(candidate.id);
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
