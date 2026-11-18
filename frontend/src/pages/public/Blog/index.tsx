import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SAMPLE_BLOG_POSTS } from '@/constants';
import BlogCard from '@/components/common/BlogCard';
import SectionHeader from '@/components/ui/SectionHeader';

export default function Blog() {
  useEffect(() => {
    document.title = 'Beauty Blog | Pooja Makeover';
  }, []);

  return (
    <main>
      {/* ===== Hero ===== */}
      <section className="bg-ivory section-padding text-center">
        <div className="container-custom">
          <p className="section-label">Editorial &amp; Guides</p>
          <h1 className="section-title">Beauty Blog</h1>
          <p className="section-subtitle mx-auto text-center">
            Skincare rituals, bridal prep timelines, hair care advice, and
            makeup guides written by our studio artists.
          </p>
        </div>
      </section>

      {/* ===== Blog Grid ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeader
            label="Latest Articles"
            title="Insights From Our Studio"
            subtitle="Thoughtful beauty tips to help your skin, hair, and makeup look effortless every day."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SAMPLE_BLOG_POSTS.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section-padding bg-ivory text-center">
        <div className="container-custom max-w-2xl">
          <h2 className="font-display text-display-sm text-espresso">
            Want Personalised Beauty Advice?
          </h2>
          <p className="mt-3 font-body text-taupe">
            Visit Pooja Makeover for a one-on-one skincare, hair, or bridal
            consultation tailored to your needs.
          </p>
          <div className="mt-8">
            <Link to="/book-appointment" className="btn-rose">
              Book Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
