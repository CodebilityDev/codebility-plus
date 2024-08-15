"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export const createCard = async (user_id: string,name: string, role: string) => {
    const supabase = createServerActionClient({ cookies });

    const { error, data } = await supabase.from('cards').insert({
        user_id,
        name,
        industry: role,
    });

    return data;
}