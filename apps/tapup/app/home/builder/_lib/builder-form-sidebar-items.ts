import { Palette , LayoutPanelTop, CaseSensitive } from "lucide-react";

export type targets = "colors" | "data" | "fonts";

interface SidebarItems {
    target: targets;
    Icon: React.ElementType;
}

export default [
    {
        target: "colors",
        Icon: Palette
    },
    {
        target: "data",
        Icon: LayoutPanelTop
    },
    {
        target: "fonts",
        Icon: CaseSensitive
    }
] satisfies SidebarItems[];