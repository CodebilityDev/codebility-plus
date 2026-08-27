"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type SyntheticEvent } from "react";

import {
  isSvgSrc,
  resolveSrcString,
  toLqipSrc,
} from "../../_lib/landing-image-blur";

function cx(...parts: Array<string | false | undefined | null>) {
  return parts.filter(Boolean).join(" ");
}

export default function LandingImage({
  src,
  alt,
  className,
  style,
  onLoad,
  priority,
  loading,
  placeholder: _placeholder,
  blurDataURL: _blurDataURL,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const svg = isSvgSrc(src);
  const srcStr = resolveSrcString(src);
  const fill = Boolean(props.fill);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    setLoaded(true);
    onLoad?.(event);
  };

  if (svg || !srcStr) {
    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        style={style}
        priority={priority}
        loading={priority ? loading : (loading ?? "lazy")}
        {...props}
      />
    );
  }

  return (
    <span
      className={cx(
        "relative isolate overflow-hidden",
        fill ? "absolute inset-0 block h-full w-full" : "inline-block max-w-full",
      )}
    >
      {!loaded ? (
        // eslint-disable-next-line @next/next/no-img-element -- same-image LQIP via optimizer
        <img
          src={toLqipSrc(srcStr)}
          alt=""
          aria-hidden
          decoding="async"
          className={cx(
            className,
            "pointer-events-none absolute inset-0 z-0 h-full w-full scale-110 blur-2xl",
          )}
          style={style}
        />
      ) : null}
      <Image
        src={src}
        alt={alt}
        className={cx(
          className,
          !loaded && "opacity-0",
          !fill && "relative z-10",
        )}
        style={style}
        priority={priority}
        loading={priority ? loading : (loading ?? "lazy")}
        onLoad={handleLoad}
        {...props}
      />
    </span>
  );
}
