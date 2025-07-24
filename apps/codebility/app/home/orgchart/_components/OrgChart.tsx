"use client";

import { Box } from "@/components/shared/dashboard";

import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@codevs/ui/tabs";

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
    "UI/UX Designer",
  ];

  const sortedData = [...data].sort(
    (a, b) =>
      roleOrder.indexOf(a.display_position) -
      roleOrder.indexOf(b.display_position),
  );
  

  const ceo = sortedData.find(
    (member) => member.display_position === "CEO / Founder",
  );
  const admin = sortedData.filter(
    (member) => member.display_position === "Admin",
  );
  const marketing = sortedData.filter(
    (member) => member.display_position === "Marketing",
  );
  const pm = sortedData.filter(
    (member) => member.display_position === "Project Manager",
  );
  const developers = {
    "Full Stack Developers": sortedData
      .filter((member) => member.display_position === "Full Stack Developer")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) || // Prioritize those with images
          a.first_name.localeCompare(b.first_name), // Sort by first name
      ),
    "Frontend Developers": sortedData
      .filter((member) => member.display_position === "Frontend Developer")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) ||
          a.first_name.localeCompare(b.first_name),
      ),
    "Backend Developers": sortedData
      .filter((member) => member.display_position === "Backend Developer")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) ||
          a.first_name.localeCompare(b.first_name),
      ),
    "UI/UX Designers": sortedData
      .filter((member) => member.display_position === "UI/UX Designer")
      .sort(
        (a, b) =>
          (b.image_url ? 1 : 0) - (a.image_url ? 1 : 0) ||
          a.first_name.localeCompare(b.first_name),
      ),
  };
  return (
    <Box className="mx-auto w-full rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
      <CardHeader className="mb-8 text-center">
        <CardTitle className="text-3xl font-bold">CODEBILITY</CardTitle>
        <p className="text-xl text-muted-foreground">Organizational Chart</p>
      </CardHeader>

      {/* CEO Section */}
      <div className="mb-8 flex flex-col items-center">
        {ceo && <TeamMemberCard {...ceo} />}
        <div className="my-4 h-8 w-1 bg-border"></div>
      </div>

      {/* Admin, Marketing, PM  */}
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {[
          { title: "Admin", members: admin },
          { title: "Marketing", members: marketing },
          { title: "Project Managers", members: pm },
        ].map(({ title, members }) => (
          <div key={title} className="flex flex-col items-center">
            <Card className="dark:tab-gradient mb-4 w-full">
              <CardContent className="p-2 text-center font-semibold ">
                {title.toUpperCase()}
              </CardContent>
            </Card>
            <div className="mb-4 h-8 w-1 bg-border"></div>
            <div className="flex flex-col gap-4 ">
              {members.map((member) => (
                <TeamMemberCard key={member.id} {...member} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Developers */}
      <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(developers).map(([title, members]) => (
          <div key={title} className="mt-10 flex flex-col items-center">
            <Card className="dark:tab-gradient mb-4 w-full">
              <CardContent className="p-2 text-center font-semibold">
                {title.toUpperCase()}
              </CardContent>
            </Card>
            <div className="mb-4 h-8 w-1 bg-border"></div>
            <div className="flex flex-col gap-4">
              {members.map((member) => (
                member.application_status === "passed" &&
                <TeamMemberCard key={member.id} {...member} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Box>
  );
}
