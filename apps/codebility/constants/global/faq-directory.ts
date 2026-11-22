import {
  Briefcase,
  CalendarDays,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface FaqDirectoryEntry {
  question: string;
  answer: string;
}

export interface FaqDirectoryCategory {
  id: string;
  label: string;
  count: number;
  icon: LucideIcon;
  entries: FaqDirectoryEntry[];
}

export const faqDirectoryCategories: FaqDirectoryCategory[] = [
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
];;
