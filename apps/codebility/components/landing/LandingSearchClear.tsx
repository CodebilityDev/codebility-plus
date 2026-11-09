"use client";

import { Button } from "@/components/global/design-system/Button";
import { useLandingSearchTransition } from "@/components/landing/LandingSearchTransition";

function LandingSearchClear() {
  const { navigate } = useLandingSearchTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate("/", { replace: false })}
    >
      Clear search
    </Button>
  );
}

export { LandingSearchClear };
