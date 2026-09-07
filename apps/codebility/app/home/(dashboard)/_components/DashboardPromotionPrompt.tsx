"use client";

import { useEffect, useState } from "react";
import PromoteToCodevModal from "@/components/modals/PromoteToCodevModal";
import PromoteToMentorModal from "@/components/modals/PromoteToMentorModal";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/codev-store";
import { Award, Star } from "lucide-react";

export type PromotionRole = "Codev" | "Mentor";

/**
 * The server decides whether a promotion is available; this island only owns the
 * modal state and the accept/decline interaction.
 */
export default function DashboardPromotionPrompt({
  userId,
  role,
  promoteDeclined,
}: {
  userId: string;
  role: PromotionRole;
  promoteDeclined: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(!promoteDeclined);
  const [accepted, setAccepted] = useState(false);
  const setUserLevel = useUserStore((state) => state.setUserLevel);

  // /home/certificate-preview reads the level back out of the store.
  useEffect(() => {
    if (role === "Mentor") setUserLevel(2);
  }, [role, setUserLevel]);

  if (accepted) return null;

  const handlePromotionAccepted = () => {
    setAccepted(true);
    setIsModalOpen(false);
  };

  const isCodev = role === "Codev";

  return (
    <div className="relative">
      <div
        className={
          isCodev
            ? "to-customBlue-500 absolute inset-0 rounded-lg bg-gradient-to-r from-green-400 opacity-75 blur-sm"
            : "absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400 to-pink-500 opacity-75 blur-sm"
        }
      />
      <Button
        className={
          isCodev
            ? "to-customBlue-500 hover:to-customBlue-600 relative mb-4 mt-4 w-auto transform animate-pulse bg-gradient-to-r from-green-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-green-600"
            : "relative mb-4 mt-4 w-auto transform animate-pulse bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-purple-600 hover:to-pink-600"
        }
        onClick={() => setIsModalOpen(true)}
      >
        {isCodev ? (
          <>
            <Award className="mr-2 h-5 w-5" />
            Become a Codev!
          </>
        ) : (
          <>
            <Star className="mr-2 h-5 w-5" />
            Become a Mentor!
          </>
        )}
      </Button>

      {isCodev ? (
        <PromoteToCodevModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={userId}
          onPromotionAccepted={handlePromotionAccepted}
        />
      ) : (
        <PromoteToMentorModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={userId}
          onPromotionAccepted={handlePromotionAccepted}
        />
      )}
    </div>
  );
}
