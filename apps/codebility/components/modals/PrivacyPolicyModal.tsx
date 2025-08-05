import React from "react";
import Link from "next/link";
import { useModal } from "@/hooks/use-modal";
import { XIcon } from "lucide-react";

import { Button } from "@codevs/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@codevs/ui/dialog";

const PrivacyPolicyModal = () => {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "privacyPolicyModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="h-4/5 w-full overflow-scroll text-primary dark:text-white">
        <DialogTitle className="sr-only">Privacy Policy</DialogTitle>
        <DialogClose asChild className="absolute right-4 top-4">
          <Button variant={"ghost"}>
            <XIcon className="h-6 w-6" />
          </Button>
        </DialogClose>

        <div className="flex flex-col gap-8 py-10">
          <h1 className="mb-5 text-center text-4xl">Privacy Policy</h1>
          <p>
            Thank you for choosing to be part of our community at Codebility (
            {"Company"}, {"we"}, {"us"}, or {"our"}). We are committed to
            protecting your personal information and your right to privacy. If
            you have any questions or concerns about our policy or our practices
            with regard to your personal information, please contact us at{" "}
            <a href="mailto:codebility.dev@gmail.com">
              codebility.dev@gmail.com
            </a>
            . When you visit our website and use our services, you trust us with
            your personal information.
          </p>
          <p>
            We take your privacy very seriously. In this privacy policy, we
            describe our privacy policy. We seek to explain to you in the
            clearest way possible what information we collect, how we use it,
            and what rights you have in relation to it. We hope you take some
            time to read through it carefully, as it is important. If there are
            any terms in this privacy policy that you do not agree with, please
            discontinue the use of our Sites and our services.
          </p>
          <p>
            This privacy policy applies to all information collected through our
            website (
            <Link href="https://www.codebility.tech">
              https://www.codebility.tech/
            </Link>
            ), and/or any related services, sales, marketing, or events (we
            refer to them collectively in this privacy policy as the{" "}
            {"Services"}).
          </p>
          <p className="font-bold">
            Please read this privacy policy carefully as it will help you make
            informed decisions about sharing your personal information with us.
          </p>
          <ol className="flex list-decimal flex-col gap-5">
            <li>
              <p className="mb-3 font-bold">What information do we collect?</p>
              <p className="mb-3 font-bold">
                Personal information you disclose to us
              </p>
              <p>
                In Short: We collect personal information that you provide to
                us. We collect personal information that you voluntarily provide
                to us when you register on the Services, express an interest in
                obtaining information about us or our products and Services,
                when you participate in activities on the Services or otherwise
                when you contact us. The personal information that we collect
                depends on the context of your interactions with us and the
                Services, the choices you make and the products and features you
                use. The personal information we collect may include the
                following:- Personal Information Provided by You. We collect
                names; phone numbers; email addresses; usernames; passwords;
                contact preferences; contact or authentication data; and other
                similar information.
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">How do we use your information?</p>
              <p>
                In Short: We process your information for purposes based on
                legitimate business interests, the fulfillment of our contract
                with you, compliance with our legal obligations, and/or your
                consent. We use personal information collected via our Services
                for a variety of business purposes described below. We process
                your personal information for these purposes in reliance on our
                legitimate business interests, in order to enter into or perform
                a contract with you, with your consent, and/or for compliance
                with our legal obligations. We indicate the specific processing
                grounds we rely on next to each purpose listed below. We use the
                information we collect or receive: - To facilitate account
                creation and logon process. If you choose to link your account
                with us to a third-party account (such as your Google or
                Facebook account), we use the information you allowed us to
                collect from those third parties to facilitate account creation
                and logon process for the performance of the contract.
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">
                Will your information be shared with anyone?
              </p>
              <p>
                In Short: We only share information with your consent, to comply
                with laws, to provide you with services, to protect your rights,
                or to fulfill business obligations. We may process or share your
                data that we hold based on the following legal basis: - Consent:
                We may process your data if you have given us specific consent
                to use your personal information in a specific purpose.
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">
                Who will your information be shared with?
              </p>
              <p>
                In Short: We only share information with the following third
                parties. We only share and disclose your information with the
                following third parties. We have categorized each party so that
                you may be easily understand the purpose of our data collection
                and processing practices.-{" "}
                <span className="font-bold">
                  Advertising, Direct Marketing, and Lead Generation -
                  Communicate and Chat with Users - Content Optimization - User
                  Account Registration and Authentication.
                </span>
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">
                Do we use cookies and other tracking technologies?
              </p>
              <p>
                In Short: We may use cookies and other tracking technologies to
                collect and store your information. We may use cookies and
                similar tracking technologies (like web beacons and pixels) to
                access or store information. Specific information about how we
                use such technologies and how you can refuse certain cookies is
                set out in our Cookie Policy.
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">
                How long do we keep your information?
              </p>
              <p>
                In Short: We keep your information for as long as necessary to
                fulfill the purposes outlined in this privacy policy unless
                otherwise required by law. We will only keep your personal
                information for as long as it is necessary for the purposes set
                out in this privacy policy, unless a longer retention period is
                required or permitted by law (such as tax, accounting or other
                legal requirements). No purpose in this policy will require us
                keeping your personal information for longer than the period of
                time in which users have an account with us.
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">
                How do we keep your information safe?
              </p>
              <p>
                In Short: We aim to protect your personal information through a
                system of organizational and technical security measures. We
                have implemented appropriate technical and organizational
                security measures designed to protect the security of any
                personal information we process. However, please also remember
                that we cannot guarantee that the internet itself is 100%
                secure. Although we will do our best to protect your personal
                information, transmission of personal information to and from
                our Services is at your own risk. You should only access the
                services within a secure environment.
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">
                Do we collect information from minors?
              </p>
              <p>
                In Short: We do not knowingly collect data from or market to
                children under 18 years of age. We do not knowingly solicit data
                from or market to children under 18 years of age. By using the
                Services, you represent that you are at least 18 or that you are
                the parent or guardian of such a minor and consent to such minor
                dependent{`'`}s use of the Services. If we learn that personal
                information from users less than 18 years of age has been
                collected, we will deactivate the account and take reasonable
                measures to promptly delete such data from our records. If you
                become aware of any data we have collected from children under
                age 18, please contact us at{" "}
                <a href="mailto:codebility.dev@gmail.com">
                  codebility.dev@gmail.com
                </a>
                .
              </p>
            </li>
            <li>
              <p className="mb-3 font-bold">What are your privacy rights?</p>
              <p>
                In Short: You may review, change, or terminate your account at
                any time.
              </p>
              <p>
                You have certain rights under applicable data protection laws.
                These may include the right (i) to request access and obtain a
                copy of your personal information, (ii) to request rectification
                or erasure; (iii) to restrict the processing of your personal
                information.
              </p>
            </li>
          </ol>
          <p>Last Updated: March 2024</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
