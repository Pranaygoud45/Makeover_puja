import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-espresso text-white hover:bg-espresso-light focus:ring-espresso',
        secondary:
          'border-2 border-espresso text-espresso hover:bg-espresso hover:text-white focus:ring-espresso',
        rose: 'bg-rose text-white hover:bg-rose-dark focus:ring-rose',
        ghost:
          'text-espresso hover:bg-champagne focus:ring-espresso/30',
      },
      size: {
        sm: 'px-4 py-2 text-sm rounded-sm',
        md: 'px-6 py-2.5 text-base rounded-sm',
        lg: 'px-8 py-3 text-lg rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  as?: 'button' | 'a' | typeof Link;
  href?: string;
  to?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, as, href, to, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), className);

    if (as === Link || to) {
      return (
        <Link to={to || href || '#'} className={classes}>
          {children}
        </Link>
      );
    }

    if (as === 'a' || href) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
