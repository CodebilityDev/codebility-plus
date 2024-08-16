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
    .eq('card_id', cardId);

    console.log(profileData,error)
}