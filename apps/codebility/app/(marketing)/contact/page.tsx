// Server component wrapper — metadata lives here
// ACTION REQUIRED: Move the original page.tsx content to ./_components/ContactPage.tsx
// then paste this file as the new page.tsx
import { Metadata } from "next";
import ContactPage from "./_components/ContactPage";

export const metadata: Metadata = {
    title: "Contact Us — Get in Touch with Codebility",
    description: "Have a project in mind? Contact Codebility to discuss your software development needs and schedule a consultation.",
    alternates: { canonical: "https://www.codebility.tech/contact" },
    openGraph: {
        title: "Contact Us | Codebility",
        description: "Get in touch with Codebility to start your next project.",
        url: "https://www.codebility.tech/contact",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Contact Codebility" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact Us | Codebility",
        description: "Get in touch with Codebility to start your next project.",
        images: ["/og-image.jpg"],
    },
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ContactPageWrapper() {
    return <ContactPage />;
}