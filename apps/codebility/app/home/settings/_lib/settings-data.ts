type SettingsCardDataProps = {
  path: string;
  imageName: string;
  imageAlt: string;
  title: string;
  description: string;
};

export const settingsCardData: SettingsCardDataProps[] = [
  {
    path: "/home/settings/resume",
    imageName: "icon-resume",
    imageAlt: "Icon Resume",
    title: "Resume",
    description: "Review and manage your experience and contact info.",
  },
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
    path: "/home/settings/services",
    imageName: "icon-flexbox",
    imageAlt: "Icon Flexbox",
    title: "Services",
    description: "Manage the item displayed in the services page.",
  },
];
