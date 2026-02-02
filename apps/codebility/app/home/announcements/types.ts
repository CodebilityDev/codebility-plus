export type AnnouncementCategory = 
  | "whats-new" 
  | "under-maintenance" 
  | "connect-with-us";

export interface AnnouncementPage {
  category: AnnouncementCategory;
  title: string;
  banner_image: string; // Image path - will be editable in future
  content: string; // Editable content
  last_updated: string;
}

export interface AnnouncementTab {
  id: AnnouncementCategory;
  label: string;
}