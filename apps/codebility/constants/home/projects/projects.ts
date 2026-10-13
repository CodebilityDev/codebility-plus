export const PROJECT_LIST_COLUMNS =
  "id, name, tagline, status, project_code, main_image, tech_stack, start_date, end_date";

export const PROJECT_DETAIL_COLUMNS =
  "id, name, description, tagline, status, project_code, start_date, end_date, github_link, website_url, figma_link, meeting_link, main_image, secondary_image, gallery, tech_stack, key_features";

export const CONTRIBUTOR_COLUMNS =
  "id, project_id, codev_id, role, joined_at, codev(id, first_name, last_name, image_url, display_position, username)";

export const CANDIDATE_COLUMNS =
  "id, first_name, last_name, image_url, display_position, username, roles(name)";

export const CANDIDATE_PAGE_SIZE = 20;

export const COVER_IMAGE_MIN_WIDTH = 1200;
export const COVER_IMAGE_MIN_HEIGHT = 675;
export const COVER_IMAGE_MAX_FILE_SIZE = 5 * 1024 * 1024;
export const COVER_IMAGE_ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
