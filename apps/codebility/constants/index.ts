export const pageSize = {
  codevsList: 16,
  applicants: 10,
  clients: 12,
  clientsArchive: 6,
  interns: 8,
  tasks: 9,
  weeklyTop: 10,
  projects: 12,
  services: 9,
} as const;

export const projects = [
  {
    id: 1,
    name: "Tap Up",
    desc: "Tap Up was carefully designed by our team from scratch. We incorporated cutting-edge technology into our cards to guarantee seamless connections. Our commitment to innovation provides a user-friendly experience, allowing you to easily access meaningful opportunities.",
    image: "slider-tapup.gif",
    logo: "logo-tapup-light.svg",
    link: "https://tapup.vercel.app/",
  },
];

export const CATEGORIES = [
  { id: 1, name: "Web Application" },
  { id: 2, name: "Mobile Application" },
  { id: 3, name: "Product Design" },
] as const;
