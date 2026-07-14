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
 * Falls back to an initials avatar if `src` is empty or fails to load
 * (Build Spec §6.1). `object-top` matters here specifically: the real
 * headshot (public/profile-pic.png) is a tall 2:3 portrait with the face in
 * the upper portion — a centered crop into this square frame would slice
 * into the top of the hair, so the crop is anchored to the top of the
 * source image instead of centered.
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
          className="h-full w-full object-cover object-top"
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
