import { RefObject, useEffect } from "react";

const useSlider = (
  scrollableDiv: RefObject<HTMLDivElement | null>,
  isLoading: boolean,
) => {
  useEffect(() => {
    if (!scrollableDiv.current) return;

    const slider = scrollableDiv.current;
    let isDown = false;
    let startX: number | undefined;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      startX = e.pageX - slider!.offsetLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };

    const handleMouseUp = () => {
      isDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown || !startX) return;
      e.preventDefault();
      const x = e.pageX - slider!.offsetLeft;
      const walk = (x - startX) * 3; // Adjust multiplier as needed
      slider!.scrollLeft = slider!.scrollLeft - walk;
    };

    slider!.addEventListener("mousedown", handleMouseDown);
    slider!.addEventListener("mouseleave", handleMouseLeave);
    slider!.addEventListener("mouseup", handleMouseUp);
    slider!.addEventListener("mousemove", handleMouseMove);

    return () => {
      slider!.removeEventListener("mousedown", handleMouseDown);
      slider!.removeEventListener("mouseleave", handleMouseLeave);
      slider!.removeEventListener("mouseup", handleMouseUp);
      slider!.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scrollableDiv, isLoading]);
};

export default useSlider;
