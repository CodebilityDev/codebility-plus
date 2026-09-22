import { Metadata } from "next";
import React from "react";

import BookACallPageContent from "./_components/BookACallPageContent";

export const metadata: Metadata = {
    title: "Book a Call — Schedule a Meeting with Codebility",
    description: "Schedule a free consultation with Codebility. Let us understand your project and propose the right development team for you.",
    alternates: { canonical: "https://www.codebility.tech/bookacall" },
    openGraph: {
        title: "Book a Call | Codebility",
        description: "Schedule a free consultation with the Codebility team.",
        url: "https://www.codebility.tech/bookacall",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Book a Call with Codebility" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Book a Call | Codebility",
        description: "Schedule a free consultation with the Codebility team.",
        images: ["/og-image.jpg"],
    },
};

export default function BookCallPage() {
    return <BookACallPageContent />;
}
