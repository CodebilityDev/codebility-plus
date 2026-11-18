"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import {
  privacyContactEmail,
  privacySections,
} from "@/constants/landing/privacy-policy/privacy-policy-content";

export function PrivacyPolicyNavigation() {
  const [activeSection, setActiveSection] = useState(
    privacySections[0]?.id ?? "",
  );

  useEffect(() => {
    const sections = privacySections.map((section) =>
      document.getElementById(section.id),
    );
    const updateActiveSection = () => {
      const current = sections
        .filter(
          (section) => section && section.getBoundingClientRect().top <= 180,
        )
        .at(-1);
      setActiveSection(current?.id ?? privacySections[0]?.id ?? "");
    };
    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  return (
    <aside className="privacy-policy-sidebar">
      <div className="privacy-policy-sidebar-inner">
        <div className="privacy-policy-mobile-navigation">
          <label htmlFor="privacy-policy-sections">On this page</label>
          <select
            id="privacy-policy-sections"
            value={activeSection}
            onChange={(event) => {
              const id = event.target.value;
              setActiveSection(id);
              document.getElementById(id)?.scrollIntoView({ block: "start" });
              window.history.replaceState(null, "", `#${id}`);
            }}
          >
            {privacySections.map((section, index) => (
              <option key={section.id} value={section.id}>
                {String(index + 1).padStart(2, "0")} · {section.title}
              </option>
            ))}
          </select>
        </div>
        <nav
          aria-label="On this page"
          className="privacy-policy-desktop-navigation"
        >
          <p>On this page</p>
          <ol>
            {privacySections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={
                    activeSection === section.id ? "location" : undefined
                  }
                  onClick={() => setActiveSection(section.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="privacy-policy-questions">
          <h2>Questions?</h2>
          <p>Email us about anything in this policy.</p>
          <a href={`mailto:${privacyContactEmail}`}>
            <Mail size={15} />
            {privacyContactEmail}
          </a>
        </div>
      </div>
    </aside>
  );
}
