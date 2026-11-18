import { VALUE_PROPOSITIONS } from '@/constants';

export default function WhyChooseSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-14 max-w-2xl">
          <p className="section-label">WHY POOJA MAKEOVER</p>
          <h2 className="section-title">Where Every Detail Matters.</h2>
        </div>

        {/* 2×3 grid */}
        <div className="grid gap-px border border-champagne md:grid-cols-2 lg:grid-cols-3">
          {VALUE_PROPOSITIONS.map((item, idx) => (
            <article
              key={idx}
              className="border border-champagne p-8 md:p-10"
            >
              <h3 className="font-display text-xl text-espresso">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-taupe font-body">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
