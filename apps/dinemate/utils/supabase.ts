import { 
    createClientComponentClient,
    createServerComponentClient,
    createRouteHandlerClient
} from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';

export function createClient() {
    return createClientComponentClient();
}

export function createServer() {
    const cookieStore = cookies();
    return createServerComponentClient({
        cookies: () => cookieStore
    });
}

export function createRoute() {
    const cookieStore = cookies();
    return createRouteHandlerClient({
        cookies: () => cookieStore
    });
}