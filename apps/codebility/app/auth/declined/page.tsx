// app/declined/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/Components/shared/Logo";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { DeclinedButtons } from "./_components/DeclinedButtons";
import { DeclinedCountdown } from "./_components/DeclinedCountdown";

const DeclinedPage = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/auth/sign-in");
        return;
      }

      const { data } = await supabase
        .from("codev")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setUserData(data);
      }
    };

    fetchUser();
  }, [router, supabase]);

  if (!userData) return null;

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
        <DeclinedCountdown userData={userData} />
        <DeclinedButtons userData={userData} />

        <div className="hero-gradient absolute top-0 z-10 h-[400px] w-[200px] overflow-hidden blur-[200px] lg:w-[500px] lg:blur-[350px]" />
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
