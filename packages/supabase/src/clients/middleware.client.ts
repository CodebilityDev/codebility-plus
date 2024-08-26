import { type NextRequest, NextResponse } from 'next/server';

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

/**
 * Creates a middleware client for Supabase.
 *
 * @param {NextRequest} request - The Next.js request object.
 * @param {NextResponse} response - The Next.js response object.
 */
export { createMiddlewareClient };