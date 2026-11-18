/* ===== Service Types ===== */
export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  services: Service[];
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  price?: number;
  duration?: string;
  isPopular?: boolean;
}

/* ===== Gallery Types ===== */
export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  width?: number;
  height?: number;
}

export type GalleryCategory = 'bridal' | 'party' | 'hairstyle' | 'makeup' | 'before-after' | 'all';

export interface BeforeAfter {
  id: string;
  before: string;
  after: string;
  title: string;
  category: string;
}

/* ===== Testimonial Types ===== */
export interface Testimonial {
  id: string;
  name: string;
  service: string;
  feedback: string;
  rating: number;
  photo?: string;
  date?: string;
}

/* ===== Appointment Types ===== */
export interface AppointmentFormData {
  customerName: string;
  mobile: string;
  email?: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  specialRequirements?: string;
  message?: string;
}

export interface Appointment extends AppointmentFormData {
  id: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

/* ===== Package Types ===== */
export interface Package {
  id: string;
  name: string;
  slug: string;
  category: PackageCategory;
  description: string;
  features: string[];
  price?: number;
  image: string;
  isPopular?: boolean;
}

export type PackageCategory = 'bridal' | 'pre-bridal' | 'hair-care' | 'skin-care' | 'party-makeup' | 'seasonal';

/* ===== Blog Types ===== */
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  tags: string[];
  readTime: string;
}

/* ===== Staff Types ===== */
export interface StaffMember {
  id: string;
  name: string;
  role: string;
  specialization: string;
  photo: string;
  bio: string;
}

/* ===== Offer Types ===== */
export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  validUntil?: string;
  code?: string;
}

/* ===== Business Settings ===== */
export interface BusinessInfo {
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

export interface BusinessHours {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

/* ===== Navigation Types ===== */
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/* ===== API Response Types ===== */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

