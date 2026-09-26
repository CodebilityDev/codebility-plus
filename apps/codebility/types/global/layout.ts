import React, { ReactNode } from "react";

export interface Box {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface H1 {
  children: ReactNode;
  className?: string;
}

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  id?: string;
  label: string;
  error?: string;
  type?: "email" | "phone";
  inputClassName?: string;
  disabled?: boolean;
  control?: any;
};
