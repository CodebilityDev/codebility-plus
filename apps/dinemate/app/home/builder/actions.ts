"use server";

import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import { ManageProfileData } from "~/lib/profile-data";

type Case = 'snake' | 'camel';

/**
 * Convert a text case to another case
 * @param text {string} - the text to transform. 
 * @param { from, to } {object} - an object that contains information about the cases.
 * @returns similar text from other case
 */
function transformCase(text: string, { from, to }: { from: Case, to: Case}): string {
    let result = "";
    let matcher: ((char: string) => boolean) | null = null;
    let transform: ((text: string, increment: number) => string) | null = null;
    let totalIncrementAfterMatch = 0;

    switch ( from ) {
        case "snake":
            if (to === "camel") {
                matcher = (char: string) => char === "_";
                transform = (text: string, increment: number) => text.charAt(increment + 1).toUpperCase();
                totalIncrementAfterMatch = 1;
            }
            break;
        case "camel":
            if (to === "snake") {
                matcher = (char: string) => char === char.toUpperCase();
                transform = (text: string, increment: number) => `_${text.charAt(increment).toLowerCase()}`;
            }
            break;
    }

    if (!matcher || !transform) throw new Error("invalid given from or to case!");

    for (let i = 0;i < text.length;i++) { 
        const char = text.charAt(i);
        if (matcher(char)) {
            result += transform(text, i);
            i += totalIncrementAfterMatch;
        } else result += char;
    }

    return result;
}

function transformPropertyNameCase(target: Record<string, any>, { from, to }: { from: Case, to: Case }): Record<string, any> {
    const fields = Object.keys(target);
    const newData: Record<string,string> = {};
    for (let i = 0;i < fields.length;i++) {
        const field = fields[i] as keyof typeof target;

        newData[transformCase(field as string, {
            from,
            to
        })] = target[field];
    }

    return newData;
}

export async function updateBuilderProfileData(cardId: string,data: ManageProfileData) {
    const supabase = getSupabaseServerActionClient();

    const newData = transformPropertyNameCase(data, {
        from: "camel",
        to: "snake"
    });

    const {data: profileData,error} = await supabase.from("builder_profile_data")
    .update(newData)
    .eq("card_id", cardId);

    if (error) throw error;
}

export async function getCardById(cardId: string, userId: string) {
    const supabase = getSupabaseServerActionClient();
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
    const supabase = getSupabaseServerActionClient();

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
    const newData = transformPropertyNameCase(data, {
        from: "snake",
        to: "camel"
    });

    return newData;
}

export async function publishProfile(usernameURL: string, profileKey: string, cardId: string) {
    const supabase = getSupabaseServerActionClient();

    const { data, error: fetchingCardError} = await supabase.from("cards")
    .select()
    .eq("username_url", usernameURL);

    if (!data) throw fetchingCardError;
    if (data.length > 0) throw new Error("given username url already exists!");

    const { error } = await supabase.from("cards")
    .update({
        username_url: usernameURL,
        profile_key: profileKey,
        profile_published: true,
        updated_at: new Date()
    })
    .eq("id", cardId);

    if (error) throw error;
}