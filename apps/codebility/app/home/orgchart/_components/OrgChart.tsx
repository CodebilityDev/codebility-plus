"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useNavStore } from "@/hooks/use-sidebar";
import { defaultAvatar } from "@/public/assets/images";
import { getValidImageUrl } from "@/utils/imageValidation";
import { cn } from "@/lib/utils";

import { OrgChartProps } from "../_types/org-chart";

// Role colors for system consistency
const ROLE_CONFIG: Record<string, { color: string; border: string; bg: string }> = {
  "CEO / Founder": { color: "from-amber-400 to-orange-600", border: "border-orange-500", bg: "bg-orange-50/50 dark:bg-orange-950/20" },
  "CEO/Founder": { color: "from-amber-400 to-orange-600", border: "border-orange-500", bg: "bg-orange-50/50 dark:bg-orange-950/20" },
  "Admin": { color: "from-blue-500 to-indigo-600", border: "border-blue-500", bg: "bg-blue-50/50 dark:bg-blue-950/20" },
  "Marketing": { color: "from-fuchsia-500 to-pink-600", border: "border-fuchsia-500", bg: "bg-fuchsia-50/50 dark:bg-fuchsia-950/20" },
  "Project Manager": { color: "from-emerald-500 to-teal-600", border: "border-emerald-500", bg: "bg-emerald-50/50 dark:bg-emerald-950/20" },
  "Full Stack Developer": { color: "from-sky-500 to-blue-600", border: "border-sky-500", bg: "bg-sky-50/50 dark:bg-sky-950/20" },
  "Frontend Developer": { color: "from-cyan-500 to-blue-500", border: "border-cyan-500", bg: "bg-cyan-50/50 dark:bg-cyan-950/20" },
  "Backend Developer": { color: "from-rose-500 to-red-600", border: "border-rose-500", bg: "bg-rose-50/50 dark:bg-rose-950/20" },
  "Mobile Developer": { color: "from-violet-500 to-purple-600", border: "border-violet-500", bg: "bg-violet-50/50 dark:bg-violet-950/20" },
  "UI/UX Designer": { color: "from-purple-500 to-indigo-500", border: "border-purple-500", bg: "bg-purple-50/50 dark:bg-purple-950/20" },
};

const FALLBACK_CONFIG = { color: "from-slate-400 to-slate-600", border: "border-slate-400", bg: "bg-slate-50/50 dark:bg-slate-900/10" };

export default function OrgChart({ data }: OrgChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const titleParam = searchParams.get("title");

  const [expandedRole, setInternalExpandedRole] = useState<{key: string, title: string} | null>(
    roleParam && titleParam ? { key: roleParam, title: titleParam } : null
  );

  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const { closeNav } = useNavStore();

  const setExpandedRole = (roleParams: {key: string, title: string} | null) => {
    setInternalExpandedRole(roleParams);
    
    // Update URL to preserve state when returning from a profile
    const params = new URLSearchParams(searchParams.toString());
    if (roleParams) {
      params.set("role", roleParams.key);
      params.set("title", roleParams.title);
    } else {
      params.delete("role");
      params.delete("title");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth >= 1024) closeNav();
  }, [closeNav]);

  const categorizedData = useMemo(() => {
    const roles: Record<string, any[]> = {};
    data.forEach((member) => {
      const position = member.display_position;
      if (!roles[position]) roles[position] = [];
      roles[position].push(member);
    });
    return roles;
  }, [data]);

  const founder = categorizedData["CEO / Founder"] || categorizedData["CEO/Founder"] || [];

  const coreDepartments = [
    { title: "Admin", key: "Admin" },
    { title: "Marketing", key: "Marketing" },
    { title: "Project Managers", key: "Project Manager" },
  ];

  const engineeringDepartments = [
    { title: "Full Stack Devs", key: "Full Stack Developer", alias: "Developer" },
    { title: "Frontend Devs", key: "Frontend Developer" },
    { title: "Backend Devs", key: "Backend Developer" },
    { title: "Mobile Devs", key: "Mobile Developer" },
    { title: "UI/UX Designers", key: "UI/UX Designer" },
  ];

  return (
    <div className={cn(
      "relative w-full pt-8 pb-32 flex flex-col items-center transition-all duration-500",
      !expandedRole ? "min-h-[calc(100vh-80px)] overflow-x-hidden scrollbar-hide" : "min-h-screen overflow-x-hidden"
    )}>
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-purple-500/5 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="w-full max-w-[1600px] px-8 2xl:px-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          {mounted ? (
            <Image
              src={(resolvedTheme === "dark" || theme === "dark") ? "/assets/svgs/logos/codebility-light.svg" : "/assets/svgs/logos/codebility-dark.svg"}
              width={220}
              height={50}
              className="h-12 w-auto self-start drop-shadow-sm"
              alt="Codebility"
              priority
            />
          ) : (
            <div className="h-12 w-[220px]" />
          )}
          <p className="max-w-2xl text-base text-gray-500 dark:text-gray-400 leading-relaxed">
            Explore our organizational structure and the talented individuals who make up our teams, from core management to our engineering and design departments.
          </p>
        </motion.div>
      </div>

      {/* Main Container */}
      <div className="relative w-full grid [grid-template-areas:'stack'] place-items-center items-start overflow-hidden">
        {/* Tree View - Always present to serve as backdrop when expanded */}
        <motion.div
          key="tree-view"
          initial={false}
          animate={{ 
            opacity: expandedRole ? 0.05 : 1, 
            scale: expandedRole ? 0.95 : 1,
            y: expandedRole ? 40 : 0,
            filter: expandedRole ? "blur(12px) grayscale(50%)" : "blur(0px) grayscale(0%)" 
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "[grid-area:stack] flex items-center justify-center w-full max-w-[1600px] px-4 sm:px-8 2xl:px-12 pb-20 origin-top z-10 transition-all",
            expandedRole ? "pointer-events-none" : "pointer-events-auto"
          )}
        >
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 w-full max-w-6xl mx-auto justify-center lg:justify-between">
              {/* LEVEL 1: CEO */}
              <div className="flex-shrink-0 flex flex-col items-center z-10 relative w-full lg:w-auto px-2 sm:px-4">
                {founder.map((member) => (
                  <MemberPill key={member.id} member={member} roleKey="CEO / Founder" size="lg" />
                ))}
              </div>

              {/* MOBILE VERTICAL CONNECTOR */}
              <VerticalConnector />

              {/* CONNECTOR CEO to PILLARS */}
              <HorizontalConnector flexGrow />

              {/* LEVEL 2: CORE DEPARTMENTS */}
              <div className="flex flex-col gap-4 lg:gap-12 w-full lg:w-auto items-center z-10 relative px-2 sm:px-4">
                {coreDepartments.map((dept, idx) => (
                  <div key={dept.key} className="flex flex-col w-full sm:w-auto">
                    <DepartmentGroup
                      title={dept.title}
                      roleKey={dept.key}
                      members={categorizedData[dept.key] || []}
                      onClick={() => setExpandedRole({ key: dept.key, title: dept.title })}
                      delay={idx * 0.15}
                    />
                  </div>
                ))}
                
                {/* Visual anchor point for the next connector behind Marketing (idx 1) */}
                <div className="absolute top-1/2 left-full -translate-y-1/2 -z-10" />
              </div>

              {/* MOBILE VERTICAL CONNECTOR */}
              <VerticalConnector />

              {/* BRANCHING LINE TO ENGINEERING */}
              <HorizontalConnector crossbar flexGrow count={engineeringDepartments.length} coreCount={coreDepartments.length} />

              {/* LEVEL 3: ENGINEERING */}
              <div className="flex flex-col gap-4 lg:gap-8 w-full lg:w-auto items-center z-10 relative px-2 sm:px-4">
                {engineeringDepartments.map((dept, idx) => {
                  const members = [...(categorizedData[dept.key] || []), ...(dept.alias ? categorizedData[dept.alias] || [] : [])];
                  return (
                    <DepartmentGroup
                      key={dept.key}
                      title={dept.title}
                      roleKey={dept.key}
                      members={members}
                      onClick={() => setExpandedRole({ key: dept.key, title: dept.title })}
                      delay={idx * 0.15 + 0.3}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {expandedRole && (
              <motion.div
                key="dismiss-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-[100vw] h-[100vh] z-[40] cursor-pointer bg-slate-900/20 dark:bg-black/50 backdrop-blur-[2px]"
                onClick={() => setExpandedRole(null)}
                title="Click anywhere to return"
              />
            )}
            {expandedRole && (
              <motion.div
                key="focus-view"
                initial={{ opacity: 0, y: 80, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 60, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="[grid-area:stack] relative z-[50] pb-20 w-full flex flex-col justify-start min-h-[60vh] max-w-[1600px] mx-auto px-4 sm:px-8 2xl:px-12 pointer-events-none"
              >
                <div className="mb-14 mt-4 flex justify-center w-full">
                 <div className="cursor-pointer inline-block transform transition hover:scale-105 pointer-events-auto" onClick={() => setExpandedRole(null)} title="Click to return">
                   <RolePill 
                     title={expandedRole.title} 
                     roleKey={expandedRole.key} 
                     count={(categorizedData[expandedRole.key] || []).length + (engineeringDepartments.find(d => d.key === expandedRole.key)?.alias ? (categorizedData[engineeringDepartments.find(d => d.key === expandedRole.key)?.alias as string] || []).length : 0)} 
                     isExpanded={true} 
                     onClick={() => setExpandedRole(null)}
                     large
                   />
                 </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-items-stretch"
              >
                {(() => {
                  const dept = [...coreDepartments, ...engineeringDepartments].find(d => d.key === expandedRole.key) as any;
                  const members = [...(categorizedData[expandedRole.key] || []), ...(dept?.alias ? categorizedData[dept.alias] || [] : [])];
                  
                  return members.map((member: any, index: number) => (
                    <MemberPill key={member.id} member={member} roleKey={expandedRole.key} index={index} />
                  ));
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const VerticalConnector = () => (
  <div className="flex lg:hidden h-10 w-[2px] bg-gradient-to-b from-blue-500/30 to-purple-500/30 dark:from-blue-500/50 dark:to-purple-500/50 relative my-2 z-0">
    <div className="absolute top-0 -left-[5px] h-3 w-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
    <div className="absolute bottom-0 -left-[5px] h-3 w-3 rounded-full bg-purple-500 ring-4 ring-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
  </div>
);

const HorizontalConnector = ({ className, crossbar, flexGrow, count, coreCount }: { className?: string; crossbar?: boolean; flexGrow?: boolean; count?: number; coreCount?: number }) => (
  <div className={cn("hidden lg:flex relative h-full items-center justify-center pointer-events-none z-0", flexGrow ? "flex-grow min-w-[30px] xl:min-w-[60px]" : "w-16 xl:w-24", className)}>
    <div className="w-full h-[2px] bg-gradient-to-r from-blue-500/30 to-purple-500/30 dark:from-blue-500/50 dark:to-purple-500/50" />
    
    {/* Left joint dot */}
    <div className="absolute left-0 h-3 w-3 -ml-1.5 rounded-full bg-blue-500 ring-4 ring-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />

    {crossbar && count && count > 1 && (
      <>
        {/* Connection to previous tier (left vertical line) */}
        {coreCount && coreCount > 1 && (
           <div 
             className="absolute left-0 w-[2px] bg-gradient-to-b from-blue-500/30 to-blue-500/30 dark:from-blue-500/50 dark:to-blue-500/50" 
             style={{ height: `${(coreCount - 1) * 112}px` }} 
           />
        )}
        
        {/* Distribution to next tier (right vertical line) */}
        <div 
          className="absolute right-0 w-[2px] bg-gradient-to-b from-purple-500/30 to-purple-500/30 dark:from-purple-500/50 dark:to-purple-500/50" 
          style={{ height: `${(count - 1) * 96}px` }} 
        />
        
        {/* Right joint dot */}
        <div className="absolute right-0 h-3 w-3 -mr-1.5 rounded-full bg-purple-500 ring-4 ring-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
      </>
    )}
    
    {/* Middle tier distribution line (handles CEO -> Core Depts) */}
    {!crossbar && (
       <>
         <div 
           className="absolute right-0 w-[2px] bg-gradient-to-b from-blue-500/30 to-blue-500/30 dark:from-blue-500/50 dark:to-blue-500/50" 
           style={{ height: `${2 * 112}px` }} 
         />
         <div className="absolute right-0 h-3 w-3 -mr-1.5 rounded-full bg-purple-500 ring-4 ring-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
       </>
    )}
  </div>
);

const RolePill = ({ title, roleKey, count, isExpanded, onClick, large }: any) => {
  const config = ROLE_CONFIG[roleKey] || FALLBACK_CONFIG;
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-between gap-4 sm:gap-6 rounded-2xl border-2 px-4 sm:px-8 transition-all overflow-hidden shadow-lg w-full",
        large ? "h-16 sm:h-20 max-w-[400px]" : "h-14 sm:h-16 max-w-[320px] sm:min-w-[300px]",
        config.border,
        isExpanded ? cn("bg-white dark:bg-gray-900 shadow-xl z-10", "shadow-" + config.color.split("-")[1] + "-500/20") : "bg-white/70 dark:bg-gray-900/60 backdrop-blur-md hover:shadow-xl hover:bg-white dark:hover:bg-gray-800"
      )}
    >
      <div className="flex items-center gap-3 sm:gap-4 truncate mr-2">
         <div className={cn("rounded-full flex-shrink-0 bg-gradient-to-r shadow-inner", large ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-2.5 w-2.5 sm:h-3 sm:w-3", config.color)} />
         <span className={cn("text-left font-black tracking-widest text-gray-800 dark:text-gray-100 uppercase truncate", large ? "text-[12px] sm:text-[14px]" : "text-[10px] sm:text-[11px]")}>{title}</span>
      </div>
      <div className={cn("flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 font-bold", large ? "h-8 w-8 sm:h-10 sm:w-10 text-[12px] sm:text-[14px]" : "h-6 w-6 sm:h-7 sm:w-7 text-[10px] sm:text-[11px]", isExpanded ? "text-" + config.color.split("-")[1] + "-500" : "text-gray-500 dark:text-gray-400")}>
        {count}
      </div>
    </motion.button>
  );
};

const MemberPill = ({ member, roleKey, size = "md", index = 0 }: any) => {
  const config = ROLE_CONFIG[roleKey] || FALLBACK_CONFIG;
  const validImageUrl = getValidImageUrl(member.image_url);
  const isLg = size === "lg";

  return (
    <Link href={`/profiles/${member.id}`} passHref className="w-full flex justify-center pointer-events-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: index * 0.04 
        }}
        whileHover={{ scale: 1.03, y: -4 }}
        className={cn(
          "group flex items-center gap-4 sm:gap-5 rounded-2xl border bg-white shadow-xl backdrop-blur-xl dark:bg-gray-900/90 transition-all hover:shadow-2xl hover:border-transparent cursor-pointer w-full",
          isLg ? "p-3 sm:p-4 pr-4 sm:pr-8 max-w-[340px]" : "p-3 sm:p-4 pr-4 sm:pr-6 max-w-[320px] sm:max-w-none sm:min-w-[300px]",
          isLg ? "border-" + config.color.split("-")[1] + "-500/50" : "border-gray-200/50 dark:border-gray-800",
          "relative overflow-hidden"
        )}
      >
        {/* Subtle background glow on hover */}
        <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r", config.color)} />

        <div className={cn("relative flex-shrink-0 overflow-hidden rounded-xl border-2 border-white dark:border-gray-800 shadow-md", isLg ? "h-14 w-14 sm:h-16 sm:w-16" : "h-10 w-10 sm:h-12 sm:w-12")}>
          <Image src={validImageUrl || defaultAvatar} alt={member.first_name} fill className="object-cover" />
        </div>
        <div className="flex flex-col overflow-hidden z-10 w-full">
          <span className={cn("truncate font-bold text-gray-900 dark:text-white capitalize", isLg ? "text-[14px] sm:text-[15px]" : "text-[12px] sm:text-[13px]")}>
            {member.first_name} {member.last_name}
          </span>
          <span className={cn("font-black uppercase tracking-widest bg-gradient-to-r bg-clip-text text-transparent mt-1.5 sm:mt-1 opacity-90 truncate", isLg ? "text-[9px] sm:text-[10px]" : "text-[8px] sm:text-[9px]", config.color)}>
            {member.display_position}
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

const DepartmentGroup = ({ title, roleKey, members, onClick, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
    viewport={{ once: true, margin: "-50px" }}
    className="flex flex-row items-center justify-center gap-4 group w-full"
  >
    <RolePill
      title={title}
      roleKey={roleKey}
      count={members.length}
      onClick={onClick}
    />
  </motion.div>
);
