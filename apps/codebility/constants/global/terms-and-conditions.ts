export const TERMS_LAST_UPDATED = "2024-05-23";

export const TERMS_CONTACT_EMAIL = "codebility.dev@gmail.com";

export const TERMS_INTRO =
  "These Terms and Conditions govern your use of Codebility's website at codebility.tech and the services we provide. By accessing the website or engaging our services, you agree to be bound by these terms. If you do not agree with any part of them, please do not use our services.";

export interface TermsSection {
  id: string;
  title: string;
  clauses: string[];
}

export const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "definitions",
    title: "Definitions",
    clauses: [
      '"Company", "We", "Our" or "Us" refers to Codebility.',
      '"Client", "You" or "Your" refers to the individual or entity using our website and services.',
      '"Services" refers to the web, mobile, AI and product design work, and related services, offered by Codebility.',
      '"Developer" refers to any individual employed or contracted by Codebility to provide the Services.',
    ],
  },
  {
    id: "services-provided",
    title: "Services Provided",
    clauses: [
      "We design, build and maintain websites, web and mobile applications, and related digital products for our clients.",
      "Clients may schedule appointments with our developers for projects including, but not limited to, design, development and maintenance.",
    ],
  },
  {
    id: "client-obligations",
    title: "Client Obligations",
    clauses: [
      "Clients must provide, in a timely manner, all information and materials needed to complete the project.",
      "Clients are responsible for the accuracy and completeness of the information they provide.",
      "Clients must work with our developers and give prompt feedback so the project can progress.",
      "Clients agree to honor scheduled appointments or give at least 24 hours' notice to cancel or reschedule.",
    ],
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    clauses: [
      "Both parties agree to keep confidential any proprietary information disclosed during the project.",
      "Confidential information shall not be disclosed to any third party without the prior written consent of the disclosing party.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    clauses: [
      "Upon project completion, and subject to any separate written agreement, the client owns the intellectual property rights to the completed work and related materials.",
      "We may showcase the completed project in our portfolio and marketing materials, unless otherwise agreed in writing.",
    ],
  },
  {
    id: "termination",
    title: "Termination",
    clauses: [
      "Either party may terminate the agreement at any time by giving written notice to the other party.",
      "On termination, all materials provided by the client will be returned, and any work completed up to the termination date will be delivered to the client.",
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    clauses: [
      "We are not liable for any indirect, incidental, special or consequential damages arising from the use of our services.",
      "Our total liability to the client is limited to the scope of the services provided through scheduled appointments.",
    ],
  },
  {
    id: "dispute-resolution",
    title: "Dispute Resolution",
    clauses: [
      "Any dispute arising from these terms shall first be resolved through good faith negotiation between the parties.",
      "If a resolution cannot be reached, the dispute shall be settled through binding arbitration in accordance with the rules of [Arbitration Organization].",
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    clauses: [
      "These terms are governed by and construed in accordance with the laws of [Your Jurisdiction].",
      "Any legal action or proceeding relating to these terms shall be brought exclusively in the courts of [Your Jurisdiction].",
    ],
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms and Conditions",
    clauses: [
      "We may modify these terms at any time.",
      "Changes take effect when posted on our website. Continued use of our services after a change means you accept the new terms.",
    ],
  },
  {
    id: "contact-information",
    title: "Contact Information",
    clauses: [`For questions about these terms, email us at ${TERMS_CONTACT_EMAIL}.`],
  },
];
