"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// next/image that fades in once the photo has loaded, so lazy photos don't pop in over their tone block.
export function FadeImage({ alt, className = "", onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      data-loaded={loaded || undefined}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={`fade-image ${className}`}
    />
  );
}
