"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

type Listener = () => void;

const listenersByKey = new Map<string, Set<Listener>>();

const cacheByKey = new Map<
  string,
  { raw: string | null; value: unknown }
>();

function emit(key: string) {
  listenersByKey.get(key)?.forEach((listener) => listener());
}

function subscribeKey(key: string, onStoreChange: Listener) {
  let listeners = listenersByKey.get(key);
  if (!listeners) {
    listeners = new Set();
    listenersByKey.set(key, listeners);
  }
  listeners.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) onStoreChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners!.delete(onStoreChange);
    if (listeners!.size === 0) listenersByKey.delete(key);
    window.removeEventListener("storage", onStorage);
  };
}

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function readValue<T>(key: string): T | null {
  const raw = readRaw(key);
  const cached = cacheByKey.get(key);

  if (cached && cached.raw === raw) {
    return cached.value as T | null;
  }

  if (raw == null) {
    cacheByKey.set(key, { raw: null, value: null });
    return null;
  }

  try {
    const value = JSON.parse(raw) as T;
    cacheByKey.set(key, { raw, value });
    return value;
  } catch {
    localStorage.removeItem(key);
    cacheByKey.set(key, { raw: null, value: null });
    return null;
  }
}

function getServerSnapshot() {
  return null;
}


export function useLocalStorageValue<T>(key: string): T | null {
  const subscribe = useCallback(
    (onStoreChange: Listener) => subscribeKey(key, onStoreChange),
    [key],
  );

  const getSnapshot = useCallback(() => readValue<T>(key), [key]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setLocalStorageValue<T>(key: string, value: T) {
  const raw = JSON.stringify(value);
  localStorage.setItem(key, raw);
  cacheByKey.set(key, { raw, value });
  emit(key);
}

export function removeLocalStorageValue(key: string) {
  localStorage.removeItem(key);
  cacheByKey.set(key, { raw: null, value: null });
  emit(key);
}