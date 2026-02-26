"use client";

import { useState, useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ProjectData {
    id: string;
    name: string;
    team_leader_name: string | null;
}

interface TicketSupportFormProps {
    projects: ProjectData[];
}

const ROLE_POSITIONS = [
    "Frontend Developer",
    "Backend Developer",
    "UI/UX Designer",
    "Mobile Developer",
    "QA Tester",
    "Project Manager",
    "Full Stack Developer",
];

const TICKET_TYPES = [
    "Bug Report",
    "Feature Request",
    "Access Issue",
    "UI/UX Issue",
    "Performance Issue",
    "Account Issue",
    "Other",
];

const PRIORITY_LEVELS = ["critical", "high", "medium", "low"];

const TICKET_DETAILS_MAX_CHARS = 1000;

export default function TicketSupportForm({
    projects,
}: TicketSupportFormProps) {
    const [fullName, setFullName] = useState("");
    const [rolePosition, setRolePosition] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [assignedTeam, setAssignedTeam] = useState("");
    const [ticketType, setTicketType] = useState("");
    const [otherType, setOtherType] = useState("");
    const [priority, setPriority] = useState("");
    const [ticketTitle, setTicketTitle] = useState("");
    const [ticketDetails, setTicketDetails] = useState("");
    const handleProjectChange = (projectId: string) => {
        setSelectedProject(projectId);
        if (projectId === "none") {
            setAssignedTeam("");
            return;
        }
        const project = projects.find((p) => p.id === projectId);
        if (project?.team_leader_name) {
            setAssignedTeam(project.team_leader_name);
        } else {
            setAssignedTeam("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Frontend-only — no backend submission
        alert("Ticket submission is coming soon!");
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-10">
            {/* Inquiree Info Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                    <h2 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        Inquiree Info
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="bg-light-900 dark:bg-dark-200 dark:text-light-900 focus:border-customBlue-500 w-full rounded-lg border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-customBlue-100 dark:border-zinc-700 dark:placeholder:text-gray-500"
                            required
                        />
                    </div>

                    {/* Role Position */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Role Position <span className="text-red-500">*</span>
                        </Label>
                        <Select value={rolePosition} onValueChange={setRolePosition}>
                            <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {ROLE_POSITIONS.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Project */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Project <span className="text-red-500">*</span>
                        </Label>
                        <Select value={selectedProject} onValueChange={handleProjectChange}>
                            <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Select your project" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="none">None</SelectItem>
                                    {projects.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Assigned Team */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Assigned Team</Label>
                        <input
                            type="text"
                            value={assignedTeam}
                            readOnly={selectedProject !== "none"}
                            onChange={(e) => setAssignedTeam(e.target.value)}
                            placeholder={selectedProject === "none" ? "Enter team or lead name" : "Auto-filled from project"}
                            className={`bg-light-900 dark:bg-dark-200 dark:text-light-900 w-full rounded-lg border border-gray-300 p-2 text-sm placeholder:text-gray-400 dark:border-zinc-700 dark:placeholder:text-gray-500 ${selectedProject !== "none" ? "cursor-not-allowed" : "focus:border-customBlue-500 focus:outline-none focus:ring-1 focus:ring-customBlue-100"
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* How can we help you? Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                    <h2 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-200">
                        How can we help you?
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Type */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={ticketType} onValueChange={setTicketType}>
                            <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Select ticket type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {TICKET_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Priority <span className="text-red-500">*</span>
                        </Label>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger className="bg-light-900 focus:border-customBlue-500 border border-gray-300 dark:border-gray-700">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {PRIORITY_LEVELS.map((level) => (
                                        <SelectItem
                                            key={level}
                                            value={level}
                                            className="capitalize"
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Other Type input (shown when "Other" is selected) */}
                {ticketType === "Other" && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Please specify <span className="text-red-500">*</span>
                        </Label>
                        <input
                            type="text"
                            value={otherType}
                            onChange={(e) => setOtherType(e.target.value)}
                            placeholder="Describe your inquiry type"
                            className="bg-light-900 dark:bg-dark-200 dark:text-light-900 focus:border-customBlue-500 w-full rounded-lg border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-customBlue-100 dark:border-zinc-700 dark:placeholder:text-gray-500"
                            required
                        />
                    </div>
                )}

                {/* Ticket Title (Optional) */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Ticket Title{" "}
                        <span className="ml-2 text-xs text-gray-500">(Optional)</span>
                    </Label>
                    <input
                        type="text"
                        value={ticketTitle}
                        onChange={(e) => setTicketTitle(e.target.value)}
                        placeholder="Brief summary of your issue"
                        className="bg-light-900 dark:bg-dark-200 dark:text-light-900 focus:border-customBlue-500 w-full rounded-lg border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-customBlue-100 dark:border-zinc-700 dark:placeholder:text-gray-500"
                    />
                </div>

                {/* Ticket Details */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                            Ticket Details <span className="text-red-500">*</span>
                        </Label>
                        <span
                            className={`text-xs ${ticketDetails.length > TICKET_DETAILS_MAX_CHARS * 0.9
                                ? "font-semibold text-red-500"
                                : "text-gray-400 dark:text-gray-500"
                                }`}
                        >
                            {ticketDetails.length}/{TICKET_DETAILS_MAX_CHARS}
                        </span>
                    </div>
                    <textarea
                        value={ticketDetails}
                        onChange={(e) => {
                            if (e.target.value.length <= TICKET_DETAILS_MAX_CHARS) {
                                setTicketDetails(e.target.value);
                            }
                        }}
                        placeholder="Provide detailed information about your issue..."
                        rows={6}
                        maxLength={TICKET_DETAILS_MAX_CHARS}
                        required
                        className="bg-light-900 dark:bg-dark-200 dark:text-light-900 focus:border-customBlue-500 w-full resize-none rounded-lg border border-gray-300 p-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-customBlue-100 dark:border-zinc-700 dark:placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Submit Button — matches portal button style */}
            <div className="flex justify-start gap-2 pt-2">
                <button
                    type="submit"
                    style={{
                        backgroundColor: "#2563EB",
                        color: "white",
                        padding: "6px 16px",
                        fontSize: "14px",
                        borderRadius: "4px",
                        border: "none",
                        minWidth: "auto",
                        width: "auto",
                    }}
                >
                    Submit Ticket
                </button>
            </div>
        </form>
    );
}
