import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@codevs/ui/card";

import { TeamMemberCard } from "./org-chart-team-member-card";

const teamMembers = [
  {
    name: "Jzeff Kendrew Somera",
    title: "Chief Executive Officer (CEO)",
    image: "/placeholder.svg?height=100&width=100",
    team: "Executive",
  },
  {
    name: "Juliana Silva",
    title: "Hr Manager",
    image: "/placeholder.svg?height=80&width=80",
    team: "Human Resource",
  },
  {
    name: "Lorna Alvarado",
    title: "Human Resources",
    image: "/placeholder.svg?height=80&width=80",
    team: "Human Resource",
  },
  {
    name: "Kim Chun Hei",
    title: "Marketing Manager",
    image: "/placeholder.svg?height=80&width=80",
    team: "Human Resource",
  },
  {
    name: "Phyllis Schwaiger",
    title: "Marketing",
    image: "/placeholder.svg?height=80&width=80",
    team: "Marketing",
  },
  {
    name: "Morgan Maxwell",
    title: "Engineering Manager",
    image: "/placeholder.svg?height=80&width=80",
    team: "Technology",
  },
  {
    name: "Daniel Gallego",
    title: "Engineer",
    image: "/placeholder.svg?height=80&width=80",
    team: "Technology",
  },
];

export default function OrgChart() {
  return (
    <div className=" p-4">
      <Card className="mx-auto w-full p-8 shadow-xl">
        <CardHeader className="mb-8 text-center">
          <CardTitle className="text-3xl font-bold">CODEBILITY</CardTitle>
          <p className="text-xl text-muted-foreground">Organizational Chart</p>
        </CardHeader>
        <div className="flex flex-col items-center">
          <TeamMemberCard {...teamMembers[0]} />
          <div className="my-4 h-8 w-px bg-border"></div>
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
            {["Human Resource", "Marketing", "Technology"].map((team) => (
              <div key={team} className="flex flex-col items-center">
                <Card className="mb-4 w-full bg-secondary">
                  <CardContent className="p-2 text-center font-semibold">
                    {team.toUpperCase()} TEAM
                  </CardContent>
                </Card>
                <div className="mb-4 h-8 w-px bg-border"></div>
                <div className="flex flex-col gap-4">
                  {teamMembers
                    .filter((member) => member.team === team)
                    .map((member) => (
                      <TeamMemberCard key={member.name} {...member} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
