"use client";

import { Button } from "@/Components/ui/button";

export default function Appointment() {
  return (
    <div className="relative mx-auto flex w-screen max-w-xl flex-col gap-10 text-pretty rounded-lg border border-white/5 bg-white/5 px-5 py-10 text-white lg:py-14 xl:px-20">
      <div className="flex flex-col gap-1">
        <p className="text-xl">Appointment</p>
        <p className="text-grey-100">
          Key Details to Get Started on Your Website Project
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Button variant="purple" rounded="md">
          Set Appointment
        </Button>
      </div>
    </div>
  );
}
