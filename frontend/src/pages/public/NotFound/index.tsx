import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found | Pooja Makeover';
  }, []);

  return (
    <main>
      <section className="bg-ivory section-padding text-center min-h-[70vh] flex items-center">
        <div className="container-custom max-w-2xl">
          <p className="section-label">Error 404</p>
          <h1 className="section-title">Page Not Found</h1>
          <p className="section-subtitle mx-auto text-center">
            The page you are looking for might have been moved, renamed, or is
            temporarily unavailable. Let us guide you back to our studio.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <Link to="/services" className="btn-secondary">
              <Sparkles className="h-4 w-4" />
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
