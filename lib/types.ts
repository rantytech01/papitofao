export type PublishStatus = "draft" | "published" | "unpublished";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type VolunteerStatus = "new" | "contacted" | "processed" | "archived";
export type MessageStatus = "unread" | "read" | "archived";

export interface CandidateProfile {
  id: number;
  candidate_name: string;
  candidate_title: string | null;
  position: string;
  ward: string;
  election_year: number;
  movement_name: string;
  movement_tagline: string | null;
  slogan: string | null;
  short_biography: string | null;
  full_biography: string | null;
  hero_description: string | null;
  profile_photo_url: string | null;
  logo_url: string | null;
  movement_logo_url: string | null;
}

export interface CampaignSettings {
  id: number;
  primary_phone: string | null;
  secondary_phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  office_address: string | null;
  office_hours: string | null;
  contact_description: string | null;
  election_date: string | null;
}

export interface SiteSettings {
  id: number;
  website_name: string;
  website_title: string | null;
  website_description: string | null;
  favicon_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  accent_color: string | null;
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  social_share_image_url: string | null;
  footer_copyright: string | null;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  is_external: boolean;
  open_in_new_tab: boolean;
  is_visible: boolean;
  display_order: number;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  icon: string | null;
  button_text: string | null;
  button_url: string | null;
  background_style: string | null;
  is_visible: boolean;
  display_order: number;
  status: PublishStatus;
}

export interface AboutSection {
  id: string;
  title: string;
  subtitle: string | null;
  content: string | null;
  image_url: string | null;
  image_position: "left" | "right" | "top" | "none";
  display_order: number;
  is_visible: boolean;
  status: PublishStatus;
}

export interface SocialLink {
  id: string;
  platform: string;
  display_name: string | null;
  url: string;
  icon: string | null;
  is_enabled: boolean;
  display_order: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  featured_image_url: string | null;
  author: string | null;
  category: string | null;
  tags: string[];
  status: PublishStatus;
  published_at: string | null;
}

export interface CampaignEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  address: string | null;
  featured_image_url: string | null;
  poster_url: string | null;
  registration_url: string | null;
  status: EventStatus;
  is_published: boolean;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  category_id: string | null;
  is_featured: boolean;
  is_visible: boolean;
  display_order: number;
}
