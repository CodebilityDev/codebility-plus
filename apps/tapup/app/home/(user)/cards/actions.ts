"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { getMailer } from "@codevs/mailers";
import generateCode from "./_lib/generateCode";

export const createCard = async ({id, email}: {id: string, email: string},name: string, role: string) => {
    const supabase = createServerActionClient({ cookies });

    const code = generateCode(4);

    const { error, data } = await supabase.from('cards').insert({
        user_id: id,
        name,
        code,
        industry: role,
    });

    if (error) throw error;

    const mailer = await getMailer();
    mailer.sendEmail({
        to: email,
        from: process.env.EMAIL_USER as string,
        subject: "Card Activation",
        html: `Activate your card with this code: ${code}`
    });
    
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