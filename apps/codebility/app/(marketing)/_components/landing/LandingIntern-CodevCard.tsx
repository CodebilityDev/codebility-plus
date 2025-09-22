// components/landing/LandingIntern-CodevCard.tsx

"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Person = {
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

export default function InternCards({ interns }: { interns: Person[] }) {
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
    <div className="w-full max-w-6xl mx-auto py-10">
      {/* Responsive grid with proper mobile layout */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {interns.map((intern, idx) => {
          const roleStyles = ROLE_STYLES[intern.role] || ROLE_STYLES[ROLE_CONFIG.INTERN];
          
          return (
            <Card
              key={`${intern.name}-${idx}`}
              className={`text-white rounded-sm shadow-2xl border flex flex-col items-center ${roleStyles.cardClass} 
                         w-full min-w-0`} // Added min-w-0 to prevent flex issues
              style={{ 
                height: '270px', 
                minHeight: '270px', 
                maxHeight: '270px'
              }}
            >
              <CardContent className="flex flex-col items-center p-3 sm:p-4 w-full h-full">
                {/* Avatar Section - Fixed positioning with minimal spacing */}
                <div className="flex justify-center items-center pt-6 pb-0">
                  <Avatar person={intern} size={64} /> {/* Slightly smaller avatar for mobile */}
                </div>
                
                {/* Content Section - Close to avatar with minimal spacing */}
                <div className="flex flex-col items-center justify-center flex-grow w-full space-y-2 sm:space-y-3">
                  {/* Name - Responsive text and spacing */}
                  <div className="flex items-center justify-center">
                    <h3 className="text-xs sm:text-sm font-medium text-center break-words line-clamp-2 leading-tight px-1 sm:px-2">
                      {intern.name}
                    </h3>
                  </div>
                  
                  {/* Role Badge - Responsive sizing */}
                  <div className="flex items-center justify-center">
                    <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${roleStyles.badgeClass}`}>
                      {roleStyles.label}
                    </div>
                  </div>
                  
                  {/* Position - Responsive text and spacing */}
                  <div className="flex items-center justify-center">
                    <p className="text-xs sm:text-sm text-center opacity-70 line-clamp-2 leading-tight px-1 sm:px-2">
                      {intern.display_position || roleStyles.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}