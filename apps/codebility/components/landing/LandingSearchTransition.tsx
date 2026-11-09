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

import { LandingSearchSkeleton } from "@/components/landing/LandingSearchSkeleton";

interface LandingSearchTransitionValue {
  isPending: boolean;
  navigate: (href: string, options?: { replace?: boolean }) => void;
}

const LandingSearchTransitionContext =
  createContext<LandingSearchTransitionValue | null>(null);

interface LandingSearchTransitionProps {
  children: ReactNode;
}

function LandingSearchTransition({
  children,
}: LandingSearchTransitionProps) {
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
    <LandingSearchTransitionContext.Provider value={value}>
      {children}
    </LandingSearchTransitionContext.Provider>
  );
}

function useLandingSearchTransition(): LandingSearchTransitionValue {
  const value = useContext(LandingSearchTransitionContext);

  if (!value) {
    throw new Error(
      "useLandingSearchTransition must be used within LandingSearchTransition",
    );
  }

  return value;
}

function LandingDeveloperResults({ children }: { children: ReactNode }) {
  const { isPending } = useLandingSearchTransition();

  return isPending ? <LandingSearchSkeleton /> : <>{children}</>;
}

export {
  LandingDeveloperResults,
  LandingSearchTransition,
  useLandingSearchTransition,
};
