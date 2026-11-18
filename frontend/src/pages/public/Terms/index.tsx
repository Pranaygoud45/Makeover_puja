import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '@/constants';

export default function Terms() {
  useEffect(() => {
    document.title = 'Terms & Conditions | Pooja Makeover';
  }, []);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Legal</p>
          <h1 className="section-title">Terms &amp; Conditions</h1>
          <p className="section-subtitle mx-auto text-center">
            Studio guidelines for appointments, bridal reservations, and
            services at {BUSINESS_INFO.name}.
          </p>
        </div>
      </section>

      {/* ===== Terms Content ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl space-y-10 font-body text-base leading-relaxed text-espresso/85">
          <div>
            <p className="text-sm text-taupe mb-4">
              Last Updated: January 1, 2025
            </p>
            <p>
              By scheduling an appointment or using the website of{' '}
              {BUSINESS_INFO.name}, you agree to the following studio terms and
              service guidelines designed to ensure a smooth, respectful
              experience for every guest.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              1. Appointment Requests &amp; Confirmation
            </h2>
            <p>
              Online booking submissions constitute an appointment request. Our
              team reviews availability and confirms your slot via phone or
              WhatsApp. Please arrive 10 minutes prior to your scheduled time so
              we can begin your consultation without rushing.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              2. Rescheduling &amp; Cancellations
            </h2>
            <p>
              If you need to reschedule or cancel a regular studio appointment,
              please notify us at least 24 hours in advance. For bridal and
              multi-artist group bookings, rescheduling policies and advance
              retainers are discussed and agreed upon during consultation.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              3. Health, Allergies &amp; Skin Sensitivity
            </h2>
            <p>
              Please inform our artists and specialists of any known skin
              allergies, medical conditions, recent dermatological treatments,
              or sensitivities prior to any facial, hair colour, waxing, or
              makeup service. Patch tests are recommended before chemical hair
              or specialised skincare treatments.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              4. Pricing &amp; Custom Packages
            </h2>
            <p>
              Service pricing and package quotes depend on hair length, skin
              requirements, product selection (such as HD vs. Airbrush makeup),
              and on-location travel where requested. Final quotes are shared
              transparently prior to service commencement.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              5. Studio Conduct &amp; Valuables
            </h2>
            <p>
              We strive to maintain a calm and welcoming atmosphere for all
              clients. While we take great care in our studio, guests are
              advised to keep personal jewellery and valuables securely with them
              during treatments.
            </p>
          </div>

          <div className="border-t border-champagne pt-8 flex flex-wrap gap-4">
            <Link to="/book-appointment" className="btn-rose">
              Book Appointment
            </Link>
            <Link to="/privacy-policy" className="btn-secondary">
              Read Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
