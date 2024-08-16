"use server";

import { cookies } from "next/headers";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { ProfileData } from "./_lib/builder-data-form-datas";

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

export async function updateBuilderProfileData(cardId: string,data: ProfileData) {
    const supabase = createServerActionClient({ cookies });

    const newData = transformPropertyNameCase(data, {
        from: "camel",
        to: "snake"
    });

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
    const newData = transformPropertyNameCase(data, {
        from: "snake",
        to: "camel"
    });

    return newData;
}