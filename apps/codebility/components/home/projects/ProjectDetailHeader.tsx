"use client";

import type { FormEvent } from "react";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@codevs/ui/alert-dialog";
import { Badge } from "@codevs/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@codevs/ui/breadcrumb";
import { Button } from "@codevs/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@codevs/ui/dialog";
import { Input } from "@codevs/ui/input";
import { Label } from "@codevs/ui/label";
import { Textarea } from "@codevs/ui/textarea";

import { deleteProject, updateProject } from "@/actions/home/projects/projects";
import H1 from "@/components/global/layout/H1";
import pathsConfig from "@/constants/global/paths";
import type { ProjectDetail } from "@/types/home/projects/projects";

function readField(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === "string" ? value : "";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Manila",
  });
}

function formatDateRange(start: string | null, end: string | null) {
  if (start && end) return `${formatDate(start)} \u2013 ${formatDate(end)}`;
  if (start) return formatDate(start);
  if (end) return formatDate(end);
  return null;
}

export default function ProjectDetailHeader({
  project,
  canManage,
}: {
  project: ProjectDetail;
  canManage: boolean;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const dateRange = formatDateRange(project.startDate, project.endDate);

  async function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const name = readField(data, "name").trim();
    const tagline = readField(data, "tagline").trim();
    const status = readField(data, "status").trim();
    const description = readField(data, "description").trim();
    const projectCode = readField(data, "projectCode").trim();
    const startDate = readField(data, "startDate");
    const endDate = readField(data, "endDate");
    const githubLink = readField(data, "githubLink").trim();
    const websiteUrl = readField(data, "websiteUrl").trim();
    const figmaLink = readField(data, "figmaLink").trim();
    const meetingLink = readField(data, "meetingLink").trim();
    const techStack = readField(data, "techStack")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const keyFeatures = readField(data, "keyFeatures")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setSaving(true);
    setSaveError(null);

    try {
      await updateProject(project.id, {
        name,
        tagline,
        status,
        description,
        projectCode,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        githubLink,
        websiteUrl,
        figmaLink,
        meetingLink,
        techStack,
        keyFeatures,
      });
      setEditOpen(false);
      router.refresh();
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : "Could not update the project.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteProject(project.id);
      router.push(pathsConfig.app.projects);
    } catch (caught) {
      setDeleteError(
        caught instanceof Error
          ? caught.message
          : "Could not delete the project.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <header>
      <Breadcrumb className="mb-2">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={pathsConfig.app.projects}>Projects</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href={`${pathsConfig.app.projects}/${project.id}`}
                aria-current="page"
              >
                {project.name}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <H1>
            {project.name}
            {project.status && (
              <Badge variant="secondary" className="ml-2 align-middle">
                {project.status}
              </Badge>
            )}
          </H1>
          {project.tagline && (
            <p className="mt-1 text-sm text-muted-foreground">
              {project.tagline}
            </p>
          )}
        </div>
        {canManage && (
          <div className="flex flex-wrap items-center gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle>Edit project</DialogTitle>
                  <DialogDescription>
                    Update the project details.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEdit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-name">Name</Label>
                    <Input
                      id="project-name"
                      name="name"
                      required
                      defaultValue={project.name}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-tagline">Tagline</Label>
                    <Input
                      id="project-tagline"
                      name="tagline"
                      defaultValue={project.tagline ?? ""}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="project-status">Status</Label>
                      <Input
                        id="project-status"
                        name="status"
                        defaultValue={project.status ?? ""}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="project-code">Project code</Label>
                      <Input
                        id="project-code"
                        name="projectCode"
                        defaultValue={project.projectCode ?? ""}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="project-start">Start date</Label>
                      <Input
                        id="project-start"
                        name="startDate"
                        type="date"
                        defaultValue={project.startDate ?? ""}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="project-end">End date</Label>
                      <Input
                        id="project-end"
                        name="endDate"
                        type="date"
                        defaultValue={project.endDate ?? ""}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea
                      id="project-description"
                      name="description"
                      rows={4}
                      defaultValue={project.description ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-github">GitHub link</Label>
                    <Input
                      id="project-github"
                      name="githubLink"
                      type="url"
                      defaultValue={project.githubLink ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-website">Website URL</Label>
                    <Input
                      id="project-website"
                      name="websiteUrl"
                      type="url"
                      defaultValue={project.websiteUrl ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-figma">Figma link</Label>
                    <Input
                      id="project-figma"
                      name="figmaLink"
                      type="url"
                      defaultValue={project.figmaLink ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-meeting">Meeting link</Label>
                    <Input
                      id="project-meeting"
                      name="meetingLink"
                      type="url"
                      defaultValue={project.meetingLink ?? ""}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-tech">Tech stack</Label>
                    <Input
                      id="project-tech"
                      name="techStack"
                      placeholder="React, TypeScript, Supabase"
                      defaultValue={(project.techStack ?? []).join(", ")}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="project-features">Key features</Label>
                    <Input
                      id="project-features"
                      name="keyFeatures"
                      placeholder="Auth, Dashboard, Reports"
                      defaultValue={(project.keyFeatures ?? []).join(", ")}
                    />
                  </div>
                  {saveError && (
                    <p role="alert" className="text-sm text-destructive">
                      {saveError}
                    </p>
                  )}
                  <DialogFooter>
                    <Button type="submit" disabled={saving}>
                      {saving ? "Saving..." : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this project?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This removes the project along with its boards, sprints and
                    tasks. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete project"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            {deleteError && (
              <p role="alert" className="w-full text-sm text-destructive">
                {deleteError}
              </p>
            )}
          </div>
        )}
      </div>
      {[project.projectCode, dateRange].some(Boolean) && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {project.projectCode && <span>{project.projectCode}</span>}
          {dateRange && <span>{dateRange}</span>}
        </div>
      )}
    </header>
  );
}
