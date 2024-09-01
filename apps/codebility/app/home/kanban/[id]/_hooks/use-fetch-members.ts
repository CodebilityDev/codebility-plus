import { getSupabaseBrowserClient } from "@codevs/supabase/browser-client";
import { useQuery } from "@tanstack/react-query";

export function useFetchMembers() {
    const queryFn = async () => {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.from("user")
        .select(`
        *,
        profile(
            first_name,
            last_name,
            image_url
        ),
        codev(id)
        `)

        if (error) throw error;

        return data.map(({ id, email, profile, codev }) => {
            const { first_name, last_name, image_url } = profile;
            
            return {
                id,
                email,
                first_name,
                last_name,
                image_url,
                codev_id: codev.id
            }
        })
    }

    return useQuery({
        queryKey: ["supabase:users"],
        queryFn
    });
}