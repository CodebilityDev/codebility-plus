export type AnnouncementCategory = string;

export interface AnnouncementPage {
  id?: number;
  category: AnnouncementCategory;
  title: string;
  banner_image: string;
  content: string;
  last_updated: string;
}

export interface AnnouncementTab {
  id: AnnouncementCategory;
  label: string;
}