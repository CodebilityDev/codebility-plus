"use client";

import React from "react";
import Link from "next/link";

export default function ApplicantStep4({ user }: { user: any }) {
  return (
    <div className="my-10 flex flex-col items-center gap-4 text-center">
      <div className="flex flex-col items-center gap-3">
        {/* Success Icon */}
        <div className="mb-2">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="mb-1 text-2xl font-bold md:text-3xl">
          Onboarding Complete!
        </h2>

        <p className="mx-auto mb-3 max-w-[600px] text-sm text-gray-400">
          Congratulations {user.first_name}! You are now on the <span className="font-bold text-blue-400">waitlist</span> and waiting to be accepted.
        </p>

        {/* Two Column Layout for Desktop */}
        <div className="grid w-full max-w-[900px] grid-cols-1 gap-4 md:grid-cols-2">
          {/* What's Next */}
          <div className="rounded-lg border-2 border-blue-500 bg-blue-900/10 p-4">
            <h3 className="mb-3 text-lg font-semibold text-blue-400">What's Next?</h3>
            <div className="space-y-2 text-left text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  1
                </div>
                <p>
                  <span className="font-semibold text-white">Review Period:</span> We're reviewing your application, quiz, and commitment.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  2
                </div>
                <p>
                  <span className="font-semibold text-white">Stay Active:</span> Check your email and Discord for updates.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  3
                </div>
                <p>
                  <span className="font-semibold text-white">Acceptance:</span> You'll receive instructions on joining your first project.
                </p>
              </div>
            </div>
          </div>

          {/* Messenger Community */}
          <div className="rounded-lg border-2 border-green-500 bg-green-900/10 p-4">
            <h3 className="mb-2 text-lg font-semibold text-green-400">
              Join Our Community!
            </h3>
            <p className="mb-3 text-xs text-gray-300">
              Connect with other applicants and stay engaged while on the waitlist.
            </p>
            <Link
              href="https://m.me/cm/AbaY0jeoYC4j7pmu/?send_source=cm:copy_invite_link"
              target="_blank"
              className="inline-block w-full"
            >
              <button className="from-customTeal to-customViolet-100 w-full rounded-full bg-gradient-to-r via-customBlue-100 p-0.5 transition-all hover:bg-gradient-to-br">
                <span className="bg-black-100 flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white">
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.897 1.446 5.484 3.707 7.17V22l3.475-1.908c.927.257 1.91.393 2.818.393 5.523 0 10-4.145 10-9.243C22 6.145 17.523 2 12 2zm.993 12.535l-2.557-2.73-4.992 2.73 5.489-5.827 2.62 2.73 4.929-2.73-5.489 5.827z" />
                  </svg>
                  Join Messenger
                </span>
              </button>
            </Link>
            <div className="mt-3 rounded-md border border-green-600 bg-green-950/30 p-2">
              <p className="text-xs text-green-300">
                <span className="font-bold">After joining:</span> Navigate to the <span className="font-semibold">"Bench"</span> subchat for your next instructions and updates.
              </p>
            </div>
          </div>
        </div>

        {/* Reminder Box */}
        <div className="mt-3 w-full max-w-[900px] rounded-lg border border-yellow-500 bg-yellow-900/10 p-3">
          <p className="text-xs text-yellow-400">
            <span className="font-bold">Remember:</span> You committed to 3-6 months and twice weekly meetings. Be ready when we reach out!
          </p>
        </div>

        {/* Stay Connected Section */}
        <div className="mt-4 w-full max-w-[900px]">
          <h3 className="mb-2 text-sm font-semibold">Stay Connected</h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
            <Link
              href="https://www.linkedin.com/company/codebilitytech"
              target="_blank"
              className="rounded-lg border border-gray-700 bg-gray-900/20 px-4 py-2 text-xs transition-colors hover:border-blue-500 hover:bg-blue-900/10"
            >
              Follow on LinkedIn
            </Link>
            <Link
              href="https://www.facebook.com/Codebilitydev"
              target="_blank"
              className="rounded-lg border border-gray-700 bg-gray-900/20 px-4 py-2 text-xs transition-colors hover:border-blue-500 hover:bg-blue-900/10"
            >
              Like on Facebook
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_DISCORD_LINK || ""}
              target="_blank"
              className="rounded-lg border border-gray-700 bg-gray-900/20 px-4 py-2 text-xs transition-colors hover:border-blue-500 hover:bg-blue-900/10"
            >
              Join Discord
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
