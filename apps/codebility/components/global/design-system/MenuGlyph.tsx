import { cn } from "@codevs/ui";

export interface MenuGlyphProps {
  className?: string;
}

function MenuGlyph({ className }: MenuGlyphProps) {
  return (
    <span aria-hidden className={cn("flex flex-col gap-[var(--cb-space-4)]", className)}>
      <span className="h-[var(--cb-size-2)] w-[var(--cb-size-18)] bg-[color:var(--cb-white)]" />
      <span className="h-[var(--cb-size-2)] w-[var(--cb-size-18)] bg-[color:var(--cb-white)]" />
      <span className="h-[var(--cb-size-2)] w-[var(--cb-size-18)] bg-[color:var(--cb-white)]" />
    </span>
  );
}

export { MenuGlyph };
