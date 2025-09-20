// components/LandingInternCard.tsx
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Person = {
  name: string;
  image?: string; // image URL (optional)
};

function Avatar({
  person,
  size = 80,
  position = "center top"
}: {
  person: Person;
  size?: number;
  position?: string;
}) {
  const nameParts = (person.name ?? "")
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);

  const initials = nameParts
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join("");

  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(person.image) && !imgError;

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
          className="absolute top-1/2 left-1/2 object-cover"
          style={{
            objectPosition: position,
            width: `${size * 1.2}px`,
            height: `${size * 1.2}px`,
            transform: "translate(-50%, -50%)",
            display: "block"
          }}
          loading="lazy"
        />
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
  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 py-10">
      {interns.map((intern, idx) => (
        <Card
          key={idx}
          className="bg-black-800 text-white rounded-sm shadow-2xl border border-neutral-700 flex flex-col items-center p-4 min-h-[260px]" // ✅ same height, no fixed width
        >
          <CardContent className="flex flex-col items-center gap-3 p-5 h-full">
            {/* Avatar (always aligned at the top) */}
            <div className="flex justify-center items-start h-20">
              <Avatar person={intern} size={80} />
            </div>
            {/* Name */}
            <h3 className="text-sm font-medium text-center break-words line-clamp-2">
              {intern.name}
            </h3>
            {/* Role */}
            <p className="text-sm text-center opacity-70">Intern</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
