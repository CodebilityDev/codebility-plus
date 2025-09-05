import { createClientServerComponent } from "@/utils/supabase/server";

export async function POST(request: Request) {

    try {
        const formData = await request.formData()
        const email = formData.get('email')
        const stringEmail = email?.toString().trim().toLowerCase();

        const supabase = await createClientServerComponent();

        if (!stringEmail) {
            return Response.json({ message: "Email is required" }, { status: 400 });
        }

        const { error, data } = await supabase.auth.resend({
            type: 'signup',
            email: stringEmail,
        });

        if (error) {
            console.error("Error resending verification email:", error);
            return Response.json({ message: error.message }, { status: 400 });
        }

        return Response.json({ email: stringEmail, data: data }, { status: 200 });
    } catch (error) {
        console.error("Error in email verification:", error);
        return Response.json({ message: "Internal Server Error" }, { status: 500 });
    }

}