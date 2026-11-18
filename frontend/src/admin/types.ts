import type { AppointmentStatus, GalleryCategory, BusinessHours } from '@/types';

export interface AdminPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface AdminAppointment {
  id: string;
  customer_name: string;
  mobile: string;
  email?: string | null;
  service: string;
  preferred_date: string;
  preferred_time: string;
  special_requirements?: string | null;
  message?: string | null;
  status: AppointmentStatus;
  created_at: string;
  updated_at: string;
}

export interface AdminService {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  image_url?: string | null;
  price?: number | string | null;
  duration?: string | null;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  services: AdminService[];
  created_at?: string;
  updated_at?: string;
}

export type AdminGalleryCategory = Exclude<GalleryCategory, 'all' | 'before-after'>;

export interface AdminGalleryImage {
  id: string;
  image_url: string;
  alt_text?: string | null;
  category: AdminGalleryCategory;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface AdminBeforeAfter {
  id: string;
  before_image_url: string;
  after_image_url: string;
  title?: string | null;
  category: string;
  is_active: boolean;
  created_at?: string;
}

export interface AdminTestimonial {
  id: string;
  customer_name: string;
  service?: string | null;
  feedback: string;
  rating: number;
  customer_photo_url?: string | null;
  is_approved: boolean;
  created_at?: string;
}

export interface AdminPackage {
  id: string;
  name: string;
  slug: string;
  category?: string | null;
  description?: string | null;
  features: string[];
  price?: number | string | null;
  image_url?: string | null;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  image_url?: string | null;
  author?: string | null;
  published_at?: string | null;
  tags: string[];
  read_time?: number | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminOffer {
  id: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  valid_until?: string | null;
  code?: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface AdminStaffMember {
  id: string;
  name: string;
  role?: string | null;
  specialization?: string | null;
  photo_url?: string | null;
  bio?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface AdminCustomer {
  id?: string;
  customer_name: string;
  mobile: string;
  email?: string | null;
  booking_count: number;
  completed_bookings?: number;
  last_visit?: string | null;
  last_service?: string | null;
}

export interface DashboardSummary {
  appointments: {
    total: number;
    today: number;
    by_status: Record<string, number>;
  };
  services: {
    total: number;
    categories: number;
  };
  packages: number;
  testimonials: {
    total: number;
    approved: number;
  };
  gallery_images: number;
  blog_posts: number;
  offers: number;
  staff: number;
}

export interface DashboardReportsResponse {
  summary: {
    total_appointments: number;
    unique_customers: number;
    completion_rate_percent: number;
    average_rating: number | null;
  };
  appointments_by_status: Record<string, number>;
  top_services: Array<{ service: string; bookings: number }>;
}

export interface ReportsSummary {
  total_appointments: number;
  by_status: Record<string, number>;
  popular_services: Array<{ service: string; count: number }>;
  monthly_appointments?: Array<{ month: string; count: number }>;
  approval_rate?: number;
  completion_rate?: number;
  total_customers?: number;
}

export interface BusinessSettingsForm {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  whatsappNumber: string;
  instagramUrl: string;
  facebookUrl: string;
  businessHours: BusinessHours[];
}

