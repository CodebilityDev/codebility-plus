// components/landing/LandingIntern-CodevCard.tsx

"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

type Person = {
  id: string; // ✅ Added id field for navigation
  name: string;
  role: 'Intern' | 'Codev'; // Only two possible roles from database
  image?: string; // image URL (optional)
  display_position?: string;
};

// Role configuration for easy identification and maintenance
const ROLE_CONFIG = {
  INTERN: 'Intern' as const,
  CODEV: 'Codev' as const,
} as const;

const ROLE_STYLES = {
  [ROLE_CONFIG.INTERN]: {
    cardClass: 'bg-black-800 border-neutral-700',
    badgeClass: 'bg-green-600/30 text-green-300 border border-green-500/30',
    label: 'Intern'
  },
  [ROLE_CONFIG.CODEV]: {
    cardClass: 'bg-gradient-to-br from-blue-900/90 to-black-800 border-blue-700/50',
    badgeClass: 'bg-blue-600/30 text-blue-300 border border-blue-500/30',
    label: 'Codev'
  }
} as const;

function Avatar({
  person,
  size = 80,
  position = "center top"
}: {
  person: Person;
  size?: number;
  position?: string;
}) {
  // Updated initials logic - assumes last word is last_name, everything else is first_name
  const getInitials = () => {
    const fullName = (person.name ?? "").trim();
    
    if (!fullName) return "";
    
    const nameParts = fullName.split(/\s+/).filter((p) => p.length > 0);
    
    if (nameParts.length >= 2) {
      // First letter of first_name (first word) + First letter of last_name (last word)
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];
      
      if (firstName && lastName) {
        const firstNameInitial = firstName.charAt(0);
        const lastNameInitial = lastName.charAt(0);
        return (firstNameInitial + lastNameInitial).toUpperCase();
      }
    } else if (nameParts.length === 1) {
      // If only one name, use first two letters
      const singleName = nameParts[0];
      if (singleName) {
        return singleName.substring(0, 2).toUpperCase();
      }
    }
    
    return "";
  };

  const initials = getInitials();
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [forceRender, setForceRender] = useState(false);
  const hasImage = Boolean(person.image) && !imgError;

  // Force image preloading and rendering
  useEffect(() => {
    if (person.image && person.image !== "/avatars/default.png") {
      const img = new Image();
      img.onload = () => {
        setImgLoaded(true);
        setForceRender(true);
      };
      img.onerror = () => {
        setImgError(true);
      };
      img.src = person.image;
    }
  }, [person.image]);

  if (hasImage) {
    return (
      <div
        className="rounded-full overflow-hidden border-2 border-neutral-700 flex-shrink-0 relative bg-gray-800"
        style={{ height: size, width: size }}
      >
        <img
          src={person.image}
          alt={person.name}
          onError={() => setImgError(true)}
          onLoad={() => {
            setImgLoaded(true);
            console.log('Image loaded:', person.name);
          }}
          className={`absolute top-1/2 left-1/2 object-cover transition-opacity duration-200 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectPosition: position,
            width: `${size * 1.2}px`,
            height: `${size * 1.2}px`,
            transform: "translate(-50%, -50%)",
            display: "block"
          }}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
        />
        {/* Loading placeholder */}
        {!imgLoaded && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <span
              className="font-bold text-white opacity-50"
              style={{ fontSize: Math.max(12, size * 0.38), lineHeight: 1 }}
            >
              {initials || "?"}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-800 border-2 border-neutral-700 flex-shrink-0"
      style={{ height: size, width: size }}
      aria-hidden
    >
      <span
        className="font-bold text-white"
        style={{ fontSize: Math.max(12, size * 0.38), lineHeight: 1 }}
      >
        {initials || "?"}
      </span>
    </div>
  );
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
    rotateY: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function InternCards({ interns }: { interns: Person[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  // Helper function to check if person is Codev
  const isCodev = (person: Person): boolean => person.role === ROLE_CONFIG.CODEV;
  
  // Helper function to check if person is Intern
  const isIntern = (person: Person): boolean => person.role === ROLE_CONFIG.INTERN;

  // Preload all images for current page immediately
  useEffect(() => {
    interns.forEach(intern => {
      if (intern.image && intern.image !== "/avatars/default.png") {
        const img = new Image();
        img.src = intern.image;
      }
    });
  }, [interns]);

  return (
    <motion.div 
      ref={ref}
      className="w-full max-w-6xl mx-auto py-10"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Responsive grid with proper mobile layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {interns.map((intern, idx) => {
          const roleStyles = ROLE_STYLES[intern.role] || ROLE_STYLES[ROLE_CONFIG.INTERN];
          
          return (
            <motion.div
              key={`${intern.name}-${idx}`}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                y: -10,
                rotateY: 5,
                transition: { 
                  duration: 0.3,
                  type: "spring",
                  bounce: 0.4
                }
              }}
              whileTap={{ scale: 0.95 }}
              style={{ perspective: "1000px" }}
              onClick={() => window.location.href = `https://www.codebility.tech/profiles/${intern.id}`}
              className="cursor-pointer"
            >
              <motion.div
                className="h-full relative"
                whileHover={{
                  boxShadow: isCodev(intern) 
                    ? "0 20px 40px -12px rgba(59, 130, 246, 0.3)" 
                    : "0 20px 40px -12px rgba(34, 197, 94, 0.3)",
                }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`text-white rounded-sm shadow-2xl border flex flex-col items-center ${roleStyles.cardClass} 
                             w-full min-w-0 h-full relative overflow-hidden`}
                  style={{ 
                    height: '270px', 
                    minHeight: '270px', 
                    maxHeight: '270px'
                  }}
                >
                  {/* Hover gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 rounded-sm opacity-0 ${
                      isCodev(intern) 
                        ? 'bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-500/20' 
                        : 'bg-gradient-to-br from-green-500/20 via-transparent to-emerald-500/20'
                    }`}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Status indicator */}
                  <motion.div
                    className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                      isCodev(intern) ? 'bg-blue-400' : 'bg-green-400'
                    }`}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: idx * 0.1,
                    }}
                  />

                  <CardContent className="flex flex-col items-center p-3 sm:p-4 w-full h-full relative z-10">
                    {/* Avatar Section - Fixed positioning with minimal spacing */}
                    <motion.div 
                      className="flex justify-center items-center pt-6 pb-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Avatar person={intern} size={64} />
                    </motion.div>
                    
                    {/* Content Section - Close to avatar with minimal spacing */}
                    <div className="flex flex-col items-center justify-center flex-grow w-full space-y-2 sm:space-y-3">
                      {/* Name - Responsive text and spacing */}
                      <motion.div 
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <motion.h3 
                          className="text-xs sm:text-sm font-medium text-center break-words line-clamp-2 leading-tight px-1 sm:px-2"
                          whileHover={{ 
                            color: isCodev(intern) ? "#60a5fa" : "#4ade80",
                            scale: 1.02,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {intern.name}
                        </motion.h3>
                      </motion.div>
                      
                      {/* Role Badge - Responsive sizing */}
                      <motion.div 
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <motion.div 
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${roleStyles.badgeClass}`}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: isCodev(intern) 
                              ? "0 4px 15px rgba(59, 130, 246, 0.3)" 
                              : "0 4px 15px rgba(34, 197, 94, 0.3)",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {roleStyles.label}
                        </motion.div>
                      </motion.div>
                      
                      {/* Position - Responsive text and spacing */}
                      <motion.div 
                        className="flex items-center justify-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <p className="text-xs sm:text-sm text-center opacity-70 line-clamp-2 leading-tight px-1 sm:px-2">
                          {intern.display_position || roleStyles.label}
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}