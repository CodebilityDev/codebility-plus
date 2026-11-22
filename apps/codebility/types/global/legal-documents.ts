export interface LegalSectionLink {
  id: string;
  title: string;
}

export interface LegalTocProps {
  sections: readonly LegalSectionLink[];
}

export interface LegalSidebarProps extends LegalTocProps {
  contactEmail: string;
  contactDescription: string;
}
