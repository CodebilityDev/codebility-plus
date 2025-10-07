"use client";

import { useEffect } from "react";

const ForceScrollTop = () => {
  useEffect(() => {
    // Prevent any scrolling during initial render
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Force immediate scroll to top
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
    
    // Clear any hash from URL immediately
    if (window.location.hash) {
      const newUrl = window.location.pathname + window.location.search;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    // Disable all scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Force scroll again after a short delay to override any other scroll behavior
    const timeouts = [0, 16, 50, 100].map(delay => 
      setTimeout(() => {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, delay)
    );
    
    // Restore smooth scrolling after initial load
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
      document.body.style.scrollBehavior = 'smooth';
    }, 500);
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return null;
};

export default ForceScrollTop;