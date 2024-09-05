import { useEffect, useState } from "react";

const useHideSidebarOnResize = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isSheetOpen) {
        setIsSheetOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSheetOpen]);

  return { isSheetOpen, setIsSheetOpen };
};

export default useHideSidebarOnResize;
