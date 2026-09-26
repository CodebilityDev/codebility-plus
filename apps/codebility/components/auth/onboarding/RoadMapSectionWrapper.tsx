import { RefObject } from "react";
import IsRoadMap from "@/components/auth/onboarding/IsRoadMap";
import RoadMapIntro from "@/components/auth/onboarding/RoadMapIntro";
export default function RoadMapWrapper({
  roadmapRef,
}: {
  roadmapRef: RefObject<HTMLDivElement>;
}) {
  // ✅ Works because IsRoadMap is forwardRef
  return (
    <>
      <RoadMapIntro />
      <IsRoadMap ref={roadmapRef} />
    </>
  );
}