import { redirect } from "next/navigation";
import Logo from "@/Components/shared/Logo";
import { getCachedUser } from "@/lib/server/supabase-server-comp";

import { getSupabaseServerComponentClient } from "@codevs/supabase/server-component-client";

import DeclinedButtons from "./_components/declined-buttons";
import DeclinedCountdown from "./_components/declined-countdown";
import { DeclinedApplicant } from "./_types";

const DeclinedPage = async () => {
  const supabase = getSupabaseServerComponentClient();
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("declined_applicants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <section className="bg-backgroundColor text-primaryColor flex h-screen w-screen items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center gap-8 text-center lg:gap-10">
        <Logo />
        <div>
          <p className="mb-2 text-lg md:text-lg lg:text-2xl">
            Application Status Update
          </p>
          <p className="text-gray mx-auto text-xs md:max-w-[500px] md:text-lg">
            Unfortunately, your application was not accepted. You may reapply
            after 3 months.
          </p>
        </div>
        <DeclinedCountdown data={data as DeclinedApplicant} />
        <DeclinedButtons data={data as DeclinedApplicant} />

        <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]"></div>

        <div className="hero-bubble">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeclinedPage;
