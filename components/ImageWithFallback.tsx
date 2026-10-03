"use client";
import { useState } from "react";

export function ImageWithFallback({
  src,
  alt,
  className,
  fallback = "/images/placeholder-gift.svg",
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setImgSrc(fallback)}
    />
  );
}
