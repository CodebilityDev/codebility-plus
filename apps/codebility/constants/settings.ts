type SettingsCardDataProps = {
  path: string;
  imageName: string;
  imageAlt: string;
  title: string;
  description: string;
};

export const settingsCardData: SettingsCardDataProps[] = [
  {
    path: "/home/settings/account-settings",
    imageName: "icon-cog",
    imageAlt: "Icon Account",
    title: "Account Settings",
    description: "Update your account information.",
  },
];

export const adminControlsCardData: SettingsCardDataProps[] = [
  {
    path: "/home/admin-controls/ticket-support",
    imageName: "icon-ticket-support",
    imageAlt: "Icon Ticket Support",
    title: "Ticket Management",
    description: "View and manage submitted support tickets.",
  },
  {
    path: "/home/settings/news-banners",
    imageName: "icon-bell",
    imageAlt: "Icon News",
    title: "News Banners",
    description: "Manage news and announcements displayed on home page.",
  },
  {
    path: "/home/settings/surveys",
    imageName: "icon-checkbox",
    imageAlt: "Icon Surveys",
    title: "Surveys",
    description: "Manage surveys and collect feedback from users.",
  },
  {
    path: "/home/settings/services",
    imageName: "icon-paper-plane",
    imageAlt: "Icon Services",
    title: "Services",
    description: "View all services and download as PDF.",
  },
  {
    path: "/home/admin-controls/client-tracker",
    imageName: "icon-clients",
    imageAlt: "Icon Client Tracker",
    title: "Client Tracker",
    description: "Track weekly client outreach by all admins.",
  },
];
