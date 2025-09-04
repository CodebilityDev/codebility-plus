// File: @/components/modals/TechStackModal.tsx
// EMERGENCY FIX - REPLACE ENTIRE FILE
"use client";

import React, { useState, useEffect } from "react";
import { useModal } from "@/hooks/use-modal";
import { useTechStackStore } from "@/hooks/use-techstack";

const TECH_STACKS = [
  "javascript", "typescript", "react", "nextjs", "nodejs",
  "python", "php", "java", "angular", "vue", "laravel", "django",
  "html", "css", "sass", "tailwindcss", "bootstrap",
  "mongodb", "mysql", "postgresql", "redis", "firebase"
];

export default function TechStackModal() {
  console.log("🔥 TechStackModal component is rendering!");
  
  const { isOpen, onClose, type } = useModal();
  const { stack, setStack } = useTechStackStore();
  const [tempStack, setTempStack] = useState<string[]>([]);
  
  const isModalOpen = isOpen && type === "techStackModal";
  
  console.log("🔥 Modal state - isOpen:", isOpen, "type:", type, "isModalOpen:", isModalOpen);

  useEffect(() => {
    if (isModalOpen) {
      setTempStack(stack || []);
      console.log("🔥 Modal opened, temp stack:", stack);
    }
  }, [isModalOpen, stack]);

  const toggleTechStack = (tech: string) => {
    setTempStack(prev => 
      prev.includes(tech) 
        ? prev.filter(t => t !== tech)
        : [...prev, tech]
    );
  };

  const handleSave = () => {
    setStack(tempStack);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Force render when modal should be open
  if (!isModalOpen) {
    console.log("🔥 Modal should not be open, returning null");
    return null;
  }

  console.log("🔥 Modal should be visible now!");

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-80"
      onClick={handleCancel}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-black">Select Your Tech Stack</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {TECH_STACKS.map((tech) => (
            <button
              key={tech}
              type="button"
              onClick={() => toggleTechStack(tech)}
              className={`p-3 rounded border text-sm ${
                tempStack.includes(tech) 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-gray-100 text-black border-gray-300 hover:bg-gray-200'
              }`}
            >
              {tech.charAt(0).toUpperCase() + tech.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded text-black hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save ({tempStack.length} selected)
          </button>
        </div>
      </div>
    </div>
  );
}

// EMERGENCY: Also export as named export in case import is wrong
export { TechStackModal };