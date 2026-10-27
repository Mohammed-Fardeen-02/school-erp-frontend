import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { KeyRound, CheckCircle2, AlertTriangle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { Input } from '@/components/forms/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import { authService } from '@/services/auth.service';

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setError(null);
    if (!token) return;

    try {
      await authService.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to reset password.';
      setError(msg);
    }
  };

  // Invalid or missing token state
  if (!token) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Invalid Reset Link</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            This password reset link is invalid or has expired. Please request a new recovery link.
          </p>
        </div>
        <div className="pt-2">
          <Link to={ROUTES.FORGOT_PASSWORD}>
            <Button variant="primary" className="w-full">
              Request New Link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Password Reset Complete</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Your new password has been stored successfully. You can now sign in with your updated
            credentials.
          </p>
        </div>
        <div className="pt-2">
          <Button
            variant="primary"
            className="w-full"
            onClick={() => navigate(ROUTES.LOGIN)}
            icon={<ArrowLeft className="h-4 w-4" />}
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Set New Password</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Create a secure password with at least 8 characters.
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Reset Failed">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          autoComplete="new-password"
          error={errors.newPassword?.message}
          rightAction={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('newPassword')}
        />

        <Input
          label="Confirm New Password"
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="••••••••••••"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          rightAction={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="rounded p-1 text-muted-foreground hover:text-foreground focus:outline-none"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          {...register('confirmPassword')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={isSubmitting}
            icon={<KeyRound className="h-4 w-4" />}
          >
            Update Password
          </Button>
        </div>
      </form>

      <div className="text-center pt-2">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Cancel and Return
        </Link>
      </div>
    </div>
  );
};
