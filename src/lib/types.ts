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
  status: "new" | "booked" | "in_progress" | "completed";
  notes: string | null;
  source_page: string;
  created_at: string;
  reg_number: string | null;
  car_model: string | null;
  selected_services: string[] | null;
  preferred_time: string | null;
}

export interface Mechanic {
  id: string;
  name: string;
  email: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  lead_id: string;
  mechanic_id: string;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  order_number: number;
  created_at: string;
}

export interface BookingWithDetails extends Booking {
  lead: Pick<Lead, "id" | "name" | "email" | "phone" | "reg_number" | "car_model" | "selected_services" | "service_interest" | "status">;
  mechanic: Pick<Mechanic, "id" | "name">;
}
