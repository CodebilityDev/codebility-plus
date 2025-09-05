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
    path: "/home/settings/account-settings",
    imageName: "icon-cog",
    imageAlt: "Icon Account",
    title: "Account Settings",
    description: "Update your account information.",
  }
];
