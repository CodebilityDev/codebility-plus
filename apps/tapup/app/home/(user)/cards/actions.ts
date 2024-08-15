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

    if (error) throw error;
    
    return data;
}

export const getCards = async () => {
    const supabase = createServerActionClient({ cookies });

    const {
      error: fetchingUserError,
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw fetchingUserError;
    
    const { error, data } = await supabase.from('cards')
    .select('*')
    .eq('user_id', user.id);

    if (error) throw error;
    return data;
}   