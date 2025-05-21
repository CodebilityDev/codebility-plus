// apps/codebility/app/home/myteam/page.tsx
import React from 'react';

const MyTeam = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">My Team</h1>
      <p className="mb-4">Welcome to the My Team page! Here you can manage your team members.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Team Member 1</h2>
          <p>Role: Developer</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold">Team Member 2</h2>
          <p>Role: Designer</p>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;