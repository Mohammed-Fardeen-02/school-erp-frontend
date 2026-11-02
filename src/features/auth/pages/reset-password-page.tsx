import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Alert } from '@/components/feedback/alert';
import { AuthLayout } from '../components';
import { AuthApi } from '../api';
import { resetPasswordSchema, type ResetPasswordFormData } from '../schemas/auth.schema';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const isTokenMissing = !token;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    setError(null);
    try {
      await AuthApi.resetPassword({
        token,
        password: data.password,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to update password. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Set New Password</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Create a secure password with at least 8 characters, an uppercase letter, and a number.
        </p>
      </div>

      {isTokenMissing ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-warning/10 text-warning">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h4 className="mt-2 text-sm font-bold text-foreground">Invalid Reset Link</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              This password reset link is missing a valid security token or has expired. Please request a new recovery link.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
          >
            Request New Recovery Link
          </Button>
        </div>
      ) : isSuccess ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="mt-2 text-sm font-bold text-foreground">Password Successfully Updated</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Your institutional password has been securely updated. You can now sign in with your new credentials.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center shadow-md shadow-primary/20"
            onClick={() => navigate(ROUTES.LOGIN)}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Sign In with New Password
          </Button>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4">
              <Alert variant="error" title="Reset Failed">
                {error}
              </Alert>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="new-password"
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

            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              autoComplete="new-password"
              leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
              rightAction={
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="text-muted-foreground transition-colors hover:text-foreground focus:outline-hidden"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full justify-center shadow-md shadow-primary/20"
              isLoading={isSubmitting}
            >
              {isSubmitting ? 'Updating Password...' : 'Reset Password'}
            </Button>

            <div className="pt-2 text-center">
              <Link
                to={ROUTES.LOGIN}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Cancel and Return to Sign In
              </Link>
            </div>
          </form>
        </>
      )}
    </AuthLayout>
  );
};
