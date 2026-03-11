export interface ModalFeature {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureModal {
  id: string;
  badge: string;
  headline: string;
  subheadline: string;
  cta_label: string;
  cta_href: string;
  dismiss_label: string;
  features: ModalFeature[];
  is_active: boolean;
  image_url: string;   
  created_at: string;
  updated_at: string;
}