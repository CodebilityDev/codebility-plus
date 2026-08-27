import type { ImageProps, StaticImageData } from "next/image";

export function resolveSrcString(src: ImageProps["src"]): string | undefined {
  if (typeof src === "string") return src;
  if (src && typeof src === "object" && "src" in src) {
    return (src as StaticImageData).src;
  }
  return undefined;
}

export function isSvgSrc(src: ImageProps["src"]): boolean {
  const path = resolveSrcString(src);
  return Boolean(path?.includes(".svg"));
}

export function hasStaticBlur(src: ImageProps["src"]): src is StaticImageData {
  return (
    typeof src === "object" &&
    src !== null &&
    "blurDataURL" in src &&
    Boolean((src as StaticImageData).blurDataURL)
  );
}

/** Tiny optimized preview of the same image (Next image optimizer). */
export function toLqipSrc(src: string): string {
  return `/_next/image?url=${encodeURIComponent(src)}&w=32&q=20`;
}
