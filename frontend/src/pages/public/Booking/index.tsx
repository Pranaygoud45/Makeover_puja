import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CalendarDays,
  Clock,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BOOKING_SERVICES, AVAILABLE_TIMES, BUSINESS_INFO } from '@/constants';
import { apiRequest } from '@/services/api-client';
import type { Appointment } from '@/types';

/* ===== Zod Schema ===== */
const bookingSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z
    .string()
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  email: z
    .string()
    .email('Please enter a valid email')
    .optional()
    .or(z.literal('')),
  service: z.string().min(1, 'Please select a service'),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  specialRequirements: z.string().optional(),
  message: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Booking() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      mobile: '',
      email: '',
      service: '',
      preferredDate: '',
      preferredTime: '',
      specialRequirements: '',
      message: '',
    },
  });

  useEffect(() => {
    document.title = 'Book Appointment | Pooja Makeover';
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await apiRequest<Appointment>('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          customer_name: data.customerName.trim(),
          mobile: data.mobile.trim(),
          email: data.email?.trim() ? data.email.trim() : null,
          service: data.service,
          preferred_date: data.preferredDate,
          preferred_time: data.preferredTime,
          special_requirements: data.specialRequirements?.trim() || null,
          message: data.message?.trim() || null,
        }),
      });
      setIsSubmitted(true);
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? 'Unable to submit your request right now. Please try again or reach us directly on WhatsApp.'
          : 'Something went wrong while submitting your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full border bg-white px-4 py-3 text-sm text-espresso placeholder:text-taupe/60 font-body',
      'focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose',
      'transition-colors duration-300',
      hasError ? 'border-red-400' : 'border-champagne'
    );

  const labelClass = 'mb-2 block text-sm font-medium text-espresso font-body';

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Appointments</p>
          <h1 className="section-title">Book Your Appointment</h1>
          <p className="section-subtitle mx-auto text-center">
            Schedule your visit and let us pamper you with our professional
            beauty services.
          </p>
        </div>
      </section>

      {/* ===== Booking Form ===== */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          {isSubmitted ? (
            /* ===== Success State ===== */
            <div className="rounded-lg border border-champagne bg-ivory p-8 md:p-12 text-center">
              <CheckCircle2 className="mx-auto mb-6 h-16 w-16 text-rose" />
              <h2 className="text-2xl md:text-3xl text-espresso mb-3">
                Request Submitted
              </h2>
              <p className="text-taupe font-body max-w-md mx-auto mb-2">
                Thank you for your appointment request. Our team will review
                your preferred slot and confirm your booking shortly.
              </p>
              <p className="text-sm text-taupe/70 font-body mb-8">
                You will receive a confirmation call or WhatsApp message within
                a few hours.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setIsSubmitted(false)}
                >
                  Book Another Appointment
                </button>
                <Link to="/" className="btn-secondary">
                  Back to Home
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Info cards */}
              <div className="mb-10 grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-4 border border-champagne bg-ivory p-4">
                  <CalendarDays className="h-6 w-6 shrink-0 text-rose" />
                  <div>
                    <p className="text-sm font-medium text-espresso font-body">
                      Flexible Scheduling
                    </p>
                    <p className="text-xs text-taupe font-body">
                      Choose your preferred date &amp; time
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 border border-champagne bg-ivory p-4">
                  <Clock className="h-6 w-6 shrink-0 text-rose" />
                  <div>
                    <p className="text-sm font-medium text-espresso font-body">
                      Quick Confirmation
                    </p>
                    <p className="text-xs text-taupe font-body">
                      We&apos;ll confirm within a few hours
                    </p>
                  </div>
                </div>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 border border-red-300 bg-red-50 p-4 text-sm text-red-700 font-body"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                  <p>{submitError}</p>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                {/* Name & Mobile */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="customerName" className={labelClass}>
                      Full Name <span className="text-rose">*</span>
                    </label>
                    <input
                      id="customerName"
                      type="text"
                      placeholder="Your full name"
                      className={inputClass(!!errors.customerName)}
                      {...register('customerName')}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="mobile" className={labelClass}>
                      Mobile Number <span className="text-rose">*</span>
                    </label>
                    <input
                      id="mobile"
                      type="tel"
                      placeholder="10-digit mobile number"
                      className={inputClass(!!errors.mobile)}
                      {...register('mobile')}
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address{' '}
                    <span className="text-taupe text-xs">(optional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className={inputClass(!!errors.email)}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-body">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <label htmlFor="service" className={labelClass}>
                    Select Service <span className="text-rose">*</span>
                  </label>
                  <select
                    id="service"
                    className={inputClass(!!errors.service)}
                    {...register('service')}
                  >
                    <option value="">Choose a service…</option>
                    {BOOKING_SERVICES.map((svc) => (
                      <option key={svc} value={svc}>
                        {svc}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-xs text-red-500 font-body">
                      {errors.service.message}
                    </p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="preferredDate" className={labelClass}>
                      Preferred Date <span className="text-rose">*</span>
                    </label>
                    <input
                      id="preferredDate"
                      type="date"
                      min={today}
                      className={inputClass(!!errors.preferredDate)}
                      {...register('preferredDate')}
                    />
                    {errors.preferredDate && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.preferredDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="preferredTime" className={labelClass}>
                      Preferred Time <span className="text-rose">*</span>
                    </label>
                    <select
                      id="preferredTime"
                      className={inputClass(!!errors.preferredTime)}
                      {...register('preferredTime')}
                    >
                      <option value="">Select a time…</option>
                      {AVAILABLE_TIMES.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {errors.preferredTime && (
                      <p className="mt-1 text-xs text-red-500 font-body">
                        {errors.preferredTime.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Special Requirements */}
                <div>
                  <label htmlFor="specialRequirements" className={labelClass}>
                    Special Requirements{' '}
                    <span className="text-taupe text-xs">(optional)</span>
                  </label>
                  <textarea
                    id="specialRequirements"
                    rows={3}
                    placeholder="Any allergies, preferences, or special requests…"
                    className={cn(inputClass(false), 'resize-none')}
                    {...register('specialRequirements')}
                  />
                </div>

                {/* Additional Message */}
                <div>
                  <label htmlFor="message" className={labelClass}>
                    Additional Message{' '}
                    <span className="text-taupe text-xs">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    rows={3}
                    placeholder="Anything else you'd like us to know…"
                    className={cn(inputClass(false), 'resize-none')}
                    {...register('message')}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    'btn-rose w-full',
                    isSubmitting && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting Request…
                    </>
                  ) : (
                    <>
                      Submit Booking Request
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* WhatsApp Alternative */}
              <div className="mt-8 text-center">
                <div className="divider-wide mb-6" />
                <p className="text-sm text-taupe font-body mb-3">
                  Or reach us directly on WhatsApp
                </p>
                <a
                  href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%2C%20I%20would%20like%20to%20book%20an%20appointment.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 px-6 py-3 text-sm font-medium text-white uppercase tracking-wide hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
