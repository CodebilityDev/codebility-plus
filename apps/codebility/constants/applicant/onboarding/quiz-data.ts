export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the PRIMARY purpose of joining Codebility?",
    options: [
      "To get immediate paid employment",
      "To build your portfolio and upskill yourself through real projects",
      "To earn a quick salary",
      "To work remotely without any commitments",
    ],
    correctAnswer: 1,
    explanation: "Codebility is designed for developers to build their portfolio and upskill themselves. It's a FREE learning and development opportunity, NOT a quick employment or job program.",
  },
  {
    id: 2,
    question: "What is the financial arrangement at Codebility?",
    options: [
      "You must pay to join",
      "You get paid from day one",
      "It's completely FREE - focused on learning and portfolio building",
      "There are hidden fees",
    ],
    correctAnswer: 2,
    explanation: "Codebility is completely FREE. The focus is on providing you opportunities to learn, grow, and build your portfolio through real-world projects.",
  },
  {
    id: 3,
    question: "What is the MINIMUM commitment period required at Codebility?",
    options: [
      "1-2 weeks, flexible",
      "1 month, can leave anytime",
      "3-6 months minimum with consistent dedication",
      "No specific commitment needed",
    ],
    correctAnswer: 2,
    explanation: "You must commit for a MINIMUM of 3-6 months. This ensures project continuity and allows you enough time to build meaningful portfolio pieces.",
  },
  {
    id: 4,
    question: "How many MANDATORY meetings are required per week?",
    options: [
      "No mandatory meetings",
      "One meeting per week",
      "Two mandatory meetings per week",
      "Meetings are optional",
    ],
    correctAnswer: 2,
    explanation: "There are TWO mandatory meetings per week. Attendance is required to stay connected with your team, receive guidance, and ensure project alignment.",
  },
  {
    id: 5,
    question: "If you're looking for immediate paid employment, is Codebility right for you?",
    options: [
      "Yes, Codebility provides immediate jobs",
      "No, Codebility is for portfolio building and upskilling, not quick employment",
      "Yes, you get paid from the first day",
      "It depends on your skills",
    ],
    correctAnswer: 1,
    explanation: "NO. If you need immediate paid employment, Codebility is NOT the right fit. This is a portfolio-building and upskilling opportunity, not a job placement service.",
  },
  {
    id: 6,
    question: "What happens if you cannot commit to the 3-6 months minimum or attend mandatory meetings?",
    options: [
      "Nothing, it's completely flexible",
      "You can negotiate different terms",
      "You should NOT proceed - this wastes everyone's time and effort",
      "You can decide later",
    ],
    correctAnswer: 2,
    explanation: "If you cannot commit to 3-6 months or attend twice-weekly meetings, DO NOT PROCEED. Inconsistent participation wastes resources and affects your team and clients who depend on you.",
  },
];
