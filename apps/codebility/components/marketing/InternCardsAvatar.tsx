"use client";

import { useState } from "react";
import type { InternCardsAvatarProps } from "@/types/marketing/marketing";

export function InternCardsAvatar({
  person,
  size = 80,
  position = "center top",
}: InternCardsAvatarProps) {
  const getInitials = () => {
    const fullName = person.name.trim();

    if (!fullName) return "";

    const nameParts = fullName.split(/\s+/).filter((p) => p.length > 0);

    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts[nameParts.length - 1];

      if (firstName && lastName) {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
      }
    } else if (nameParts.length === 1) {
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
  const hasImage = Boolean(person.image) && !imgError;

  if (hasImage) {
    return (
      <div
        className="relative flex-shrink-0 overflow-hidden rounded-full border-2 border-neutral-700 bg-gray-800"
        style={{ height: size, width: size }}
      >
        <img
          src={person.image}
          alt={person.name}
          onError={() => setImgError(true)}
          onLoad={() => setImgLoaded(true)}
          ref={(node) => {
            if (node?.complete && node.naturalWidth > 0) {
              setImgLoaded(true);
            }
          }}
          className={`absolute left-1/2 top-1/2 object-cover transition-opacity duration-200 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            objectPosition: position,
            width: `${size * 1.2}px`,
            height: `${size * 1.2}px`,
            transform: "translate(-50%, -50%)",
            display: "block",
          }}
          loading="lazy"
          decoding="async"
        />
        {!imgLoaded ? (
          <div
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            aria-hidden
          >
            <span
              className="font-bold text-white opacity-50"
              style={{ fontSize: Math.max(12, size * 0.38), lineHeight: 1 }}
            >
              {initials || "?"}
            </span>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="flex flex-shrink-0 items-center justify-center rounded-full border-2 border-neutral-700 bg-gray-800"
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
