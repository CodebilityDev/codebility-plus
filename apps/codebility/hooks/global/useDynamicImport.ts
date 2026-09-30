"use client";

import { lazy } from "react";

// ponytail: React.lazy caches the factory per module, so one import() per specifier is
// shared by every consumer. The Map keeps identity stable across renders, which lazy requires.
const cache = new Map<string, React.ComponentType<any>>();

export function useDynamicImport(
  load: () => Promise<{ default: React.ComponentType<any> }>,
): React.ComponentType<any> {
  const key = load.toString();
  let component = cache.get(key);

  if (!component) {
    component = lazy(load);
    cache.set(key, component);
  }

  return component;
}
