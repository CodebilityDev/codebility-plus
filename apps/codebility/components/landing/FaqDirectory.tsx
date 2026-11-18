"use client";

import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  GraduationCap,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/global/design-system/Accordion";
import { Button } from "@/components/global/design-system/Button";
import { Eyebrow } from "@/components/global/design-system/Eyebrow";
import { Search } from "@/components/global/design-system/Search";
import { LandingContainer } from "@/components/global/layout/LandingContainer";

type FaqTopic = {
  id: string;
  label: string;
  count: number;
  icon: React.ElementType;
};

type FaqEntry = {
  question: string;
  answer: string;
};

type FaqGroup = FaqTopic & {
  entries: FaqEntry[];
};

const faqGroups: FaqGroup[] = [
  {
    id: "hiring",
    label: "Hiring CoDevs",
    count: 7,
    icon: Briefcase,
    entries: [
      {
        question: "How quickly can I get a developer on my team?",
        answer:
          "After a discovery call we share a shortlist of matching CoDevs. You interview them and choose who joins, before any work or payment starts.",
      },
      {
        question: "Can I interview developers before hiring?",
        answer:
          "Yes. Every shortlist is yours to interview, and you choose who joins before work starts.",
      },
      {
        question: "Are CoDevs full-time or project-based?",
        answer:
          "Both. You can bring a CoDev in full-time or scope them to a defined project.",
      },
      {
        question: "Can I hire part-time?",
        answer:
          "Yes. We can shape an engagement around the time and delivery cadence your project needs.",
      },
      {
        question: "Which time zones do you cover?",
        answer:
          "We match CoDevs to your working hours across US, EU, and APAC time zones.",
      },
      {
        question: "What if the developer isn't the right fit?",
        answer:
          "We work with you to rematch the engagement with another vetted CoDev when the fit is not right.",
      },
      {
        question: "Who owns the code and design files?",
        answer:
          "Upon project completion, and subject to any separate written agreement, the client will own the intellectual property rights to the completed website and any related materials. Terms & Conditions 5.1",
      },
    ],
  },
  {
    id: "about-codebility",
    label: "About Codebility",
    count: 4,
    icon: Sparkles,
    entries: [
      {
        question: "What technologies do your developers specialize in?",
        answer:
          "Our developers specialize in a wide range of technologies including but not limited to: Front-end: HTML, CSS, JavaScript, React, Angular, Vue.js. Back-end: Node.js, Python, Ruby on Rails, PHP, Java. Mobile: Swift, Kotlin, Flutter, React Native. AI: Machine Learning, Natural Language Processing, Data Analysis.",
      },
      {
        question: "What makes Codebility different from other development companies?",
        answer:
          "Codebility combines vetted Filipino talent, practical mentorship, and a delivery process designed to keep clients close to the work.",
      },
      {
        question: "How do you ensure the quality of your projects?",
        answer:
          "Projects are supported by team leads, shared delivery boards, regular check-ins, and reviews throughout the engagement.",
      },
      {
        question: "What kind of support can I expect during and after the project?",
        answer:
          "You get a point of contact, delivery support, and optional maintenance help after launch.",
      },
    ],
  },
  {
    id: "joining-codev",
    label: "Joining as a CoDev",
    count: 7,
    icon: Users,
    entries: [
      {
        question: "Is the program paid?",
        answer:
          "No salaries. Codebility offers experience, mentorship and a launchpad: real projects, guidance from team leads and a portfolio you take with you.",
      },
      {
        question: "What benefits do members of the Codebility Community receive?",
        answer:
          "Members receive mentorship, project experience, peer support, and a portfolio built through real work.",
      },
      {
        question: "Is this a bootcamp or a course?",
        answer:
          "No. It is a community and project-based experience focused on learning by doing with support from mentors.",
      },
      {
        question: "Who can join: only developers?",
        answer:
          "The community welcomes developers and other people who contribute to building digital products, including designers and project contributors.",
      },
      {
        question: "What will I actually work on?",
        answer:
          "You will contribute to real web, mobile, AI, and product projects with guidance from experienced team leads.",
      },
      {
        question: "How do I move from Intern to CoDev to Mentor?",
        answer:
          "Progression is based on your consistency, growth, project contributions, and readiness to support other members.",
      },
      {
        question: "What's expected of me?",
        answer:
          "Show up consistently, communicate clearly, keep learning, and take ownership of the work you commit to.",
      },
    ],
  },
  {
    id: "careers",
    label: "Careers",
    count: 4,
    icon: GraduationCap,
    entries: [
      {
        question: "How is this different from being a CoDev?",
        answer:
          "Careers lists paid and contract roles with Codebility or our partner clients. The CoDev program is our unpaid community for learning through real projects and mentorship.",
      },
      {
        question: "Am I employed by Codebility or the client?",
        answer:
          "It depends on the role and agreement. The job listing will explain the employer and engagement structure.",
      },
      {
        question: "Can I apply from outside the Philippines?",
        answer:
          "Some roles are location-specific while others are remote. Check the requirements on each listing before applying.",
      },
      {
        question: "Can I apply for more than one role?",
        answer:
          "Yes. Apply for roles that match your experience and explain the kind of work you are looking for.",
      },
    ],
  },
  {
    id: "booking",
    label: "Booking a call",
    count: 5,
    icon: CalendarDays,
    entries: [
      {
        question: "Is the call free?",
        answer:
          "Yes. The 30-minute call is free and there's no commitment. You only move forward if you choose to work with us.",
      },
      {
        question: "Who will I talk to?",
        answer:
          "You will speak with someone from the Codebility team who can understand your goals and recommend the next step.",
      },
      {
        question: "What should I prepare?",
        answer:
          "Bring your goals, timeline, current scope, preferred skills, and any links or documents that help explain the project.",
      },
      {
        question: "Can I reschedule or cancel?",
        answer:
          "Yes. Use the scheduling link in your confirmation email to reschedule or cancel your call.",
      },
      {
        question: "I want to join as a CoDev. Is this the right page?",
        answer:
          "For community and CoDev opportunities, visit the CoDevs page or start with the application flow.",
      },
    ],
  },
];

const allFaqs = faqGroups.flatMap((group) => group.entries);

function FaqGroup({ group, query }: { group: FaqGroup; query: string }) {
  const Icon = group.icon;
  const normalizedQuery = query.trim().toLowerCase();
  const entries = React.useMemo(
    () =>
      normalizedQuery
        ? group.entries.filter((entry) =>
            entry.question.toLowerCase().includes(normalizedQuery),
          )
        : group.entries,
    [group.entries, normalizedQuery],
  );
  const entryQuestions = React.useMemo(
    () => entries.map((entry) => entry.question),
    [entries],
  );

  const [openQuestion, setOpenQuestion] = React.useState(
    entries[0]?.question,
  );

  React.useEffect(() => {
    setOpenQuestion((current) =>
      current && entryQuestions.includes(current)
        ? current
        : entryQuestions[0],
    );
  }, [entryQuestions]);

  if (entries.length === 0) return null;

  return (
    <section id={`faq-${group.id}`} className="scroll-mt-28">
      <h2 className="flex items-center gap-3 text-xl font-semibold text-[color:var(--cb-text)]">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[color:color-mix(in_srgb,var(--cb-primary)_50%,transparent)] bg-[color:color-mix(in_srgb,var(--cb-primary)_18%,transparent)] text-[color:var(--cb-p200)] [&>svg]:h-4 [&>svg]:w-4">
          <Icon aria-hidden />
        </span>
        {group.label}
      </h2>

      <Accordion
        type="single"
        collapsible
        value={openQuestion}
        onValueChange={(value) => setOpenQuestion(value || undefined)}
        className="mt-3 gap-0 overflow-hidden rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[color:var(--cb-surface)]"
      >
        {entries.map((entry) => (
          <AccordionItem
            key={entry.question}
            value={entry.question}
            className="rounded-none border-0 border-b border-[color:var(--cb-border)] bg-transparent last:border-b-0 data-[state=open]:border-[color:var(--cb-border)] data-[state=open]:bg-[color:color-mix(in_srgb,var(--cb-primary)_12%,var(--cb-surface))]"
          >
            <AccordionTrigger className="min-h-[56px] rounded-none px-4 py-3 text-[13px] font-medium leading-5 sm:px-5">
              {entry.question}
            </AccordionTrigger>
            {openQuestion === entry.question ? (
              <AccordionContent className="px-4 text-[13px] leading-5 sm:px-5">
                {entry.answer}
              </AccordionContent>
            ) : null}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

export function FaqDirectory() {
  const [query, setQuery] = React.useState("");
  const [activeTopic, setActiveTopic] = React.useState(
    faqGroups[0]?.id ?? "hiring",
  );
  const normalizedQuery = query.trim().toLowerCase();
  const visibleCount = normalizedQuery
    ? faqGroups.reduce(
        (count, group) =>
          count +
          group.entries.filter((entry) =>
            entry.question.toLowerCase().includes(normalizedQuery),
          ).length,
        0,
      )
    : allFaqs.length;

  const handleTopicClick = (id: string) => {
    setActiveTopic(id);
    document.getElementById(`faq-${id}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="relative pb-[var(--cb-space-96)] pt-[var(--cb-space-48)] lg:pb-[120px] lg:pt-[var(--cb-space-64)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--cb-primary)_45%,transparent)_0%,transparent_68%)]"
      />

      <LandingContainer className="relative">
        <header className="mx-auto w-full max-w-[1280px] text-center">
          <Eyebrow variant="outline" className="tracking-[0.3em]">
            FAQ
          </Eyebrow>
          <h1 className="mt-4 w-full bg-[linear-gradient(90deg,#F4F4F4_0%,#E9D5FF_50%,#A5F3FC_100%)] bg-clip-text text-[40px] font-bold leading-[48px] tracking-[0] text-transparent sm:text-[52px] sm:leading-[60px] lg:text-[60px] lg:leading-[68px]">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-3 max-w-[620px] text-sm leading-6 text-[color:var(--cb-text-muted)] sm:text-base">
            Answers about hiring CoDevs, joining the community and working with
            Codebility.
          </p>

          <Search
            value={query}
            onValueChange={setQuery}
            placeholder="Search 27 questions..."
            buttonLabel="Search"
            inputAriaLabel="Search frequently asked questions"
            className="mx-auto mt-6 w-full max-w-[600px] rounded-[var(--cb-radius-12)] shadow-[0_0_22px_color-mix(in_srgb,var(--cb-primary)_12%,transparent)]"
          />
        </header>

        <div className="mt-14 grid gap-[var(--cb-space-24)] lg:grid-cols-[283px_minmax(0,1fr)] lg:items-start lg:gap-[var(--cb-space-28)]">
          <aside className="lg:sticky lg:top-[var(--cb-space-96)] lg:self-start">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[color:var(--cb-text-muted)]">
              Topics
            </p>
            <nav aria-label="FAQ topics" className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2">
              {faqGroups.map((group) => {
                const Icon = group.icon;
                const isActive = activeTopic === group.id;

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => handleTopicClick(group.id)}
                    className={`flex min-h-[48px] min-w-max items-center gap-3 rounded-xl px-4 text-left text-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cb-ring)] lg:w-full ${
                      isActive
                        ? "bg-[color:color-mix(in_srgb,var(--cb-primary)_22%,transparent)] text-[color:var(--cb-text)]"
                        : "text-[color:var(--cb-text-muted)] hover:bg-[color:var(--cb-glass)] hover:text-[color:var(--cb-text)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span>{group.label}</span>
                    <span className="ml-auto pl-2 text-[13px] text-[color:var(--cb-text-muted)]">
                      {group.count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-2 rounded-[var(--cb-radius-16)] border border-[color:var(--cb-border)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--cb-primary)_28%,var(--cb-surface)),var(--cb-surface)_65%)] p-5">
              <h2 className="text-lg font-semibold leading-6 text-[color:var(--cb-text)]">
                Still have questions?
              </h2>
              <p className="mt-0.5 text-sm leading-5 text-[color:var(--cb-text-muted)]">
                Talk to our team. We reply within one business day.
              </p>
              <Button asChild size="sm" className="mt-2 w-full">
                <Link href="/bookacall">
                  Book a Call
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <a
                href="mailto:codebility.dev@gmail.com"
                className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-[color:var(--cb-text-muted)] hover:text-[color:var(--cb-text)]"
              >
                <Mail className="h-3 w-3" aria-hidden />
                codebility.dev@gmail.com
              </a>
            </div>
          </aside>

          <div className="min-w-0 space-y-10">
            {faqGroups.map((group) => (
              <FaqGroup key={group.id} group={group} query={query} />
            ))}
            {visibleCount === 0 ? (
              <div className="rounded-[var(--cb-radius-16)] border border-dashed border-[color:var(--cb-border)] px-6 py-12 text-center text-sm text-[color:var(--cb-text-muted)]">
                No questions match &quot;{query}&quot;. Try another search.
              </div>
            ) : null}
          </div>
        </div>
      </LandingContainer>
    </div>
  );
}
