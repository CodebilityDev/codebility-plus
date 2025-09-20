"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Settings, X } from "lucide-react";

export function PageTransitionSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(800);

  useEffect(() => {
    // Load preferences from localStorage
    const savedEnabled = localStorage.getItem('pageAnimationEnabled');
    const savedDuration = localStorage.getItem('pageAnimationDuration');
    
    if (savedEnabled !== null) {
      setAnimationEnabled(savedEnabled === 'true');
    }
    if (savedDuration !== null) {
      setAnimationDuration(parseInt(savedDuration));
    }
  }, []);

  const handleToggleAnimation = (enabled: boolean) => {
    setAnimationEnabled(enabled);
    localStorage.setItem('pageAnimationEnabled', enabled.toString());
    
    // Dispatch event to notify PageTransitionWrapper
    window.dispatchEvent(new CustomEvent('pageAnimationSettingsChanged', {
      detail: { enabled, duration: animationDuration }
    }));
  };

  const handleDurationChange = (duration: number) => {
    setAnimationDuration(duration);
    localStorage.setItem('pageAnimationDuration', duration.toString());
    
    // Dispatch event to notify PageTransitionWrapper
    window.dispatchEvent(new CustomEvent('pageAnimationSettingsChanged', {
      detail: { enabled: animationEnabled, duration }
    }));
  };

  return (
    <>
      {/* Settings button - only visible on larger screens */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 hidden lg:flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
        title="Page transition settings"
      >
        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>

      {/* Settings modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Page Transition Settings
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Enable/Disable animation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable page animations
                  </label>
                </div>
                <button
                  onClick={() => handleToggleAnimation(!animationEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    animationEnabled ? 'bg-customBlue-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      animationEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Animation duration */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Animation duration: {animationDuration}ms
                </label>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="100"
                  value={animationDuration}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                  className="w-full"
                  disabled={!animationEnabled}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Fast (200ms)</span>
                  <span>Slow (1500ms)</span>
                </div>
              </div>

              {/* Info */}
              <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-3 rounded">
                Page animations help create smooth transitions between pages. 
                Disable them if you prefer instant page loads or are experiencing performance issues.
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}