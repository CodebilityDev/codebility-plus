import type { PrivacyPolicySection } from "@/types/landing/privacy-policy/privacy-policy";

export const privacyContactEmail = "codebility.dev@gmail.com";

export const privacySections: PrivacyPolicySection[] = [
  {
    id: "information-we-collect",
    title: "What information do we collect?",
    summary: "We collect personal information that you provide to us.",
    subheading: "Personal information you disclose to us",
    paragraphs: [
      "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services or otherwise when you contact us.",
      "The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect may include the following:",
    ],
    items: [
      {
        title: "Personal Information Provided by You.",
        text: "We collect names; phone numbers; email addresses; usernames; passwords; contact preferences; contact or authentication data; and other similar information.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How do we use your information?",
    summary:
      "We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.",
    paragraphs: [
      "We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.",
      "We use the information we collect or receive:",
    ],
    items: [
      {
        title: "To facilitate account creation and logon process.",
        text: "If you choose to link your account with us to a third-party account (such as your Google or Facebook account), we use the information you allowed us to collect from those third parties to facilitate account creation and logon process for the performance of the contract.",
      },
    ],
  },
  {
    id: "sharing-your-information",
    title: "Will your information be shared with anyone?",
    summary:
      "We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.",
    paragraphs: [
      "We may process or share your data that we hold based on the following legal basis:",
    ],
    items: [
      {
        title: "Consent:",
        text: "We may process your data if you have given us specific consent to use your personal information in a specific purpose.",
      },
    ],
  },
  {
    id: "who-we-share-with",
    title: "Who will your information be shared with?",
    summary: "We only share information with the following third parties.",
    paragraphs: [
      "We only share and disclose your information with the following third parties. We have categorized each party so that you may be easily understand the purpose of our data collection and processing practices.",
    ],
    items: [
      { text: "Advertising, Direct Marketing, and Lead Generation" },
      { text: "Communicate and Chat with Users" },
      { text: "Content Optimization" },
      { text: "User Account Registration and Authentication" },
    ],
  },
  {
    id: "cookies-and-tracking",
    title: "Do we use cookies and other tracking technologies?",
    summary:
      "We may use cookies and other tracking technologies to collect and store your information.",
    paragraphs: [
      "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy.",
    ],
  },
  {
    id: "information-retention",
    title: "How long do we keep your information?",
    summary:
      "We keep your information for as long as necessary to fulfill the purposes outlined in this privacy policy unless otherwise required by law.",
    paragraphs: [
      "We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). No purpose in this policy will require us keeping your personal information for longer than the period of time in which users have an account with us.",
    ],
  },
  {
    id: "information-security",
    title: "How do we keep your information safe?",
    summary:
      "We aim to protect your personal information through a system of organizational and technical security measures.",
    paragraphs: [
      "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the services within a secure environment.",
    ],
  },
  {
    id: "information-from-minors",
    title: "Do we collect information from minors?",
    summary:
      "We do not knowingly collect data from or market to children under 18 years of age.",
    paragraphs: [
      "We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we have collected from children under age 18, please contact us at",
    ],
    contact: true,
  },
  {
    id: "your-privacy-rights",
    title: "What are your privacy rights?",
    summary: "You may review, change, or terminate your account at any time.",
    paragraphs: [
      "You have certain rights under applicable data protection laws. These may include the right:",
    ],
    items: [
      {
        text: "to request access and obtain a copy of your personal information;",
      },
      { text: "to request rectification or erasure;" },
      { text: "to restrict the processing of your personal information." },
    ],
  },
];
