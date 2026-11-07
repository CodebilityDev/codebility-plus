import { cn } from "@codevs/ui";

export interface MenuGlyphProps {
  className?: string;
}

function MenuGlyph({ className }: MenuGlyphProps) {
  return (
    <span aria-hidden className={cn("flex flex-col gap-1", className)}>
      <span className="h-0.5 w-[18px] bg-[#f4f4f4]" />
      <span className="h-0.5 w-[18px] bg-[#f4f4f4]" />
      <span className="h-0.5 w-[18px] bg-[#f4f4f4]" />
    </span>
  );
}

export { MenuGlyph };
