import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { SAMPLE_BLOG_POSTS } from '@/constants';
import BlogCard from '@/components/common/BlogCard';

const FALLBACK_ARTICLE_PARAGRAPHS: Record<string, string[]> = {
  'bridal-skincare-routine': [
    'Preparing your skin for your wedding day begins well before the final fitting. Starting a consistent routine three to six months in advance gives your skin time to renew, calm any sensitivity, and build natural luminosity.',
    'Begin with the fundamentals: a gentle pH-balanced cleanser, a hydrating serum rich in hyaluronic acid or niacinamide, and broad-spectrum sunscreen every single morning. Even the finest bridal makeup sits noticeably smoother on well-moisturised skin.',
    'Around eight weeks before the wedding, schedule regular salon facials spaced three to four weeks apart. Avoid introducing harsh active acids or unfamiliar treatments in the final fortnight so your barrier stays calm and photo-ready.',
    'In the final week, focus entirely on hydration, restful sleep, and gentle soothing masks — allowing our bridal makeup artists to enhance a naturally glowing canvas.',
  ],
  'hair-colour-trends': [
    'This season celebrates rich, dimensional hair colour that grows out gracefully and catches natural light. Soft caramel ribbons, warm mocha brunettes, and sun-kissed espresso tones lead studio requests.',
    'Rather than stark single-process shades, modern balayage and glossing treatments add movement without compromising hair health. Pairing colour services with bond-protecting conditioning keeps strands silky and vibrant.',
    'Before choosing a shade, our stylists assess your skin undertone, natural hair texture, and maintenance preference so your new colour complements your wardrobe and everyday routine.',
  ],
  'makeup-skin-tone-guide': [
    'Finding makeup that truly belongs on your skin starts with identifying your undertone — warm, cool, or neutral — rather than focusing solely on surface depth.',
    'Warm and golden undertones glow in peach, terracotta, bronze, and warm rose shades, while cooler undertones shine in berry, mauve, rosewood, and soft taupe hues. Neutral undertones enjoy effortless versatility across both palettes.',
    'Always test foundation along the jawline in natural daylight and give it ten minutes to settle. At Pooja Makeover, we custom-blend undertones so your base looks seamless both in person and under camera flash.',
  ],
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = SAMPLE_BLOG_POSTS.find((p) => p.slug === slug);

  useEffect(() => {
    document.title = post
      ? `${post.title} | Pooja Makeover Blog`
      : 'Article Not Found | Pooja Makeover';
  }, [post]);

  if (!post) {
    return (
      <main>
        <section className="bg-ivory section-padding text-center">
          <div className="container-custom max-w-2xl">
            <p className="section-label">404</p>
            <h1 className="section-title">Article Not Found</h1>
            <p className="section-subtitle mx-auto text-center">
              The blog post you&apos;re looking for doesn&apos;t exist or may
              have moved.
            </p>
            <div className="mt-8">
              <Link to="/blog" className="btn-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to Beauty Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const paragraphs = post.content
    ? post.content.split('\n\n').filter(Boolean)
    : FALLBACK_ARTICLE_PARAGRAPHS[post.slug] ?? [post.excerpt];

  const relatedPosts = SAMPLE_BLOG_POSTS.filter((p) => p.slug !== post.slug);

  return (
    <main>
      {/* ===== Hero Header ===== */}
      <section className="bg-ivory section-padding">
        <div className="container-custom max-w-4xl">
          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 font-body text-xs font-medium uppercase tracking-widest text-rose hover:text-espresso transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Blog
          </Link>

          <div className="mb-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white px-3 py-1 font-body text-xs uppercase tracking-wider text-rose border border-champagne"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="section-title">{post.title}</h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 font-body text-sm text-taupe">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4 text-rose" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-rose" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-rose" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* ===== Featured Image & Article Body ===== */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <div className="mb-10 overflow-hidden bg-champagne">
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <article className="space-y-6 font-body text-base leading-relaxed text-espresso/85 md:text-lg">
            <p className="font-display text-xl italic text-espresso">
              {post.excerpt}
            </p>
            <div className="divider" />
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>

          <div className="mt-12 border-t border-champagne pt-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl text-espresso">
                Ready to experience this in studio?
              </h2>
              <p className="font-body text-sm text-taupe">
                Book a personalised appointment with our artists.
              </p>
            </div>
            <Link to="/book-appointment" className="btn-rose">
              Book Appointment
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Related Posts ===== */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-ivory">
          <div className="container-custom">
            <h2 className="mb-10 font-display text-display-sm text-espresso">
              More From Our Beauty Blog
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {relatedPosts.map((rel) => (
                <BlogCard key={rel.id} post={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
