"use client";

import { Button } from "@/Components/ui/button";
import Input from "@/Components/ui/forms/input";

import { Label } from "@codevs/ui/label";

export default function InquiryForm() {
  return (
    <div className="relative mx-auto flex w-screen max-w-xl flex-col gap-10 text-pretty rounded-lg border border-white/5 bg-white/5 px-10 py-10 text-white ">
      <div className="flex flex-col gap-1">
        <p className="text-xl">Inquire Form</p>
        <p className="text-grey-100">Kindly provide your details with us</p>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="fullname">Full Name:</Label>
          <Input
            id="fullname"
            onChange={() => {}}
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm "
            placeholder="Enter your full name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email:</Label>
          <Input
            id="email"
            onChange={() => {}}
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm "
            placeholder="Enter your company email address"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="companyname">Company Name:</Label>
          <Input
            id="email"
            onChange={() => {}}
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm "
            placeholder="Enter your Company Name"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="phonenumber">Phone number:</Label>
          <Input
            id="phonenumber"
            onChange={() => {}}
            className="border-black-800 bg-black-800 w-full rounded border px-3 py-2 text-sm "
          />
        </div>
      </div>
      <Button variant="purple" rounded="md">
        Next
      </Button>
    </div>
  );
}
