"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/codev-store";

import CreatePost from "./_components/CreatePost";
import Feed from "./_components/Feed";
import { getUserRole } from "./action";

export default function FeedsPage() {
  const [isMentor, setIsMentor] = useState(false);
  const { user } = useUserStore(); // Access user and hydrate function

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) return;
      const role = await getUserRole(user.role_id ?? null);
      setIsMentor(role === "Intern");
    };

    if (user) {
      fetchRole();
    }
  }, [user]);
  return (
    <>
      <div className="text-black-800 dark:text-white">
        <h1 className="text-3xl font-bold">Feeds</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with the latest announcements and discussions from the
          Codebility community.
        </p>
      </div>
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {isMentor && <div className="mb-6">Hello</div>}

        <Feed />
      </div>
    </>
  );
}
