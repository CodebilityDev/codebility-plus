// apps/codebility/app/home/myteam/page.tsx
import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MyTeam = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">My Team</h1>
      <p className="mb-4">
        Welcome to the My Team page! Here you can manage your team members.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-xl font-semibold">Team Member 1</h2>
          <p>Role: Developer</p>
        </div>
        <div className="rounded-lg bg-gray-800 p-4">
          <h2 className="text-xl font-semibold">Team Member 2</h2>
          <p>Role: Designer</p>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
