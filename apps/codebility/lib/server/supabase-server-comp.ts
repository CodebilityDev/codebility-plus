"use server";

import { signOut } from "@/app/authv2/actions";
import { User } from "lucide-react";
import { cookies } from "next/headers";
import { use } from "react";
import z from "zod";

const UserSchema = z.object({
    id: z.string(),
    email: z.string().optional()
});

type User = z.infer<typeof UserSchema>;

export async function getCachedUser(): Promise<User | null>  {
    const supabaseUser = cookies().get("supabase-user");
    let parsedSuccess = false;
    
    if (supabaseUser && supabaseUser.value) {
        parsedSuccess = UserSchema.safeParse(JSON.parse(supabaseUser.value)).success;
    }
    
    if (!parsedSuccess) return null;
    
    return JSON.parse((supabaseUser as {value: string}).value) as User;
}   