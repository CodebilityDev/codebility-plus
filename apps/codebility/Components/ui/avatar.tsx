import { forwardRef } from "react";

// Basic Avatar component
interface AvatarProps {
  className?: string;
  children: React.ReactNode;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
Avatar.displayName = "Avatar";

// AvatarImage component for the image
interface AvatarImageProps {
  src?: string;
  alt?: string;
  className?: string;
}

const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt, src, ...props }, ref) => (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`h-full w-full object-cover ${className}`}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

// AvatarFallback component for fallback content (e.g., initials)
interface AvatarFallbackProps {
  className?: string;
  children: React.ReactNode;
}

const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`flex h-full w-full items-center justify-center bg-gray-200 text-gray-600 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarFallback, AvatarImage };