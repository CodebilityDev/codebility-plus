import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  FileText,
  Info,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { LandingContainer } from "@/components/global/layout/LandingContainer";
import { PrivacyPolicyNavigation } from "@/components/landing/privacy-policy/PrivacyPolicyNavigation";
import { PrivacyPolicyTerms } from "@/components/landing/privacy-policy/PrivacyPolicyTerms";
import {
  privacyContactEmail,
  privacySections,
} from "@/constants/landing/privacy-policy/privacy-policy-content";
import "@/styles/landing/privacy-policy/privacy-policy.css";

export default function PrivacyPolicyContent() {
  return (
    <div className="privacy-policy-page">
      <LandingContainer className="privacy-policy-container">
        <header className="privacy-policy-hero">
          <Eyebrow variant="outline" className="gap-2 tracking-[.24em]">
            <ShieldCheck size={15} />
            Legal
          </Eyebrow>
          <h1>Privacy Policy</h1>
          <p>
            How Codebility collects, uses and protects your personal
            information.
          </p>
          <div className="privacy-policy-meta-row">
            <div className="privacy-policy-meta">
              <span>
                <Clock3 size={16} />
                Last updated <time dateTime="2024-03">March 2024</time>
              </span>
              <span>
                <FileText size={16} />5 min read
              </span>
            </div>
            <PrivacyPolicyTerms />
          </div>
        </header>
        <div className="privacy-policy-layout">
          <PrivacyPolicyNavigation />
          <article
            className="privacy-policy-article"
            aria-label="Privacy policy"
          >
            <div className="privacy-policy-introduction">
              <p className="privacy-policy-lead">
                Thank you for choosing to be part of our community at Codebility
                (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or
                &quot;our&quot;). We are committed to protecting your personal
                information and your right to privacy. If you have any questions
                or concerns about our policy or our practices with regard to
                your personal information, please contact us at{" "}
                <a href={`mailto:${privacyContactEmail}`}>
                  {privacyContactEmail}
                </a>
                . When you visit our website and use our services, you trust us
                with your personal information.
              </p>
              <p>
                We take your privacy very seriously. In this privacy policy, we
                describe our privacy policy. We seek to explain to you in the
                clearest way possible what information we collect, how we use
                it, and what rights you have in relation to it. We hope you take
                some time to read through it carefully, as it is important. If
                there are any terms in this privacy policy that you do not agree
                with, please discontinue the use of our Sites and our services.
              </p>
              <p>
                This privacy policy applies to all information collected through
                our website (<Link href="/">https://www.codebility.tech/</Link>
                ), and/or any related services, sales, marketing, or events (we
                refer to them collectively in this privacy policy as the
                &quot;Services&quot;).
              </p>
              <p>
                Please read this privacy policy carefully as it will help you
                make informed decisions about sharing your personal information
                with us.
              </p>
            </div>
            {privacySections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="privacy-policy-section"
              >
                <h2 id={`${section.id}-heading`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </h2>
                <div className="privacy-policy-summary">
                  <Info size={16} aria-hidden="true" />
                  <p>
                    <strong>In short:</strong> {section.summary}
                  </p>
                </div>
                {section.subheading && <h3>{section.subheading}</h3>}
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    {paragraph}
                    {section.contact && (
                      <>
                        {" "}
                        <a href={`mailto:${privacyContactEmail}`}>
                          {privacyContactEmail}
                        </a>
                        .
                      </>
                    )}
                  </p>
                ))}
                {section.items && (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item.text}>
                        {item.title && (
                          <>
                            <strong>{item.title}</strong>{" "}
                          </>
                        )}
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <div className="privacy-policy-contact">
              <span className="privacy-policy-contact-icon">
                <Mail size={23} />
              </span>
              <div>
                <h2>Questions about your data?</h2>
                <p>Contact us and we’ll get back to you.</p>
              </div>
              <Button asChild>
                <a href={`mailto:${privacyContactEmail}`}>
                  Email us <ArrowRight size={18} />
                </a>
              </Button>
            </div>
          </article>
        </div>
      </LandingContainer>
    </div>
  );
}
