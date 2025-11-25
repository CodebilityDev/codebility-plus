type SettingsCardDataProps = {
  path: string;
  imageName: string;
  imageAlt: string;
  title: string;
  description: string;
};

export const settingsCardData: SettingsCardDataProps[] = [
  {
    path: "/home/settings/roles",
    imageName: "icon-roles",
    imageAlt: "Icon Roles",
    title: "Roles",
    description: "Manage the position to create and update.",
  },
  {
    path: "/home/settings/permissions",
    imageName: "icon-key",
    imageAlt: "Icon Permissions",
    title: "Permissions",
    description: "Setup a permission to roles.",
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
    path: "/home/settings/account-settings",
    imageName: "icon-cog",
    imageAlt: "Icon Account",
    title: "Account Settings",
    description: "Update your account information.",
  }
];
