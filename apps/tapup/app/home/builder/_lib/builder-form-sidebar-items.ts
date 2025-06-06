import { CaseSensitive, LayoutPanelTop, Palette } from "lucide-react";

import BuilderColorForm from "../_components/builder-color-form";
import BuilderDataForm from "../_components/builder-data-form";
import BuilderFontForm from "../_components/builder-font-form";

export type FormTargets = "colors" | "data" | "fonts";

export interface SidebarItem {
  target: FormTargets;
  Icon: React.ElementType;
  Form: React.ElementType;
}

export default [
  {
    target: "colors",
    Icon: Palette,
    Form: BuilderColorForm,
  },
  {
    target: "data",
    Icon: LayoutPanelTop,
    Form: BuilderDataForm,
  },
  {
    target: "fonts",
    Icon: CaseSensitive,
    Form: BuilderFontForm,
  },
] satisfies SidebarItem[];
