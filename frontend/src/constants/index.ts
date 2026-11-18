import type { NavItem, ServiceCategory, Testimonial, Package, BusinessInfo } from '../types';

/* ===== Navigation ===== */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Hair Services', href: '/services/hair-services' },
      { label: 'Skin Care', href: '/services/skin-care' },
      { label: 'Facial & Cleanup', href: '/services/facial-cleanup' },
      { label: 'Hair Styling', href: '/services/hair-styling' },
      { label: 'Hair Colouring', href: '/services/hair-colouring' },
      { label: 'Makeup Services', href: '/services/makeup-services' },
      { label: 'Manicure & Pedicure', href: '/services/manicure-pedicure' },
      { label: 'Waxing & Threading', href: '/services/waxing-threading' },
      { label: 'Pre-Bridal Services', href: '/services/pre-bridal-services' },
    ],
  },
  { label: 'Bridal Makeup', href: '/bridal-makeup' },
  { label: 'Makeovers', href: '/gallery' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Packages', href: '/packages' },
  { label: 'Contact', href: '/contact' },
];

/* ===== Service Categories ===== */
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'hair-care',
    name: 'Hair Care & Styling',
    slug: 'hair-services',
    description: 'Expert hair treatments, cuts, styling and nourishing therapies for every hair type.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    services: [],
  },
  {
    id: 'skin-care',
    name: 'Skin Care & Facials',
    slug: 'skin-care',
    description: 'Professional facial treatments and skin care routines tailored to your skin needs.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    services: [],
  },
  {
    id: 'bridal-makeup',
    name: 'Bridal Makeup',
    slug: 'bridal-makeup',
    description: 'Stunning bridal looks crafted to make your special day unforgettable.',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    services: [],
  },
  {
    id: 'party-makeup',
    name: 'Party Makeup',
    slug: 'party-makeup',
    description: 'Glamorous makeup for parties, receptions and special celebrations.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
    services: [],
  },
  {
    id: 'hair-colouring',
    name: 'Hair Colouring',
    slug: 'hair-colouring',
    description: 'From subtle highlights to bold transformations — colour that speaks your style.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    services: [],
  },
  {
    id: 'manicure-pedicure',
    name: 'Manicure & Pedicure',
    slug: 'manicure-pedicure',
    description: 'Pamper your hands and feet with our luxurious nail care and spa treatments.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
    services: [],
  },
  {
    id: 'pre-bridal',
    name: 'Pre-Bridal Packages',
    slug: 'pre-bridal-services',
    description: 'Comprehensive beauty packages to prepare you for your big day.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    services: [],
  },
  {
    id: 'makeovers',
    name: 'Professional Makeovers',
    slug: 'makeup-services',
    description: 'Complete makeover experiences for photoshoots, events and personal transformations.',
    image: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80',
    services: [],
  },
];

/* ===== Bridal Services ===== */
export const BRIDAL_SERVICES = [
  {
    id: 'traditional-bridal',
    name: 'Traditional Bridal Makeup',
    description: 'Classic Indian bridal looks with traditional artistry and modern techniques.',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
  },
  {
    id: 'hd-bridal',
    name: 'HD Bridal Makeup',
    description: 'High-definition makeup for a flawless, camera-ready bridal look.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
  },
  {
    id: 'airbrush-bridal',
    name: 'Airbrush Makeup',
    description: 'Lightweight, long-lasting airbrush technique for seamless coverage.',
    image: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&q=80',
  },
  {
    id: 'engagement-makeup',
    name: 'Engagement Makeup',
    description: 'Elegant engagement looks that capture your joy and radiance.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
  },
  {
    id: 'reception-makeup',
    name: 'Reception Makeup',
    description: 'Glamorous looks designed for your reception celebration.',
    image: 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?w=800&q=80',
  },
  {
    id: 'party-look',
    name: 'Party Makeup',
    description: 'Statement looks for cocktails, sangeet and festive celebrations.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
  },
  {
    id: 'pre-wedding',
    name: 'Pre-Wedding Makeovers',
    description: 'Complete beauty preparation for your pre-wedding shoots and ceremonies.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
  },
];

/* ===== Why Choose Us ===== */
export const VALUE_PROPOSITIONS = [
  {
    title: 'Personalized Beauty Consultation',
    description: 'Every service begins with understanding your unique style, preferences and beauty goals.',
  },
  {
    title: 'Professional Makeup Artists',
    description: 'Our skilled artists bring expertise and passion to every look they create.',
  },
  {
    title: 'Quality Beauty Products',
    description: 'We use only trusted, professional-grade products for the best results.',
  },
  {
    title: 'Hygiene & Customer Care',
    description: 'Strict hygiene standards and personalized attention for every client.',
  },
  {
    title: 'Customized Beauty Packages',
    description: 'Tailored packages designed around your needs, timeline and budget.',
  },
  {
    title: 'Comfortable Salon Experience',
    description: 'A welcoming, relaxing environment where your comfort comes first.',
  },
];

/* ===== Sample Testimonials ===== */
export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Priya S.',
    service: 'Bridal Makeup',
    feedback: 'Pooja Makeover made my wedding day absolutely beautiful. The bridal makeup was exactly what I envisioned — elegant, long-lasting and perfect for photographs.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Meera R.',
    service: 'Hair Styling',
    feedback: 'I love how they listened to what I wanted and created a hairstyle that perfectly complemented my outfit. Truly professional service.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ananya K.',
    service: 'Facial Treatment',
    feedback: 'The facial treatment left my skin feeling refreshed and glowing. The products they use are premium quality and the experience was very relaxing.',
    rating: 4,
  },
];

/* ===== Sample Packages ===== */
export const SAMPLE_PACKAGES: Package[] = [
  {
    id: 'bridal-pkg-1',
    name: 'Classic Bridal Package',
    slug: 'classic-bridal',
    category: 'bridal',
    description: 'Complete bridal preparation with traditional makeup, hair styling and draping.',
    features: ['Bridal Makeup', 'Hair Styling', 'Saree/Dupatta Draping', 'Touch-up Kit', 'Nail Art'],
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
    isPopular: true,
  },
  {
    id: 'pre-bridal-pkg-1',
    name: 'Bridal Glow Package',
    slug: 'bridal-glow',
    category: 'pre-bridal',
    description: 'A comprehensive pre-bridal beauty regimen to prepare your skin and hair for the big day.',
    features: ['Facial Course (4 sessions)', 'Body Polishing', 'Hair Spa', 'Manicure & Pedicure', 'Threading & Waxing'],
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
  },
  {
    id: 'hair-pkg-1',
    name: 'Hair Transformation Package',
    slug: 'hair-transformation',
    category: 'hair-care',
    description: 'Complete hair makeover including cut, colour, treatment and styling.',
    features: ['Hair Consultation', 'Haircut & Styling', 'Hair Colour', 'Deep Conditioning Treatment', 'Blow Dry'],
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
  },
  {
    id: 'skin-pkg-1',
    name: 'Radiant Skin Package',
    slug: 'radiant-skin',
    category: 'skin-care',
    description: 'Professional facial treatments to restore your skin\'s natural radiance.',
    features: ['Skin Analysis', 'Deep Cleansing Facial', 'Hydrating Mask', 'Under-Eye Treatment', 'SPF Application'],
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
  },
  {
    id: 'party-pkg-1',
    name: 'Party Glam Package',
    slug: 'party-glam',
    category: 'party-makeup',
    description: 'Get ready to turn heads at any event with our complete party makeover.',
    features: ['Party Makeup', 'Hair Styling', 'Nail Art', 'Eyelash Application', 'Setting Spray'],
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&q=80',
  },
];

/* ===== Gallery Images ===== */
export const GALLERY_IMAGES = [
  { id: '1', src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80', alt: 'Bridal makeup look', category: 'bridal' as const },
  { id: '2', src: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80', alt: 'Party makeup look', category: 'party' as const },
  { id: '3', src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80', alt: 'Hair colour transformation', category: 'hairstyle' as const },
  { id: '4', src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&q=80', alt: 'Professional makeup', category: 'makeup' as const },
  { id: '5', src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'Engagement look', category: 'bridal' as const },
  { id: '6', src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80', alt: 'Salon interior', category: 'makeup' as const },
  { id: '7', src: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', alt: 'Facial treatment', category: 'makeup' as const },
  { id: '8', src: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600&q=80', alt: 'Airbrush bridal', category: 'bridal' as const },
  { id: '9', src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&q=80', alt: 'HD makeup look', category: 'makeup' as const },
  { id: '10', src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80', alt: 'Nail art', category: 'party' as const },
  { id: '11', src: 'https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?w=600&q=80', alt: 'Reception look', category: 'bridal' as const },
  { id: '12', src: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&q=80', alt: 'Professional makeover', category: 'makeup' as const },
];

/* ===== Business Info ===== */
export const BUSINESS_INFO: BusinessInfo = {
  name: 'Pooja Makeover',
  tagline: 'Your Beauty, Our Art.',
  phone: '+91 98765 43210',
  email: 'hello@poojamakeover.com',
  address: '123, Beauty Lane, MG Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  googleMapsUrl: 'https://maps.google.com',
  whatsappNumber: '919876543210',
  instagramUrl: 'https://instagram.com/poojamakeover',
  facebookUrl: 'https://facebook.com/poojamakeover',
  businessHours: [
    { day: 'Monday', open: '10:00 AM', close: '8:00 PM', isClosed: false },
    { day: 'Tuesday', open: '10:00 AM', close: '8:00 PM', isClosed: false },
    { day: 'Wednesday', open: '10:00 AM', close: '8:00 PM', isClosed: false },
    { day: 'Thursday', open: '10:00 AM', close: '8:00 PM', isClosed: false },
    { day: 'Friday', open: '10:00 AM', close: '8:00 PM', isClosed: false },
    { day: 'Saturday', open: '9:00 AM', close: '9:00 PM', isClosed: false },
    { day: 'Sunday', open: '9:00 AM', close: '6:00 PM', isClosed: false },
  ],
};

/* ===== Blog Posts ===== */
export const SAMPLE_BLOG_POSTS = [
  {
    id: '1',
    title: 'Essential Bridal Skincare Routine for Glowing Skin',
    slug: 'bridal-skincare-routine',
    excerpt: 'Start your bridal beauty journey months before the wedding with this comprehensive skincare guide.',
    content: '',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    author: 'Pooja Makeover',
    publishedAt: '2024-10-15',
    tags: ['bridal', 'skincare', 'beauty tips'],
    readTime: '5 min read',
  },
  {
    id: '2',
    title: 'Top Hair Colour Trends This Season',
    slug: 'hair-colour-trends',
    excerpt: 'Discover the most popular hair colour trends and find your perfect shade.',
    content: '',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
    author: 'Pooja Makeover',
    publishedAt: '2024-10-01',
    tags: ['hair', 'colour', 'trends'],
    readTime: '4 min read',
  },
  {
    id: '3',
    title: 'How to Choose the Right Makeup for Your Skin Tone',
    slug: 'makeup-skin-tone-guide',
    excerpt: 'A professional guide to selecting makeup shades that complement your natural skin tone.',
    content: '',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80',
    author: 'Pooja Makeover',
    publishedAt: '2024-09-20',
    tags: ['makeup', 'beauty tips', 'guide'],
    readTime: '6 min read',
  },
];

/* ===== Available Times ===== */
export const AVAILABLE_TIMES = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM',
];

/* ===== Service List for Booking ===== */
export const BOOKING_SERVICES = [
  'Hair Cut & Styling',
  'Hair Colouring',
  'Hair Spa & Treatment',
  'Facial & Cleanup',
  'Skin Care Treatment',
  'Bridal Makeup',
  'Party Makeup',
  'Engagement Makeup',
  'Manicure & Pedicure',
  'Waxing & Threading',
  'Pre-Bridal Package',
  'Makeover Session',
  'Other',
];

