"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useModal } from "@/hooks/use-modal";

import { Dialog, DialogContent, DialogTitle } from "@codevs/ui/dialog";

function PrivacyPolicyModal() {
  const { isOpen, onClose, type } = useModal();
  const isModalOpen = isOpen && type === "homePrivacyPolicyModal";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black-800 flex max-h-full max-w-[1260px] flex-col justify-between text-white">
        <DialogTitle className="sr-only">Privacy Policy</DialogTitle>
        <div className="flex h-full overflow-hidden rounded-[10px] border border-[#1D1D1E]">
          <div className="hidden sm:flex">
          <NavBar />
          </div>
          <Content />
        </div>
        <Footer onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

const NavBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabs = [
    "Information We Collect",
    "Use of Your Information",
    "Disclosure of Your Information",
    "Security of Your Information",
    "Changes to This Privacy Policy",
  ];
  return (
    <div className="flex flex-col gap-[10px] bg-[#ffffff0d] p-4 md:p-[1.2rem]">
      {tabs.map((tab, index) => (
        <Link
          key={index}
          href={`#${tab}`}
          onClick={() => setActiveTab(index)}
          className={`px-2 py-1 text-xs sm:whitespace-nowrap sm:px-[1.2rem] sm:py-[10px] sm:text-base ${index === activeTab ? "rounded-[10px] bg-[#222222]" : ""}`}
        >
          {tab}
        </Link>
      ))}
    </div>
  );
};

function Content() {
  const contents = [
    {
      title: "Information We Collect",
      detail: (
        <>
          <p>
            We may collect information about you in a variety of ways. The
            information we may collect on the Site includes:
          </p>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">Personal Data</h3>
            <p>
              Personally identifiable information, such as your name, shipping
              address, email address, and telephone number, and demographic
              information, such as your age, gender, hometown, and interests,
              that you voluntarily give to us when you register on the Site or
              when you choose to participate in various activities related to
              the Site, such as online chat and message boards.
            </p>
          </span>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              Derivative Data
            </h3>
            <p>
              Information our servers automatically collect when you access the
              Site, such as your IP address, your browser type, your operating
              system, your access times, and the pages you have viewed directly
              before and after accessing the Site.
            </p>
          </span>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              Financial Data
            </h3>
            <p>
              Financial information, such as data related to your payment method
              (e.g., valid credit card number, card brand, expiration date) that
              we may collect when you purchase, order, return, exchange, or
              request information about our services from the Site.
            </p>
          </span>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              Mobile Device Data
            </h3>
            <p>
              Device information, such as your mobile device ID, model, and
              manufacturer, and information about the location of your device,
              if you access the Site from a mobile device.
            </p>
          </span>
        </>
      ),
    },
    {
      title: "Use of Your Information",
      detail: (
        <>
          <p>
            Having accurate information about you permits us to provide you with
            a smooth, efficient, and customized experience. Specifically, we may
            use information collected about you via the Site to:
          </p>
          <ul className="ml-4 list-disc">
            <li>Create and manage your account.</li>
            <li>Process your transactions and manage your orders.</li>
            <li>
              Send you administrative information, such as updates, security
              alerts, and support messages..
            </li>
            <li>
              Fulfill and manage purchases, orders, payments, and other
              transactions related to the Site.
            </li>
            <li>
              Deliver targeted advertising, coupons, newsletters, and
              promotions, and other information regarding our website and mobile
              app to you.
            </li>
            <li>Improve our website and mobile app to better serve you.</li>
            <li>
              Respond to your comments, questions, and provide customer service.
            </li>
            <li>
              Monitor and analyze usage and trends to improve your experience
              with the Site.
            </li>
            <li>
              Protect against fraudulent transactions, monitor against theft,
              and protect against criminal activity.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "Disclosure of Your Information",
      detail: (
        <>
          <p>
            We may share information we have collected about you in certain
            situations. Your information may be disclosed as follows:
          </p>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              By Law or to Protect Rights
            </h3>
            <p>
              If we believe the release of information about you is necessary to
              respond to legal process, to investigate or remedy potential
              violations of our policies, or to protect the rights, property,
              and safety of others, we may share your information as permitted
              or required by any applicable law, rule, or regulation.
            </p>
          </span>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              Business Transfers
            </h3>
            <p>
              We may share or transfer your information in connection with, or
              during negotiations of, any merger, sale of company assets,
              financing, or acquisition of all or a portion of our business to
              another company.
            </p>
          </span>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              Third-Party Service Providers
            </h3>
            <p>
              We may share your information with third parties that perform
              services for us or on our behalf, including payment processing,
              data analysis, email delivery, hosting services, customer service,
              and marketing assistance.
            </p>
          </span>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              Marketing Communications
            </h3>
            <p>
              With your consent, or with an opportunity for you to withdraw
              consent, we may share your information with third parties for
              marketing purposes, as permitted by law.
            </p>
          </span>
          <span className="flex flex-col">
            <h3 className="font-bold text-white sm:text-base">
              Interactions with Other Users
            </h3>
            <p>
              If you interact with other users of the Site, those users may see
              your name, profile photo, and descriptions of your activity,
              including sending invitations to other users, chatting with other
              users, liking posts, and following blogs.
            </p>
          </span>
        </>
      ),
    },
    {
      title: "Security of Your Information",
      detail: (
        <p>
          We use administrative, technical, and physical security measures to
          help protect your personal information. While we have taken reasonable
          steps to secure the personal information you provide to us, please be
          aware that despite our efforts, no security measures are perfect or
          impenetrable, and no method of data transmission can be guaranteed
          against any interception or other types of misuse.
        </p>
      ),
    },
    {
      title: "Changes to This Privacy Policy",
      detail: (
        <p>
          We may update this Privacy Policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal, or regulatory reasons. Any changes or
          modifications will be effective immediately upon posting the updated
          Privacy Policy on the Site, and you waive the right to receive
          specific notice of each such change or modification.
        </p>
      ),
    },
  ];

  return (
    <div className="flex max-h-[540px] flex-col gap-5 overflow-y-auto p-4">
      <p className="self-end text-xs italic text-[#898989] sm:text-sm">
        Last Updated: May 23, 2024
      </p>
      {contents.map((content, index) => (
        <div key={index} className="flex flex-col gap-[10px]">
          <h2 className="text-sm font-semibold sm:text-base" id={content.title}>
            {content.title}
          </h2>
          <span className="ml-4 flex flex-col gap-5 text-sm text-[#898989] sm:ml-10 sm:text-base">
            {content.detail}
          </span>
        </div>
      ))}
    </div>
  );
}

interface FooterProps {
  onClose: () => void;
}

const Footer: React.FC<FooterProps> = ({ onClose }) => (
  <div className="flex justify-between gap-2">
    <div className="flex flex-col">
      <h1 className="xs:text-2xl text-base font-semibold">Privacy Policy</h1>
      <p className="text-sm sm:text-base">
        At Codebility, we are committed to protecting your privacy. This Privacy
        Policy outlines how we collect, use, and protect your information.
      </p>
    </div>
    <button
      onClick={onClose}
      className="rounded-[100px] bg-[#ffffff0d] px-4 py-2 sm:px-14 sm:py-5"
    >
      Close
    </button>
  </div>
);

export default PrivacyPolicyModal;
