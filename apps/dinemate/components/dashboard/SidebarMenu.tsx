import { RiFileList2Line, RiLayout2Line } from "react-icons/ri";
import MenuLink from "./MenuLink";
import { Settings, HandHelping, HelpingHand } from "lucide-react";
import { GoChecklist } from "react-icons/go";
import { IoAnalyticsOutline, IoFastFoodOutline } from "react-icons/io5";

const menuLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <RiLayout2Line size={16} />,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: <GoChecklist size={16} />,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: <IoFastFoodOutline />,
  },
  // {
  //   name: 'Statistics',
  //   href: '/dashboard/statistics',
  //   icon: <IoAnalyticsOutline size={16}/>
  // },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <Settings size={16} />,
  },
  {
    name: "Assist",
    href: "/dashboard/assist",
    icon: <HelpingHand size={16} />
  }
];
const SidebarMenu = () => {
  return (
    <div className="flex flex-col gap-2 pt-8 flex-1">
      {menuLinks.map((item) => (
        <MenuLink
          key={item.name}
          name={item.name}
          href={item.href}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default SidebarMenu;
