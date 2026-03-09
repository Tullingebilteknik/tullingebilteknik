export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  icon: string;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_interest: string | null;
  message: string;
  status: "new" | "contacted" | "done";
  notes: string | null;
  source_page: string;
  created_at: string;
  reg_number: string | null;
  car_model: string | null;
  selected_services: string[] | null;
  preferred_time: string | null;
}
