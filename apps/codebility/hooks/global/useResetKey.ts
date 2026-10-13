"use client";

import { useState } from "react";

export function useResetKey(value: unknown) {
  const [previous, setPrevious] = useState(value);
  const [key, setKey] = useState(0);

  if (previous !== value) {
    setPrevious(value);
    setKey((current) => current + 1);
  }

  return key;
}
