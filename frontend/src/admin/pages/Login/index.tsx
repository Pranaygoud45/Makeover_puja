import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await login(values.email, values.password);
      navigate('/admin', { replace: true });
    } catch (err) {
      const msg =
        err instanceof Error && err.message.includes('401')
          ? 'Invalid email or password. Please try again.'
          : 'Unable to sign in. Please verify your credentials and try again.';
      setAuthError(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory px-4 py-12 font-body text-espresso">
      <div className="w-full max-w-md">
        {/* Branding Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-espresso text-champagne shadow-md">
            <Sparkles className="h-6 w-6 text-rose-light" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wide text-espresso">
            POOJA <span className="font-light text-rose">MAKEOVER</span>
          </h1>
          <p className="mt-1.5 text-sm text-espresso/60">
            Admin Portal &middot; Your Beauty, Our Art.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-xl border border-champagne/80 bg-white p-8 shadow-lg">
          <h2 className="font-display text-xl font-semibold text-espresso">
            Sign in to Dashboard
          </h2>
          <p className="mt-1 text-sm text-espresso/60">
            Enter your admin credentials to manage the salon.
          </p>

          {authError && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-espresso"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@poojamakeover.com"
                  {...register('email')}
                  className="w-full rounded-sm border border-champagne bg-ivory/40 py-2.5 pl-10 pr-4 text-sm text-espresso placeholder:text-taupe focus:border-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-espresso"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-espresso/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register('password')}
                  className="w-full rounded-sm border border-champagne bg-ivory/40 py-2.5 pl-10 pr-10 text-sm text-espresso placeholder:text-taupe focus:border-rose focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-sm bg-espresso py-2.5 text-sm font-medium text-white transition-colors hover:bg-espresso-light focus:outline-none focus:ring-2 focus:ring-espresso focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-espresso/60">
          <Link to="/" className="text-rose-dark underline-offset-4 hover:underline">
            &larr; Back to Pooja Makeover website
          </Link>
        </p>
      </div>
    </div>
  );
}

