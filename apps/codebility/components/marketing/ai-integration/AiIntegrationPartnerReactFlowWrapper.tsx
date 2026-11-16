"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const PartnerReactFlow = dynamic(
  () =>
    import("@/components/marketing/ai-integration/AiIntegrationPartnerReactFlow"),
  {
    ssr: false,
    loading: () => <PartnerReactFlowPlaceholder />,
  },
);

function PartnerReactFlowPlaceholder() {
  return <div aria-hidden="true" className="h-[600px]" />;
}

export default function AiIntegrationPartnerReactFlowWrapper() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || nearViewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [nearViewport]);

  return (
    <div ref={containerRef} className="hidden lg:block">
      {nearViewport ? <PartnerReactFlow /> : <PartnerReactFlowPlaceholder />}
    </div>
  );
}
