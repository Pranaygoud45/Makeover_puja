import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import LazyImage from '@/components/ui/LazyImage';
import type { BlogPost } from '@/types';

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogCard({ post, className }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-sm border border-champagne bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg',
        className
      )}
    >
      {/* Image */}
      <div className="overflow-hidden">
        <div className="transition-transform duration-500 group-hover:scale-105">
          <LazyImage src={post.image} alt={post.title} aspectRatio="16/9" />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-taupe">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold text-espresso line-clamp-2">
          {post.title}
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-taupe line-clamp-3">
          {post.excerpt}
        </p>

        <Link
          to={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-rose transition-colors hover:text-rose-dark"
        >
          Read More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
