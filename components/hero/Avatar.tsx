"use client";

import Image from "next/image";
import { useState } from "react";

interface AvatarProps {
  src: string;
  name: string;
  size?: number;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Falls back to an initials avatar if `src` is empty or fails to load —
 * public/profile.jpg is a placeholder until a real headshot is supplied
 * (Build Spec §6.1).
 */
export function Avatar({ src, name, size = 160 }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg-elevated-2"
    >
      {showImage ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          priority
          className="h-full w-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span className="font-display text-h2 font-bold text-text-muted">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
