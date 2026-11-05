"use client";

import type { PrevButtonPropType } from "@/types/global/marketing";
import React from "react";

export const NextButton: React.FC<PrevButtonPropType> = (props) => {
  const { children, ...restProps } = props;

  return (
    <button
      className="embla__button embla__button--next"
      type="button"
      {...restProps}
    >
      {children}
    </button>
  );
};
