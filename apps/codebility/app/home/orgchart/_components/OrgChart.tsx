"use client";

import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";

import { OrgChartProps } from "../_types/org-chart";
import { TeamMemberCard } from "./OrgChartTeamMemberCard";

export default function OrgChart({ data }: OrgChartProps) {
  const filteredData = data.filter((member) => member.team !== "EXECUTIVE");

  const teams = [...new Set(filteredData.map((member) => member.team))];

  const [expandedTeams, setExpandedTeams] = useState<string[]>([]);

  const toggleTeam = (team: string) => {
    setExpandedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team],
    );
  };

  const developmentTeam = filteredData.filter(
    (member) => member.team === "DEVELOPMENT",
  );

  return (
    <div className="p-4">
      <Card className="mx-auto w-full p-8 shadow-xl">
        <CardHeader className="mb-8 text-center">
          <CardTitle className="text-3xl font-bold">CODEBILITY</CardTitle>
          <p className="text-xl text-muted-foreground">Organizational Chart</p>
        </CardHeader>

        <div className="flex flex-col items-center">
          {/* Only display the first non-executive member */}
          {filteredData.length > 0 && (
            <TeamMemberCard profile_id={data[0]?.profile_id} />
          )}

          <div className="my-4 h-8 w-px bg-border"></div>

          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            {teams.map((team: any) => {
              if (team === "DEVELOPMENT") return null;

              return (
                <div key={team} className="flex flex-col items-center">
                  <Card
                    className={` mb-4 w-full cursor-pointer `}
                    onClick={() => toggleTeam(team)}
                  >
                    <CardContent className="p-2 text-center font-semibold">
                      {team.toUpperCase()} TEAM
                      <span className="ml-2">
                        {expandedTeams.includes(team) ? "▼" : "►"}
                      </span>
                    </CardContent>
                  </Card>

                  {expandedTeams.includes(team) && (
                    <>
                      <div className="mb-4 h-8 w-px bg-border"></div>
                      <div className="flex flex-col gap-4">
                        {filteredData
                          .filter((member) => member.team === team)
                          .map((member) => (
                            <TeamMemberCard key={member.id} {...member} />
                          ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex w-full flex-col items-center pt-4">
            <Card
              className={` mb-4 w-full cursor-pointer `}
              onClick={() => toggleTeam("Development")}
            >
              <CardContent className="p-2 text-center font-semibold">
                DEVELOPMENT TEAM
                <span className="ml-2">
                  {expandedTeams.includes("Development") ? "▼" : "►"}
                </span>
              </CardContent>
            </Card>

            {expandedTeams.includes("Development") && (
              <>
                <div className="mb-4 h-8 w-px bg-border"></div>
                <div className="grid gap-14 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  {developmentTeam.map((member) => (
                    <TeamMemberCard key={member.id} {...member} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
