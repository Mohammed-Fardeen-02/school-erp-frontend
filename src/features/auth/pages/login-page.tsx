import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { useAuthStore } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Checkbox } from '@/components/forms/checkbox';
import { Alert } from '@/components/feedback/alert';
import { AuthLayout, DevPersonaBar } from '../components';
import { loginSchema, type LoginFormData } from '../schemas/auth.schema';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await login(data);
      const state = location.state as { from?: { pathname?: string } } | undefined;
      const target = state?.from?.pathname || ROUTES.WORKSPACE;
      navigate(target, { replace: true });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAuthError(err.message);
      } else {
        setAuthError('An unexpected authentication error occurred.');
      }
    }
  };

  const handleSelectPersona = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    setAuthError(null);
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Institutional Sign In</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your registered institutional credentials to access your permitted workspace.
        </p>
      </div>

      {authError && (
        <div className="mb-4">
          <Alert variant="error" title="Sign In Failed">
            {authError}
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email Field */}
        <Input
          label="Institutional Email"
          type="email"
          placeholder="name@schoolerp.io"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password Field */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
          rightAction={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(prev => !prev)}
              className="text-muted-foreground transition-colors hover:text-foreground focus:outline-hidden"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Actions Row */}
        <div className="flex items-center justify-between text-xs">
          <Checkbox
            label="Remember me for 30 days"
            id="rememberMe"
            defaultChecked
            {...register('rememberMe')}
          />
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full justify-center shadow-md shadow-primary/20"
          isLoading={isSubmitting}
          icon={<ArrowRight className="h-4 w-4" />}
        >
          {isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}
        </Button>
      </form>

      {/* Quick-Fill Dev Persona Bar */}
      <DevPersonaBar onSelectPersona={handleSelectPersona} />
    </AuthLayout>
  );
};
