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

interface HireTalentTransitionValue {
  isPending: boolean;
  navigate: (href: string) => void;
}

const HireTalentTransitionContext =
  createContext<HireTalentTransitionValue | null>(null);

export function HireTalentTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const navigate = useCallback(
    (href: string) => {
      startTransition(() => {
        router.push(href, { scroll: false });
      });
    },
    [router],
  );
  const value = useMemo(
    () => ({ isPending, navigate }),
    [isPending, navigate],
  );

  return (
    <HireTalentTransitionContext.Provider value={value}>
      {children}
    </HireTalentTransitionContext.Provider>
  );
}

export function HireTalentCardsFrame({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const transition = useContext(HireTalentTransitionContext);

  if (!transition) {
    throw new Error(
      "HireTalentCardsFrame must be used within HireTalentTransition",
    );
  }

  return transition.isPending ? fallback : <>{children}</>;
}

export function useHireTalentNavigate() {
  const transition = useContext(HireTalentTransitionContext);

  if (!transition) {
    throw new Error(
      "useHireTalentNavigate must be used within HireTalentTransition",
    );
  }

  return transition.navigate;
}
