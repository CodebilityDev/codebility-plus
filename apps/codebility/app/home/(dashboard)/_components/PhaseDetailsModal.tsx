"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

interface PhaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  phaseId: string | null;
}

export function PhaseDetailsModal({ isOpen, onClose, phaseId }: PhaseDetailsModalProps) {
  const getPhaseTitle = () => {
    switch (phaseId) {
      case "1":
        return "Phase 1: Intern";
      case "2":
        return "Phase 2: Codev";
      case "3":
        return "Phase 3: Mentor";
      default:
        return "Career Phase";
    }
  };

  const getPhaseContent = () => {
    switch (phaseId) {
      case "1":
        return (
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-pink-600 bg-clip-text text-transparent">
                INTERN (0-100 PTS)
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                At 100 pts, members can choose:
              </p>

              {/* Graduate Path */}
              <div className="rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-transparent p-6 dark:border-cyan-500/50">
                <h3 className="mb-3 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  GRADUATE PATH
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  Exit with certificate + recognition
                </p>
              </div>

              {/* Codev Path */}
              <div className="rounded-lg border-2 border-purple-400/50 bg-gradient-to-br from-purple-500/10 to-transparent p-6 dark:border-purple-500/50">
                <h3 className="mb-3 text-2xl font-bold text-purple-600 dark:text-purple-400">
                  CODEV PATH
                </h3>
                <p className="text-base text-gray-700 dark:text-gray-300">
                  Stay in the community, earn a Codev Badge, get portfolio projects, certificate,
                  and visible landing page profile
                </p>
              </div>
            </div>
          </div>
        );

      case "2":
        return (
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                CODEV (100 - 200 PTS)
              </h2>
            </div>

            {/* Rewards Section */}
            <div className="rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-transparent p-6 dark:border-cyan-500/50">
              <h3 className="mb-4 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                REWARDS
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    Codev Badge on profile
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    Certificate + growing portfolio
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    Hands-on client or open-source projects
                  </span>
                </li>
              </ul>
            </div>

            {/* Bottom Message */}
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
                At 200 pts → Eligible to become Mentor
              </p>
            </div>
          </div>
        );

      case "3":
        return (
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                MENTOR (200+ PTS)
              </h2>
            </div>

            {/* Rewards Section */}
            <div className="rounded-lg border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-500/10 to-transparent p-6 dark:border-cyan-500/50">
              <h3 className="mb-4 text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                REWARDS
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    Free Codev Shirt
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    NFC TapUp Card
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    More portfolio + leadership experience
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    5% commissions when Codevs are deployed
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500 text-white">
                    ✓
                  </span>
                  <span className="text-base text-gray-700 dark:text-gray-300">
                    5% equity share if a project sells successfully
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-white/20 bg-gradient-to-br from-slate-900 to-slate-800 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="sr-only">{getPhaseTitle()}</DialogTitle>
        </DialogHeader>
        {getPhaseContent()}
      </DialogContent>
    </Dialog>
  );
}
