import React from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen ">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 blur-3xl" />
        <div className="absolute -right-4 top-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-green-400/10 to-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-4 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-gradient-to-br from-yellow-400/5 to-orange-400/5 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
