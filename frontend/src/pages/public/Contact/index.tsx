import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  MessageCircle,
  Send,
  CheckCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BUSINESS_INFO } from '@/constants';
import { useState } from 'react';

/* ===== Zod Schema ===== */
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
    document.title = 'Contact Us | Pooja Makeover';
  }, []);

  const onSubmit = async (_data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
  };

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Contact</p>
          <h1 className="section-title">Get in Touch</h1>
          <p className="section-subtitle mx-auto text-center">
            We&apos;d love to hear from you. Reach out with any questions or to
            schedule your beauty appointment.
          </p>
        </div>
      </section>

      {/* ===== Contact Form + Info ===== */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — Form */}
            <div>
              <h2 className="text-2xl md:text-3xl text-espresso mb-2">
                Send Us a Message
              </h2>
              <p className="text-taupe mb-8 font-body">
                Fill in the form below and we&apos;ll get back to you as soon as
                possible.
              </p>

              {isSubmitted ? (
                <div className="rounded-lg bg-ivory p-8 text-center">
                  <CheckCircle className="mx-auto mb-4 h-12 w-12 text-rose" />
                  <h3 className="text-xl text-espresso mb-2">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-taupe font-body">
                    Thank you for reaching out. We&apos;ll respond within 24
                    hours.
                  </p>
                  <button
                    type="button"
                    className="btn-primary mt-6"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-espresso font-body"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      className={cn(
                        'w-full border bg-white px-4 py-3 text-sm text-espresso placeholder:text-taupe/60 font-body',
                        'focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose',
                        'transition-colors duration-300',
                        errors.name ? 'border-red-400' : 'border-champagne'
                      )}
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-espresso font-body"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className={cn(
                        'w-full border bg-white px-4 py-3 text-sm text-espresso placeholder:text-taupe/60 font-body',
                        'focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose',
                        'transition-colors duration-300',
                        errors.email ? 'border-red-400' : 'border-champagne'
                      )}
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-espresso font-body"
                    >
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="10-digit mobile number"
                      className={cn(
                        'w-full border bg-white px-4 py-3 text-sm text-espresso placeholder:text-taupe/60 font-body',
                        'focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose',
                        'transition-colors duration-300',
                        errors.phone ? 'border-red-400' : 'border-champagne'
                      )}
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-espresso font-body"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help you?"
                      className={cn(
                        'w-full resize-none border bg-white px-4 py-3 text-sm text-espresso placeholder:text-taupe/60 font-body',
                        'focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose',
                        'transition-colors duration-300',
                        errors.message ? 'border-red-400' : 'border-champagne'
                      )}
                      {...register('message')}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'btn-primary w-full',
                      isSubmitting && 'opacity-60 cursor-not-allowed'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right — Contact Info */}
            <div className="space-y-10">
              {/* Contact Details */}
              <div>
                <h3 className="text-xl text-espresso mb-6">
                  Contact Information
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-ivory text-rose">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-espresso font-body">
                        Phone
                      </p>
                      <a
                        href={`tel:${BUSINESS_INFO.phone}`}
                        className="text-taupe hover:text-rose transition-colors font-body"
                      >
                        {BUSINESS_INFO.phone}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-ivory text-rose">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-espresso font-body">
                        Email
                      </p>
                      <a
                        href={`mailto:${BUSINESS_INFO.email}`}
                        className="text-taupe hover:text-rose transition-colors font-body"
                      >
                        {BUSINESS_INFO.email}
                      </a>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-ivory text-rose">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-espresso font-body">
                        Address
                      </p>
                      <p className="text-taupe font-body">
                        {BUSINESS_INFO.address}
                        <br />
                        {BUSINESS_INFO.city}, {BUSINESS_INFO.state} —{' '}
                        {BUSINESS_INFO.pincode}
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Map Placeholder */}
              <div className="overflow-hidden border border-champagne bg-ivory">
                <div className="flex h-48 items-center justify-center">
                  <div className="text-center">
                    <MapPin className="mx-auto mb-2 h-8 w-8 text-taupe/40" />
                    <a
                      href={BUSINESS_INFO.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-rose hover:text-espresso transition-colors font-body"
                    >
                      View on Google Maps →
                    </a>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div>
                <h3 className="text-xl text-espresso mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-rose" />
                  Business Hours
                </h3>
                <ul className="space-y-2">
                  {BUSINESS_INFO.businessHours.map((schedule) => (
                    <li
                      key={schedule.day}
                      className="flex items-center justify-between border-b border-champagne/50 pb-2 font-body text-sm"
                    >
                      <span className="font-medium text-espresso">
                        {schedule.day}
                      </span>
                      <span className="text-taupe">
                        {schedule.isClosed
                          ? 'Closed'
                          : `${schedule.open} – ${schedule.close}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social + WhatsApp */}
              <div>
                <h3 className="text-xl text-espresso mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                  <a
                    href={BUSINESS_INFO.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center bg-ivory text-espresso hover:bg-rose hover:text-white transition-colors"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                  <a
                    href={BUSINESS_INFO.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center bg-ivory text-espresso hover:bg-rose hover:text-white transition-colors"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center bg-green-500 text-white hover:bg-green-600 transition-colors"
                    aria-label="Chat on WhatsApp"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl text-espresso mb-4">
            Ready to Look Your Best?
          </h2>
          <p className="text-taupe max-w-xl mx-auto mb-8 font-body">
            Book an appointment today and let our experts take care of your
            beauty needs.
          </p>
          <Link to="/book-appointment" className="btn-rose">
            Book an Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}
