export interface PrivacyPolicySection {
  id: string;
  title: string;
  summary: string;
  subheading?: string;
  paragraphs: string[];
  items?: { title?: string; text: string }[];
  contact?: boolean;
}
