"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ClockIcon } from "lucide-react";
import { cn } from "@codevs/ui";
import {
	IconAbout,
	IconGithub,
	IconLink,
	IconSkills,
} from "@/public/assets/svgs";
import { Codev } from "@/types/home/codev";

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { 
		opacity: 1, 
		y: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut"
		}
	}
};

const fadeInScale = {
	hidden: { opacity: 0, scale: 0.9 },
	visible: { 
		opacity: 1, 
		scale: 1,
		transition: {
			duration: 0.5,
			ease: "easeOut"
		}
	}
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2
		}
	}
};

interface ProfileContentProps {
	codev: Codev;
	availableSchedule: any;
	getRandomBgColor: () => string;
	getStatusBadge: () => string;
	sanitizeUrl: (url: string | undefined) => string;
	formatTime: (time: string) => string;
	allDays: string[];
}

export default function ProfileContent({
	codev,
	availableSchedule,
	getRandomBgColor,
	getStatusBadge,
	sanitizeUrl,
	formatTime,
	allDays
}: ProfileContentProps) {
	const {
		first_name,
		last_name,
		image_url,
		display_position,
		portfolio_website,
		about,
		github,
		tech_stacks,
		education,
		work_experience,
		availability_status,
	} = codev;

	return (
		<div className="mt-6 flex flex-col gap-6 md:gap-12 lg:mt-16 lg:flex-row">
			{/* Left Section */}
			<motion.div 
				initial="hidden"
				animate="visible"
				variants={fadeInScale}
				className="bg-black-500 flex h-auto w-full basis-[30%] flex-col items-center justify-start gap-4 rounded-lg p-6 text-white shadow-lg lg:p-8"
			>
				<motion.div 
					className="relative"
					whileHover={{ scale: 1.05 }}
					transition={{ type: "spring", stiffness: 300 }}
				>
					<Image
						alt={`${first_name} Avatar`}
						src={image_url || "/assets/svgs/icon-codebility-black.svg"}
						width={200}
						height={200}
						className={`${getRandomBgColor()} h-[150px] w-[150px] rounded-full bg-cover object-cover`}
					/>
					<motion.div 
						className="absolute bottom-[7px] right-[7px]"
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
					>
						<p
							className={`border-black-100 rounded-full px-2 text-[9px] ${availability_status ? "bg-green-500" : "bg-gray"
								}`}
						>
							{getStatusBadge()}
						</p>
					</motion.div>
				</motion.div>
				<motion.p 
					className="text-md text-center capitalize lg:text-2xl"
					variants={fadeInUp}
				>
					{first_name || "Unknown"} {last_name || "Unknown"}
				</motion.p>
				{display_position && (
					<motion.div 
						className="bg-darkgray rounded-lg px-4 py-2"
						variants={fadeInUp}
					>
						<p className="text-center text-sm capitalize lg:text-lg">
							{display_position}
						</p>
					</motion.div>
				)}
				<motion.div 
					className="flex gap-4"
					variants={fadeInUp}
				>
					{github && (
						<motion.div
							whileHover={{ scale: 1.1, rotate: 5 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link
								href={sanitizeUrl(github)}
								target="_blank"
								className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300 block"
							>
								<IconGithub className="text-2xl" />
							</Link>
						</motion.div>
					)}
					{portfolio_website && (
						<motion.div
							whileHover={{ scale: 1.1, rotate: -5 }}
							whileTap={{ scale: 0.95 }}
						>
							<Link
								href={sanitizeUrl(portfolio_website)}
								target="_blank"
								className="bg-darkgray hover:bg-black-100 rounded-lg p-2 transition duration-300 block"
							>
								<IconLink className="text-2xl" />
							</Link>
						</motion.div>
					)}
				</motion.div>
				{tech_stacks && tech_stacks.length > 0 && (
					<motion.div 
						className="mt-4"
						variants={fadeInUp}
					>
						<div className="mb-4 flex items-center gap-2">
							<IconSkills className="text-2xl" />
							<h3 className="text-md font-semibold lg:text-2xl">Skills</h3>
						</div>
						<motion.div 
							className="mt-2 flex flex-wrap gap-4"
							variants={staggerContainer}
							initial="hidden"
							animate="visible"
						>
							{tech_stacks.map((stack, index) => (
								<motion.div
									key={stack}
									variants={{
										hidden: { opacity: 0, scale: 0 },
										visible: { 
											opacity: 1, 
											scale: 1,
											transition: {
												type: "spring",
												stiffness: 500,
												delay: index * 0.1
											}
										}
									}}
									whileHover={{ scale: 1.2, rotate: 360 }}
									transition={{ duration: 0.3 }}
								>
									<Image
										src={`/assets/svgs/icon-${stack.toLowerCase()}.svg`}
										alt={stack}
										width={25}
										height={25}
										className="h-6 w-6"
									/>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				)}

				{/* Work Schedule Section */}
				{availableSchedule && (
					<motion.div 
						className="mt-6 w-full"
						variants={fadeInUp}
					>
						<h3 className="text-md font-semibold lg:text-lg mb-4">Work Schedule</h3>

						<motion.div 
							className="bg-black-100 rounded-lg p-4 flex flex-col gap-4"
							whileHover={{ boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
						>
							{/* Time Display */}
							{availableSchedule.start_time && availableSchedule.end_time && (
								<div className="text-center">
									<div className="flex items-center justify-center gap-2">
										<ClockIcon className="w-4 h-4" />
										<span className="font-mono text-base">
											{formatTime(availableSchedule.start_time)} - {formatTime(availableSchedule.end_time)}
										</span>
										<span className="text-sm">
											PST
										</span>
									</div>
								</div>
							)}

							{/* Week Days Grid */}
							<div className="flex items-center justify-center gap-3">
								{allDays.map((day, index) => {
									const isAvailable = availableSchedule.days_of_week.includes(day)

									return (
										<motion.div
											key={day}
											initial={{ opacity: 0, scale: 0 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: index * 0.05, type: "spring", stiffness: 500 }}
											whileHover={{ scale: 1.2 }}
											className={cn(
												"w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all cursor-pointer",
												isAvailable
													? "bg-purple-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-400"
													: "border rounded-full text-gray-400 hover:bg-gray-600",
											)}
											title={day}
										>
											{day.charAt(0)}
										</motion.div>
									)
								})}
							</div>
						</motion.div>
					</motion.div>
				)}
			</motion.div>

			{/* Right Section */}
			<motion.div 
				className="bg-black-500 flex basis-[70%] flex-col gap-6 rounded-lg p-6 text-white shadow-lg lg:gap-14 lg:p-8"
				initial="hidden"
				animate="visible"
				variants={staggerContainer}
			>
				{about && (
					<motion.div variants={fadeInUp}>
						<div className="mb-4 flex items-center gap-2">
							<IconAbout className="text-2xl" />
							<h3 className="text-md font-semibold lg:text-2xl">About</h3>
						</div>
						<p className="text-md text-gray lg:text-lg">{about}</p>
					</motion.div>
				)}

				{education && education.length > 0 && (
					<motion.div variants={fadeInUp}>
						<h3 className="text-md font-semibold lg:text-2xl mb-4">Education</h3>
						<motion.div variants={staggerContainer} initial="hidden" animate="visible">
							{education.map((edu, index) => (
								<motion.div 
									key={edu.id} 
									className="bg-black-100 rounded-lg p-6 mb-4"
									variants={fadeInUp}
									whileHover={{ x: 10, boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)" }}
								>
									<p className="text-lg text-white">{edu.institution}</p>
									{edu.degree && (
										<p className="text-gray">
											{edu.degree} ({edu.start_date || "N/A"} -{" "}
											{edu.end_date || "Present"})
										</p>
									)}
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				)}
				{work_experience && work_experience.length > 0 && (
					<motion.div variants={fadeInUp}>
						<h3 className="text-md mb-4 font-semibold lg:text-2xl">
							Experience
						</h3>
						<motion.div 
							className="flex flex-col gap-2"
							variants={staggerContainer}
							initial="hidden"
							animate="visible"
						>
							{work_experience.map((exp, index) => (
								<motion.div 
									key={exp.id} 
									className="bg-black-100 rounded-lg p-6"
									variants={fadeInUp}
									whileHover={{ x: 10, boxShadow: "0 0 20px rgba(139, 92, 246, 0.2)" }}
								>
									<p className="text-lg font-semibold text-white">
										{exp.position}
									</p>
									<p className="text-md text-gray font-semibold">
										<span className="text-customViolet-100 mr-2">
											{exp.company_name.toUpperCase()}
										</span>
										({exp.date_from} - {exp.date_to || "Present"})
									</p>
									<p className="text-md text-gray font-semibold">
										@{exp.location}
									</p>
									<p className="text-gray">{exp.description}</p>
								</motion.div>
							))}
						</motion.div>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
}