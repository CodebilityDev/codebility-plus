import { RefObject } from "react";

import IsRoadMap from "./_components/RoadMap/IsRoadMap";
import RoadMapIntro from "./_components/RoadMap/RoadMapIntro";

export default function RoadMapWrapper({
  roadmapRef,
}: {
  roadmapRef: RefObject<HTMLDivElement | null>;
}) {
  // ✅ Works because IsRoadMap is forwardRef
  return (
    <>
      <RoadMapIntro />
      <IsRoadMap ref={roadmapRef} />
    </>
  );
}
