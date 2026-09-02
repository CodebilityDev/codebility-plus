import Image, { type ImageProps } from "next/image";

export default function LandingImage({
  priority,
  loading,
  ...props
}: ImageProps) {
  return (
    <Image
      {...props}
      priority={priority}
      loading={priority ? loading : (loading ?? "lazy")}
    />
  );
}
