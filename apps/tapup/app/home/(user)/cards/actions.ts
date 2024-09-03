"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { getMailer } from "@codevs/mailers";
import generateCode from "./_lib/generateCode";
import Card from "~/types/cards";

export const createCard = async ({id, email}: {id: string, email: string},name: string, industry: string) => {
    const supabase = getSupabaseServerActionClient();

    const code = generateCode(4);

    const { error, data } = await supabase.from('cards').insert({
        user_id: id,
        name,
        code,
        industry,
    }).select().single();
    
    await supabase.from('builder_profile_data').insert({
        card_id: data.id,
        display_name: data.name,
        business_email: email,
        business_industry: industry,
    })

    if (error) throw error;

    const mailer = await getMailer();

    mailer.sendEmail({
        to: email,
        from: process.env.EMAIL_USER as string,
        subject: "Tapup Card Activation",
        html: `Activate your card with this code: ${code}`
    });
    
    return data;
}

export const getCards = async () => {
    const supabase = getSupabaseServerActionClient();

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

export const activateCard = async (userId: string,cardId: string,code: string) => {
    const supabase = getSupabaseServerActionClient();

      const { error, data } = await supabase.from('cards')
      .select('*')
      .eq('user_id', userId)
      .eq('id',cardId)
      .single();

      if (error) throw error;

      const card = data as Card;
      
      if (card.code !== code) throw new Error('Code is not valid!');

      const result = await supabase.from("cards")
      .update({ status: true })
      .eq('id', cardId);

      return result;
}