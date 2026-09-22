import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const updateMatch = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener
    media.addEventListener("change", updateMatch);

    // Clean up on unmount
    return () => {
      media.removeEventListener("change", updateMatch);
    };
  }, [query]); // Re-run effect if query changes

  return matches;
}

export default useMediaQuery;
