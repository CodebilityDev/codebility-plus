import { useSupabase } from "@codevs/supabase/hooks/use-supabase"
import { useQuery } from "@tanstack/react-query";
import { Member } from "../../../_types/member";

export function useFetchMembers() {
    const supabase = useSupabase();

    const queryFn = async () => {
        const { data, error } = await supabase.from("codev")
        .select(`
            *,
            user(
                *,
                profile(
                    first_name,
                    last_name,
                    image_url
                ),
                codev(id)
            )
        `)
        if (error) throw error;

        return data.map(({ id, user }) => {
            const { first_name, last_name, image_url } = user.profile;
            
            return {
                id,
                email: user.email,
                first_name,
                last_name,
                image_url,
                user_id: user.id
            }
        })
    }

    return useQuery<Member[]>({
        queryKey: ["supabase:users"],
        queryFn
    });
}