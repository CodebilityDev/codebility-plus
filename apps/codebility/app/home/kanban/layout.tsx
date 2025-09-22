import React, { Children } from "react";

export default function KanbanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="from-customBlue-400/10 absolute -left-4 -top-4 h-72 w-72 rounded-full bg-gradient-to-br to-purple-400/10 blur-3xl" />
        <div className="to-customBlue-400/10 absolute -right-4 top-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-green-400/10 blur-3xl" />
        <div className="absolute -bottom-4 left-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
