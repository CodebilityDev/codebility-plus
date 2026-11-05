"use client";

import React from "react";
import type { PrevButtonPropType } from "@/types/global/marketing";



export const PrevButton: React.FC<PrevButtonPropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--prev"
      type="button"
      {...restProps}
    >
      {children}
    </button>
  );
};
