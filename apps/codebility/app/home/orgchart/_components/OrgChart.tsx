"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";

import { OrgChartProps } from "../_types/org-chart";
import { TeamMemberCard } from "./OrgChartTeamMemberCard";

export default function OrgChart({ data }: OrgChartProps) {
  const roleOrder = [
    "CEO / Founder",
    "Admin", 
    "Marketing",
    "Project Manager",
    "Full Stack Developer",
    "Frontend Developer", 
    "Backend Developer",
    "Mobile Developer",
    "Developer",
    "UI/UX Designer",
  ];

  const sortedData = [...data].sort(
    (a, b) =>
      roleOrder.indexOf(a.display_position) -
      roleOrder.indexOf(b.display_position),
  );
  

  const ceo = sortedData.find(
    (member) => member.display_position === "CEO / Founder" && member.application_status === "passed",
  );
  const admin = sortedData.filter(
    (member) => member.display_position === "Admin" && member.application_status === "passed",
  );
  const marketing = sortedData.filter(
    (member) => member.display_position === "Marketing" && member.application_status === "passed",
  );
  const pm = sortedData.filter(
    (member) => member.display_position === "Project Manager" && member.application_status === "passed",
  );
  const developers = {
    "Full Stack Developers": sortedData
      .filter((member) => 
        (member.display_position === "Full Stack Developer" || 
        member.display_position === "Developer") &&
        member.application_status === "passed"
      )
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) || // Prioritize those with images
          a.first_name.localeCompare(b.first_name), // Sort by first name
      ),
    "Frontend Developers": sortedData
      .filter((member) => member.display_position === "Frontend Developer" && member.application_status === "passed")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) ||
          a.first_name.localeCompare(b.first_name),
      ),
    "Backend Developers": sortedData
      .filter((member) => member.display_position === "Backend Developer" && member.application_status === "passed")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) ||
          a.first_name.localeCompare(b.first_name),
      ),
    "Mobile Developers": sortedData
      .filter((member) => member.display_position === "Mobile Developer" && member.application_status === "passed")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) ||
          a.first_name.localeCompare(b.first_name),
      ),
    "UI/UX Designers": sortedData
      .filter((member) => member.display_position === "UI/UX Designer" && member.application_status === "passed")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) ||
          a.first_name.localeCompare(b.first_name),
      ),
  };
  return (
    <div className="mx-auto w-full">
      <CardHeader className="mb-8 text-center">
        <CardTitle className="bg-gradient-to-r from-customBlue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
          CODEBILITY
        </CardTitle>
        <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">Organizational Chart</p>
      </CardHeader>

      {/* CEO Section */}
      <div className="mb-8 flex flex-col items-center">
        {ceo && (
          <div className="relative">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 opacity-20 blur-lg" />
            <TeamMemberCard {...ceo} />
          </div>
        )}
        <div className="relative my-4">
          <div className="h-8 w-1 bg-gradient-to-b from-gray-400 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
          <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
        </div>
      </div>

      {/* Admin, Marketing, PM  */}
      <div className="relative mb-8">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        <div className="grid w-full grid-cols-1 gap-6 pt-6 md:grid-cols-3">
          {[
            { title: "Admin", members: admin, color: "from-customBlue-500 to-cyan-500" },
            { title: "Marketing", members: marketing, color: "from-purple-500 to-pink-500" },
            { title: "Project Managers", members: pm, color: "from-green-500 to-emerald-500" },
          ].map(({ title, members, color }) => (
            <div key={title} className="flex flex-col items-center">
              <Card className="mb-4 w-full max-w-sm overflow-hidden border-0 shadow-lg">
                <CardContent className={`bg-gradient-to-r ${color} p-2 text-center`}>
                  <p className="text-sm font-bold text-white">{title.toUpperCase()}</p>
                </CardContent>
              </Card>
              <div className="relative mb-4">
                <div className="h-6 w-1 bg-gradient-to-b from-gray-400 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
                <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {members.map((member) => (
                  <TeamMemberCard key={member.id} {...member} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developers */}
      <div className="relative">
        <div className="absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600" />
        <div className="grid w-full grid-cols-1 gap-8 pt-6 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(developers)
            .filter(([title, members]) => members.length > 0)
            .map(([title, members], index) => {
            const colors = [
              "from-indigo-500 to-customBlue-500",
              "from-customTeal-500 to-green-500", 
              "from-orange-500 to-red-500",
              "from-purple-500 to-pink-500",
              "from-customViolet-500 to-purple-500"
            ];
            return (
              <div key={title} className="flex flex-col items-center">
                <Card className="mb-4 w-full max-w-md overflow-hidden border-0 shadow-lg">
                  <CardContent className={`bg-gradient-to-r ${colors[index]} p-2 text-center`}>
                    <p className="text-sm font-bold text-white">{title.toUpperCase()}</p>
                  </CardContent>
                </Card>
                <div className="relative mb-4">
                  <div className="h-6 w-1 bg-gradient-to-b from-gray-400 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
                  <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-gray-600" />
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {members.map((member) => (
                    <TeamMemberCard key={member.id} {...member} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
