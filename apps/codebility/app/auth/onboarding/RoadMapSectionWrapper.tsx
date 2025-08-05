import { RefObject } from "react";
import IsRoadMap from "./_components/RoadMap/IsRoadMap";

export default function RoadMapWrapper({
  roadmapRef,
}: {
  roadmapRef: RefObject<HTMLDivElement | null>; // ✅ Allow null
}) {
  return <IsRoadMap ref={roadmapRef} />;
}
