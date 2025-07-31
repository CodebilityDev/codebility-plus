import React from "react";
import { useModal } from "@/hooks/use-modal";

import { Dialog, DialogContent, DialogTitle } from "@codevs/ui/dialog";

function TermsOfServiceModal() {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "termsOfServiceModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-full overflow-scroll">
        <DialogTitle className="sr-only">Terms of Service</DialogTitle>
        <div className="flex flex-col gap-8 py-10">
          <h1 className="text-center text-3xl">Terms of Service</h1>
          <p>Welcome to Codebility!</p>
          <p>
            By accessing or using Codebility, you agree to be bound by these
            Terms of Service. If you disagree with any part of the terms, then
            you may not access the website.
          </p>
          <ol className="ml-5 [counter-reset:section]">
            <li className="[counter-increment:section] marker:[content:counters(section,'.')'._'] ">
              Account Registration
              <ol className="ml-8 [counter-reset:section]">
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  In order to access certain features of Codebility, you may be
                  required to create an account. You agree to provide accurate,
                  current, and complete information during the registration
                  process.
                </li>
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  You are responsible for maintaining the confidentiality of
                  your account and password, and for restricting access to your
                  account. You agree to accept responsibility for all activities
                  that occur under your account.
                </li>
              </ol>
            </li>
            <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
              User Content
              <ol className="ml-8 [counter-reset:section]">
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  Codebility allows users to post, link, store, share, and
                  otherwise make available certain information, text, graphics,
                  videos, or other material. You are solely responsible for the
                  content that you publish on the website.
                </li>
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  By posting content on Codebility, you grant Codebility a
                  non-exclusive, royalty-free, worldwide, perpetual, and
                  transferable license to use, modify, adapt, reproduce,
                  distribute, and display such content.
                </li>
              </ol>
            </li>
            <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
              Prohibited Conduct
              <ol className="ml-8 [counter-reset:section]">
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  You agree not to engage in any of the following prohibited
                  activities: a. Violating any applicable laws or regulations;
                  b. Impersonating any person or entity, or falsely stating or
                  otherwise misrepresenting your affiliation with a person or
                  entity; c. Posting or transmitting any content that is
                  unlawful, harmful, threatening, abusive, harassing,
                  defamatory, vulgar, obscene, libelous, invasive of another
                  {`'`}s privacy, hateful, or racially, ethnically or otherwise
                  objectionable; d. Uploading or transmitting viruses or any
                  other type of malicious code that will or may be used in any
                  way that will affect the functionality or operation of [Your
                  Website], other websites, or the Internet; e. Collecting or
                  tracking the personal information of others without their
                  consent.
                </li>
              </ol>
            </li>
            <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
              Termination
              <ol className="ml-8 [counter-reset:section]">
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  We may terminate or suspend your account immediately, without
                  prior notice or liability, for any reason whatsoever,
                  including without limitation if you breach the Terms.
                </li>
              </ol>
            </li>
            <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
              Changes to Terms
              <ol className="ml-8 [counter-reset:section]">
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material, we
                  will try to provide at least 30 days notice prior to any new
                  terms taking effect. What constitutes a material change will
                  be determined at our sole discretion.
                  <br />
                  By continuing to access or use our Service after those
                  revisions become effective, you agree to be bound by the
                  revised terms. If you do not agree to the new terms, please
                  stop using the Service.
                </li>
              </ol>
            </li>
            <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
              Contact Us
              <ol className="ml-8 [counter-reset:section]">
                <li className="[counter-increment:section] marker:[content:counters(section,'.')'._']">
                  If you have any questions about these Terms, please contact us
                  at{" "}
                  <a href="mailto:codebility.dev@gmail.com">
                    codebility.dev@gmail.com
                  </a>
                  .
                </li>
              </ol>
            </li>
          </ol>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TermsOfServiceModal;
