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

interface PortfolioTransitionValue {
  isPending: boolean;
  navigate: (href: string) => void;
}

const PortfolioTransitionContext =
  createContext<PortfolioTransitionValue | null>(null);

export function PortfolioTransition({ children }: { children: ReactNode }) {
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
    <PortfolioTransitionContext.Provider value={value}>
      {children}
    </PortfolioTransitionContext.Provider>
  );
}

export function PortfolioCardsFrame({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const context = useContext(PortfolioTransitionContext);

  if (!context) {
    throw new Error(
      "PortfolioCardsFrame must be used within PortfolioTransition",
    );
  }

  return context.isPending ? fallback : <>{children}</>;
}

export function usePortfolioNavigate() {
  const context = useContext(PortfolioTransitionContext);

  if (!context) {
    throw new Error(
      "usePortfolioNavigate must be used within PortfolioTransition",
    );
  }

  return context.navigate;
}
