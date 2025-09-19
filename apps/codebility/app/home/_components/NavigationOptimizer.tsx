'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Prefetch commonly accessed routes for faster navigation
const COMMON_ROUTES = [
  '/home',
  '/home/kanban',
  '/home/time-tracker',
  '/home/interns',
  '/home/admin-dashboard',
  '/home/my-team',
  '/home/tasks',
];

export function NavigationOptimizer() {
  const router = useRouter();

  useEffect(() => {
    // Prefetch common routes after initial load
    const timer = setTimeout(() => {
      COMMON_ROUTES.forEach(route => {
        router.prefetch(route);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return null;
}