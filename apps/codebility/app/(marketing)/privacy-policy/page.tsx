import { Metadata } from "next";

import PrivacyPolicyContent from "./_components/PrivacyPolicyContent";

export const metadata: Metadata = {
    title: "Privacy Policy — Codebility",
    description: "Read Codebility's privacy policy to understand how we collect, use, and protect your personal information.",
    alternates: { canonical: "https://www.codebility.tech/privacy-policy" },
    openGraph: {
        title: "Privacy Policy | Codebility",
        description: "How Codebility handles and protects your personal data.",
        url: "https://www.codebility.tech/privacy-policy",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Codebility Privacy Policy" }],
    },
};

export default function PrivacyPolicy() {
    return <PrivacyPolicyContent />;
}
