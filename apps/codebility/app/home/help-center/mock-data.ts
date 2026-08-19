// Temporary mock data for the Help Center UI.
// Once the schema is finalized, swap these for Supabase queries
// (e.g. `faq_categories` + `faq_items`, `community_questions` + `community_replies`).

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

export const faqCategories: FaqCategory[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    items: [
      {
        id: "gs-1",
        question: "What is Codebility?",
        answer:
          "Codebility is a platform that showcases and connects Filipino software developers with clients. Your portal is where you manage your profile, projects, and tasks.",
      },
      {
        id: "gs-2",
        question: "How do I complete my profile?",
        answer:
          "Go to Settings > Profile and fill in your bio, skills, and portfolio links. A complete profile improves your visibility to clients.",
      },
      {
        id: "gs-3",
        question: "Where can I see my assigned tasks?",
        answer:
          "Your assigned tasks live on the Kanban board under Projects. Tasks are grouped by sprint and status column.",
      },
    ],
  },
  {
    id: "change-username",
    label: "How to Change Username",
    items: [
      {
        id: "cu-1",
        question: "Can I change my username after signing up?",
        answer:
          "Yes. Go to Settings > Account, click Edit next to your username, and save your changes.",
      },
      {
        id: "cu-2",
        question: "How often can I change my username?",
        answer:
          "You can change your username once every 30 days to keep profile links and mentions stable.",
      },
    ],
  },
  {
    id: "submit-tickets",
    label: "How to Submit Tickets",
    items: [
      {
        id: "st-1",
        question: "How do I submit a support ticket?",
        answer:
          "Open the Help Center, scroll to Community Questions, and click New Question. Add a clear title, description, and any relevant tags.",
      },
      {
        id: "st-2",
        question: "Can I attach files to a ticket?",
        answer:
          "Yes, you can attach screenshots or files when creating a question to help others understand your issue faster.",
      },
      {
        id: "st-3",
        question: "How long until I get a response?",
        answer:
          "Most community questions get a reply within a day. Admin-flagged issues are prioritized and usually answered sooner.",
      },
    ],
  },
  {
    id: "account-billing",
    label: "Account & Billing",
    items: [
      {
        id: "ab-1",
        question: "How do I reset my password?",
        answer:
          "Click Forgot Password on the login screen and follow the email instructions to set a new password.",
      },
    ],
  },
];

export type QuestionStatus = "open" | "answered" | "closed";

export type QuestionReply = {
  id: string;
  author: string;
  content: string;
  createdAt: string;
};

export type CommunityQuestion = {
  id: string;
  ticketNumber: string;
  title: string;
  excerpt: string;
  author: { name: string; avatarUrl?: string };
  tags: string[];
  status: QuestionStatus;
  createdAt: string;
  attachmentCount: number;
  replyCount: number;
  replies: QuestionReply[];
};

export const communityQuestions: CommunityQuestion[] = [
  {
    id: "1",
    ticketNumber: "2020-3454",
    title: "How do I move a task between sprints?",
    excerpt:
      "I have a task that didn't get finished this sprint and I want to carry it over without losing its history.",
    author: { name: "Syamsir Alam" },
    tags: ["Kanban", "Tasks"],
    status: "open",
    createdAt: "2026-08-03T11:52:00Z",
    attachmentCount: 1,
    replyCount: 3,
    replies: [
      {
        id: "1-r1",
        author: "Kris Miranda",
        content:
          "Drag it to the new sprint column on the board — it keeps its comment history automatically.",
        createdAt: "2026-08-03T12:10:00Z",
      },
      {
        id: "1-r2",
        author: "Jury Domingo",
        content: "Confirmed, this also preserves the original due date unless you edit it.",
        createdAt: "2026-08-03T13:05:00Z",
      },
    ],
  },
  {
    id: "2",
    ticketNumber: "2020-3452",
    title: "Portfolio images not uploading",
    excerpt:
      "Every time I try to upload a portfolio image over 2MB it just spins and fails silently.",
    author: { name: "Syifa Hadju" },
    tags: ["Profile", "Bug"],
    status: "answered",
    createdAt: "2026-08-02T20:01:00Z",
    attachmentCount: 2,
    replyCount: 5,
    replies: [
      {
        id: "2-r1",
        author: "Admin",
        content:
          "This was a known limit on our upload size. Try compressing the image below 2MB in the meantime.",
        createdAt: "2026-08-02T21:00:00Z",
      },
    ],
  },
  {
    id: "3",
    ticketNumber: "2020-0032",
    title: "Where do I find my time-in / time-out logs?",
    excerpt:
      "I want to double check my hours for last week before payroll closes.",
    author: { name: "Kris Miranda" },
    tags: ["Attendance"],
    status: "closed",
    createdAt: "2026-08-01T09:50:00Z",
    attachmentCount: 0,
    replyCount: 2,
    replies: [
      {
        id: "3-r1",
        author: "Admin",
        content: "Settings > Time Tracker > History has a full exportable log per week.",
        createdAt: "2026-08-01T10:15:00Z",
      },
    ],
  },
];