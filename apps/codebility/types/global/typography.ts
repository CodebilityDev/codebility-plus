import type { ReactNode } from "react";

export interface H2 {
  children: ReactNode;
  className?: string;
}

export interface Heading3 {
  children: ReactNode;
}

export interface IntroText {
  children: ReactNode;
}

export interface Paragraph {
  children: ReactNode;
  className?: string;
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}
