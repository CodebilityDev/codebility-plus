"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useTransition,
} from "react";
import type { ReactNode } from "react";

import { LandingPeopleGridSkeleton } from "@/components/landing/LandingPeopleGridSkeleton";

interface LandingPeopleTransitionValue {
  isPending: boolean;
  navigate: (href: string, options?: { replace?: boolean }) => void;
}

const LandingPeopleTransitionContext =
  createContext<LandingPeopleTransitionValue | null>(null);

interface LandingPeopleTransitionProps {
  children: ReactNode;
}

function LandingPeopleTransition({ children }: LandingPeopleTransitionProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (href: string, options?: { replace?: boolean }) => {
      startTransition(() => {
        if (options?.replace ?? true) {
          router.replace(href, { scroll: false });
        } else {
          router.push(href, { scroll: false });
        }
      });
    },
    [router],
  );

  const value = useMemo(
    () => ({ isPending, navigate }),
    [isPending, navigate],
  );

  return (
    <LandingPeopleTransitionContext.Provider value={value}>
      {children}
    </LandingPeopleTransitionContext.Provider>
  );
}

function LandingPeopleCards({ children }: { children: ReactNode }) {
  const { isPending } = useLandingPeopleTransition();

  return isPending ? <LandingPeopleGridSkeleton /> : <>{children}</>;
}

function useLandingPeopleTransition(): LandingPeopleTransitionValue {
  const value = useContext(LandingPeopleTransitionContext);

  if (!value) {
    throw new Error(
      "useLandingPeopleTransition must be used within LandingPeopleTransition",
    );
  }

  return value;
}

export {
  LandingPeopleCards,
  LandingPeopleTransition,
  useLandingPeopleTransition,
};
