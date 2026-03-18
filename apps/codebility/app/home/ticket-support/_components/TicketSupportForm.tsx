"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    userId: string | null;
    userEmail: string | null;
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

const PRIORITY_LEVELS = ["low", "medium", "high", "urgent"];

const TICKET_DETAILS_MAX_CHARS = 1000;

export default function TicketSupportForm({
    projects,
    userId,
    userEmail,
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const { submitTicket } = await import("../actions");
            const result = await submitTicket({
                userId: userId,
                fullName,
                email: userEmail,
                rolePosition,
                projectId: selectedProject === "none" ? null : selectedProject || null,
                assignedTeam,
                ticketType,
                otherType,
                subject: ticketTitle,
                message: ticketDetails,
                priority: priority || "medium",
            });

            if (result.success) {
                setSubmitResult({ type: "success", message: "Ticket submitted successfully!" });
                // Reset form
                setFullName("");
                setRolePosition("");
                setSelectedProject("");
                setAssignedTeam("");
                setTicketType("");
                setOtherType("");
                setPriority("");
                setTicketTitle("");
                setTicketDetails("");
            } else {
                setSubmitResult({ type: "error", message: result.error || "Failed to submit ticket." });
            }
        } catch (err) {
            setSubmitResult({ type: "error", message: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto w-full space-y-10">
            {/* Inquiree Info Section */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-customBlue-600 dark:text-customBlue-400">
                        Inquiree Info
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-customBlue-100 to-transparent dark:from-customBlue-900/50" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Full Name */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="h-11 bg-white dark:bg-[#1a1f3d] dark:text-white dark:border-customBlue-900/50 focus:border-customBlue-500 transition-all"
                            required
                        />
                    </div>

                    {/* Role Position */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Role Position <span className="text-red-500">*</span>
                        </Label>
                        <Select value={rolePosition} onValueChange={setRolePosition}>
                            <SelectTrigger className="h-11 bg-white dark:bg-[#1a1f3d] dark:text-gray-300 dark:border-customBlue-900/50 focus:border-customBlue-500 border border-gray-300 transition-all">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-[#1a1f3d] dark:border-customBlue-900">
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
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Project <span className="text-red-500">*</span>
                        </Label>
                        <Select value={selectedProject} onValueChange={handleProjectChange}>
                            <SelectTrigger className="h-11 bg-white dark:bg-[#1a1f3d] dark:text-gray-300 dark:border-customBlue-900/50 focus:border-customBlue-500 border border-gray-300 transition-all">
                                <SelectValue placeholder="Select your project" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-[#1a1f3d] dark:border-customBlue-900">
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
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Assigned Team
                        </Label>
                        <Input
                            type="text"
                            value={assignedTeam}
                            readOnly={selectedProject !== "none"}
                            onChange={(e) => setAssignedTeam(e.target.value)}
                            placeholder={selectedProject === "none" ? "Enter team or lead name" : "Auto-filled from project"}
                            className={`h-11 bg-white dark:bg-[#1a1f3d] dark:text-white dark:border-customBlue-900/50 transition-all ${selectedProject !== "none" ? "cursor-not-allowed opacity-70" : "focus:border-customBlue-500"
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* How can we help you? Section */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center gap-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-customBlue-600 dark:text-customBlue-400">
                        How can we help you?
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-customBlue-100 to-transparent dark:from-customBlue-900/50" />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Type */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Type <span className="text-red-500">*</span>
                        </Label>
                        <Select value={ticketType} onValueChange={setTicketType}>
                            <SelectTrigger className="h-11 bg-white dark:bg-[#1a1f3d] dark:text-gray-300 dark:border-customBlue-900/50 focus:border-customBlue-500 border border-gray-300 transition-all">
                                <SelectValue placeholder="Select ticket type" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-[#1a1f3d] dark:border-customBlue-900">
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
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Priority <span className="text-red-500">*</span>
                        </Label>
                        <Select value={priority} onValueChange={setPriority}>
                            <SelectTrigger className="h-11 bg-white dark:bg-[#1a1f3d] dark:text-gray-300 dark:border-customBlue-900/50 focus:border-customBlue-500 border border-gray-300 transition-all">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-[#1a1f3d] dark:border-customBlue-900">
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
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Please specify <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            type="text"
                            value={otherType}
                            onChange={(e) => setOtherType(e.target.value)}
                            placeholder="Describe your inquiry type"
                            className="h-11 bg-white dark:bg-[#1a1f3d] dark:text-white dark:border-customBlue-900/50 focus:border-customBlue-500 transition-all"
                            required
                        />
                    </div>
                )}

                {/* Ticket Title (Optional) */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Ticket Title <span className="ml-1 text-xs text-gray-400 font-normal">(Optional)</span>
                    </Label>
                    <Input
                        type="text"
                        value={ticketTitle}
                        onChange={(e) => setTicketTitle(e.target.value)}
                        placeholder="Brief summary of your issue"
                        className="h-11 bg-white dark:bg-[#1a1f3d] dark:text-white dark:border-customBlue-900/50 focus:border-customBlue-500 transition-all"
                    />
                </div>

                {/* Ticket Details */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
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
                        placeholder="Provide detailed information about your issue, steps to reproduce, or any specific errors you've encountered..."
                        rows={6}
                        maxLength={TICKET_DETAILS_MAX_CHARS}
                        required
                        className="bg-white dark:bg-[#1a1f3d] dark:text-white focus:border-customBlue-500 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-customBlue-100 dark:border-customBlue-900/50 dark:placeholder:text-gray-500 transition-all"
                    />
                </div>
            </div>

            {/* Submit Result Message */}
            {submitResult && (
                <div
                    className={`rounded-lg border p-3 text-sm ${
                        submitResult.type === "success"
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                >
                    {submitResult.message}
                </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`rounded-lg px-8 py-2.5 text-sm font-medium text-white transition-all focus:outline-none focus:ring-2 focus:ring-customBlue-500/50 ${
                        isSubmitting 
                        ? "bg-customBlue-800 cursor-not-allowed opacity-70" 
                        : "bg-customBlue-600 hover:bg-customBlue-500 active:scale-[0.98] shadow-lg shadow-customBlue-500/20"
                    }`}
                >
                    {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
            </div>
        </form>
    );
}
