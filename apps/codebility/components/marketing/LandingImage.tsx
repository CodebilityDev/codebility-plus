import Image from "next/image";
import type {ImageProps} from "next/image";

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
