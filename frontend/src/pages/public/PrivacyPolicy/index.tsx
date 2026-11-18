import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_INFO } from '@/constants';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy | Pooja Makeover';
  }, []);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Legal</p>
          <h1 className="section-title">Privacy Policy</h1>
          <p className="section-subtitle mx-auto text-center">
            How {BUSINESS_INFO.name} collects, uses, and protects your personal
            information.
          </p>
        </div>
      </section>

      {/* ===== Policy Content ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl space-y-10 font-body text-base leading-relaxed text-espresso/85">
          <div>
            <p className="text-sm text-taupe mb-4">
              Effective Date: January 1, 2025
            </p>
            <p>
              At {BUSINESS_INFO.name}, we respect your privacy and are committed
              to safeguarding the personal information you share with us when
              booking appointments, submitting enquiries, or visiting our
              website.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              1. Information We Collect
            </h2>
            <p>
              When you request an appointment or contact our studio, we may
              collect personal details including your full name, mobile number,
              email address, preferred service, appointment date and time, and
              any skin sensitivities or special styling notes you choose to
              provide.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                To schedule, confirm, and manage your beauty and bridal
                appointments.
              </li>
              <li>
                To prepare personalised consultations regarding hair, skin, or
                makeup allergies and preferences.
              </li>
              <li>
                To respond to enquiries submitted via our contact form, phone, or
                WhatsApp.
              </li>
              <li>
                To improve our studio services and client experience.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              3. Sharing &amp; Confidentiality
            </h2>
            <p>
              We never sell, rent, or trade your personal contact details with
              third-party marketers. Client photographs are only showcased in our
              portfolio or social channels with your explicit consent.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              4. Data Security &amp; Retention
            </h2>
            <p>
              We maintain reasonable administrative and technical safeguards to
              protect your appointment records against unauthorised access or
              disclosure. Records are retained only as long as necessary to
              deliver our services or comply with legal obligations.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-2xl text-espresso">
              5. Your Rights &amp; Contact
            </h2>
            <p>
              You may request access to, correction of, or deletion of your
              personal contact information at any time by emailing us at{' '}
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="text-rose underline hover:text-espresso"
              >
                {BUSINESS_INFO.email}
              </a>{' '}
              or calling{' '}
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="text-rose underline hover:text-espresso"
              >
                {BUSINESS_INFO.phone}
              </a>
              .
            </p>
          </div>

          <div className="border-t border-champagne pt-8">
            <Link to="/contact" className="btn-secondary">
              Have Questions? Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
