import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/app/router/routes';
import { Input } from '@/components/forms/input';
import { Checkbox } from '@/components/forms/checkbox';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore(state => state.login);

  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      const { workspaceCount } = await login({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      // Check if user came from a protected route
      const fromPath = (location.state as { from?: { pathname?: string } })?.from?.pathname;

      if (fromPath && fromPath !== ROUTES.LOGIN && fromPath !== ROUTES.LANDING) {
        navigate(fromPath, { replace: true });
        return;
      }

      // Route based on workspace count
      if (workspaceCount === 1) {
        navigate(ROUTES.WORKSPACE, { replace: true });
      } else {
        navigate(ROUTES.SELECT_WORKSPACE, { replace: true });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setAuthError(message);
    }
  };

  const handleDemoFill = (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', 'Password123!', { shouldValidate: true });
    setAuthError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Sign In to Your Account</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your institutional credentials to access your permitted workspace.
        </p>
      </div>

      {authError && (
        <Alert variant="error" title="Sign In Failed">
          {authError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <Input
          label="Institutional Email"
          type="email"
          placeholder="name@schoolerp.io"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password Field with Show/Hide Toggle */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('password')}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between pt-1">
          <Checkbox label="Remember me" {...register('rememberMe')} />

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={isSubmitting}
            icon={<LogIn className="h-4 w-4" />}
          >
            Sign In
          </Button>
        </div>
      </form>

      {/* Demo Credentials Quick-Fill Chips */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Quick Test Personas (Dev Mode):
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleDemoFill('admin@schoolerp.io')}
            className="rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            Multi-School Admin
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('teacher@schoolerp.io')}
            className="rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            Single-School Teacher
          </button>
          <button
            type="button"
            onClick={() => handleDemoFill('pending@schoolerp.io')}
            className="rounded-lg border border-border bg-surface-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            No-School Account
          </button>
        </div>
      </div>
    </div>
  );
};
