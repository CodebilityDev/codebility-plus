import "server-only";
import { cookies } from "next/headers";
import { getSupabaseServerActionClient } from "@codevs/supabase/server-actions-client";
import z from "zod";

const UserSchema = z.object({
    id: z.string(),
    email: z.string().optional()
});

type User = z.infer<typeof UserSchema>;

export async function cachedUser(): Promise<User | null> {
    const supabase = getSupabaseServerActionClient();
    const cookieStore = cookies();
    const supabaseUser = cookieStore.get("supabase-user");

    let parsedSuccess = false;

    if (supabaseUser && supabaseUser.value) {
        parsedSuccess = UserSchema.safeParse(JSON.parse(supabaseUser.value)).success;
    }

    if (!parsedSuccess) {
        const {data: {user}, error } = await supabase.auth.getUser();
        
        if (!user || error) return null; 

        const data = {id: user.id, email: user.email};
        cookieStore.set("supabase-user", JSON.stringify(data));

        return data;
    } 

    return JSON.parse((supabaseUser as {value: string}).value) as User;
}