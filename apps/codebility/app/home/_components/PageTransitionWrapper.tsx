"use client";

import { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useNavStore } from "@/hooks/use-sidebar";
import PageLoadingAnimation from "./PageLoadingAnimation";

interface PageTransitionWrapperProps {
  children: React.ReactNode;
}

export default function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname();
  const { isToggleOpen } = useNavStore();
  const [isLoading, setIsLoading] = useState(true);
  const [displayedPathname, setDisplayedPathname] = useState(pathname);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(3000);

  // Load user preferences
  useEffect(() => {
    const savedEnabled = localStorage.getItem('pageAnimationEnabled');
    const savedDuration = localStorage.getItem('pageAnimationDuration');
    
    if (savedEnabled !== null) {
      setAnimationEnabled(savedEnabled === 'true');
    }
    if (savedDuration !== null) {
      setAnimationDuration(parseInt(savedDuration));
    }

    // Listen for settings changes
    const handleSettingsChange = (event: CustomEvent) => {
      setAnimationEnabled(event.detail.enabled);
      setAnimationDuration(event.detail.duration);
    };

    window.addEventListener('pageAnimationSettingsChanged', handleSettingsChange as EventListener);
    return () => {
      window.removeEventListener('pageAnimationSettingsChanged', handleSettingsChange as EventListener);
    };
  }, []);

  useEffect(() => {
    // Skip animation if disabled
    if (!animationEnabled) {
      setIsLoading(false);
      setDisplayedPathname(pathname);
      return;
    }

    // Show loading animation when pathname changes
    if (pathname !== displayedPathname) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
        setDisplayedPathname(pathname);
      }, animationDuration);

      return () => clearTimeout(timer);
    } else {
      // Initial load
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [pathname, displayedPathname, animationEnabled, animationDuration]);

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            className="fixed top-0 right-0 bottom-0 z-50"
            style={{
              left: isToggleOpen ? "16rem" : "5rem", // Dynamic sidebar width
              width: isToggleOpen ? "calc(100vw - 16rem)" : "calc(100vw - 5rem)"
            }}
          >
            <PageLoadingAnimation />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: isLoading ? 0 : 1, 
          y: isLoading ? 20 : 0 
        }}
        transition={{ 
          duration: 0.3, 
          delay: isLoading ? 0 : 0.2,
          ease: "easeOut"
        }}
        className={isLoading ? "invisible" : "visible"}
      >
        {children}
      </motion.div>
    </div>
  );
}