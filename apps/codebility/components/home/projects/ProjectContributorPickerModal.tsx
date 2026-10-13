"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useRef, useState } from "react";

import { useRouter } from "next/navigation";

import { addContributors } from "@/actions/home/projects/contributors";
import { Button } from "@/components/global/ui/button";
import { useModal } from "@/hooks/global/use-modal";
import { useContributorCandidates } from "@/hooks/home/projects/use-contributor-candidates";
import type { ContributorCandidate } from "@/types/home/projects/projects";

import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@codevs/ui/avatar";
import { Checkbox } from "@codevs/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";

function readProjectId(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const { projectId } = data as Record<string, unknown>;
  if (typeof projectId !== "string" || projectId.length === 0) return null;
  return projectId;
}

function readField(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

const SKELETON_ROW_COUNT = 6;
const ESTIMATED_ROW_HEIGHT = 52;

function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 rounded-md px-2 py-2">
      <div aria-hidden="true" className="h-4 w-4 rounded-sm bg-muted" />
      <div aria-hidden="true" className="h-8 w-8 rounded-full bg-muted" />
      <div className="flex min-w-0 flex-col gap-1">
        <div aria-hidden="true" className="h-3 w-32 rounded bg-muted" />
        <div aria-hidden="true" className="h-3 w-20 rounded bg-muted" />
      </div>
    </li>
  );
}

function CandidateRow({
  candidate,
  checked,
  onToggle,
}: {
  candidate: ContributorCandidate;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex h-full cursor-pointer items-center gap-3 rounded-md px-2 py-2 hover:bg-muted">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={candidate.imageUrl ?? undefined}
          alt={`${candidate.firstName} ${candidate.lastName}`}
        />
        <AvatarFallback>
          {candidate.firstName.charAt(0)}
          {candidate.lastName.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">
          {candidate.firstName} {candidate.lastName}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {candidate.displayPosition ?? candidate.username ?? ""}
        </span>
      </span>
    </label>
  );
}

export default function ProjectContributorPickerModal() {
  const router = useRouter();
  const modal = useModal();
  const { isOpen, onClose } = modal;
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    candidates,
    isLoading,
    isLoadingMore,
    error: searchError,
    sentinelRef,
  } = useContributorCandidates(query);
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: candidates.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 8,
  });

  const projectId = readProjectId(modal.data);

  if (projectId === null) return null;

  const message = error ?? searchError;

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setQuery(readField(formData, "query").trim());
  }

  function toggleCandidate(codevId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(codevId)) next.delete(codevId);
      else next.add(codevId);
      return next;
    });
  }

  async function handleAdd() {
    if (projectId === null) return;

    setPending(true);
    setError(null);

    try {
      await addContributors(projectId, Array.from(selected));
      setSelected(new Set());
      onClose();
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not add contributors.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="flex max-h-[85vh] flex-col gap-4">
        <DialogHeader>
          <DialogTitle>Add contributors</DialogTitle>
          <DialogDescription>
            Select the people to add to this project.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSearch} className="flex flex-col gap-2">
          <Label htmlFor="contributor-search">Search</Label>
          <Input
            id="contributor-search"
            name="query"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search by name or username"
          />
        </form>
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <ul
              aria-hidden="true"
              className="flex flex-col gap-1"
              data-testid="candidate-skeleton"
            >
              {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                <SkeletonRow key={index} />
              ))}
            </ul>
          ) : candidates.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found</p>
          ) : (
            <div
              className="relative w-full"
              style={{ height: virtualizer.getTotalSize() }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const candidate = candidates[virtualRow.index];
                if (!candidate) return null;

                return (
                  <div
                    key={candidate.id}
                    data-index={virtualRow.index}
                    data-testid="candidate-row"
                    className="absolute left-0 top-0 w-full"
                    style={{
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <CandidateRow
                      candidate={candidate}
                      checked={selected.has(candidate.id)}
                      onToggle={() => toggleCandidate(candidate.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
          <div ref={sentinelRef} aria-hidden="true" className="h-px" />
          {!isLoading && isLoadingMore && (
            <div
              role="status"
              data-testid="load-more-spinner"
              className="flex items-center justify-center py-3"
            >
              <Loader2Icon
                aria-hidden="true"
                className="h-5 w-5 animate-spin text-muted-foreground"
              />
              <span className="sr-only">Loading more contributors</span>
            </div>
          )}
        </div>
        {message && (
          <p role="alert" className="text-sm text-destructive">
            {message}
          </p>
        )}
        <DialogFooter>
          <Button
            type="button"
            className="w-auto"
            onClick={handleAdd}
            disabled={selected.size === 0 || pending}
            loading={pending}
            loadingText="Adding contributors..."
          >
            Add {selected.size} contributors
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
