"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { ProfileData } from "./_lib/builder-data-form-datas";

function camelToSnakeCase(text: string) {
    let result = "";
    for (let i = 0;i < text.length;i++) {
        const current = text[i];
        if (current === current?.toUpperCase()) result += `_${current?.toLowerCase()}`;
        else result += current;
    }

    return result;
}

export async function updateBuilderProfileData(cardId: string,data: ProfileData) {
    const supabase = createServerActionClient({ cookies });

    const fields = Object.keys(data);
    const newData: Record<string,string> = {};
    for (let i = 0;i < fields.length;i++) {
        const field = fields[i] as keyof typeof data;
        newData[camelToSnakeCase(field as string)] = data[field];
    }

    const {data: profileData,error} = await supabase.from("profile").upsert(Object.assign(newData, {card_id: cardId}))

    console.log(profileData,error)
}

export async function getCardById(cardId: string, userId: string) {
    const supabase = createServerActionClient({ cookies });
    const { data, error } = await supabase
    .from('cards')
    .select(
      `id,
       name,
       username_url,
       status,
       industry`,
    )
    .eq('id', cardId)
    .eq('user_id', userId)
    .single()

    if (error) throw error;

    return data;
}

export async function getBuilderProfileData(cardId: string) {
    const supabase = createServerActionClient({ cookies });

    const { data, error } = await supabase.from('builder_profile_data')
    .select(`
        display_name,
        cover_photo,
        business_email,
        business_contact,
        business_industry,
        industry_role, 
        bio`
    ).eq("card_id", cardId).single();

    if (error) throw error;
    return data;
}