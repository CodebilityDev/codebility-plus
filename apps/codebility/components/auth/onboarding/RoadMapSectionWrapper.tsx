
import IsRoadMap from "@/components/auth/onboarding/IsRoadMap";
import RoadMapIntro from "@/components/auth/onboarding/RoadMapIntro";
import type { RoadMapWrapperProps } from "@/types/auth/onboarding/onboarding";

export default function RoadMapWrapper({
  roadmapRef,
}: RoadMapWrapperProps) {
  // ✅ Works because IsRoadMap is forwardRef
  return (
    <>
      <RoadMapIntro />
      <IsRoadMap ref={roadmapRef} />
    </>
  );
}