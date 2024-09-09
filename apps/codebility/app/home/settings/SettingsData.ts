type SettingsCardDataProps = {
  path: string;
  imageName: string;
  imageAlt: string;
  title: string;
  description: string;
};

export const settingsCardData: SettingsCardDataProps[] = [
  {
    path: "/settings/resume",
    imageName: "icon-resume",
    imageAlt: "Icon Resume",
    title: "Resume",
    description: "Review and manage your experience and contact info.",
  },
  {
    path: "/settings/roles",
    imageName: "icon-roles",
    imageAlt: "Icon Roles",
    title: "Roles",
    description: "Manage the position to create and update.",
  },
  {
    path: "/settings/permissions",
    imageName: "icon-key",
    imageAlt: "Icon Permissions",
    title: "Permissions",
    description: "Setup a permission to roles.",
  },
  {
    path: "/settings/services",
    imageName: "icon-flexbox",
    imageAlt: "Icon Flexbox",
    title: "Services",
    description: "Manage the item displayed in the services page.",
  },
];
