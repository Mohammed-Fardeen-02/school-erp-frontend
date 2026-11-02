import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/forms/input';
import { Alert } from '@/components/feedback/alert';
import { AuthLayout } from '../components';
import { AuthApi } from '../api';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../schemas/auth.schema';

export const ForgotPasswordPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    try {
      const response = await AuthApi.forgotPassword(data);
      setIsSuccess(true);
      setSuccessMessage(response.message);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to initiate password recovery. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Password Recovery</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your registered institutional email to receive secure password recovery instructions.
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <Alert variant="error" title="Request Failed">
            {error}
          </Alert>
        </div>
      )}

      {isSuccess ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-success/30 bg-success/5 p-4 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="mt-2 text-sm font-bold text-foreground">Recovery Instructions Sent</h4>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {successMessage}
            </p>
            <div className="mt-3 rounded-lg bg-surface p-2 text-[11px] text-muted-foreground border border-border">
              Sent to: <span className="font-semibold text-foreground">{getValues('email')}</span>
            </div>
          </div>

          {/* Development simulated reset link */}
          <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 text-center">
            <span className="text-[11px] font-bold text-primary">Development Test Link:</span>
            <div className="mt-1">
              <Link
                to={`${ROUTES.RESET_PASSWORD}?token=mock-valid-token`}
                className="text-xs font-semibold text-primary underline hover:text-primary-hover"
              >
                Proceed to Reset Password Page (Simulated Token) →
              </Link>
            </div>
          </div>

          <div className="pt-2 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <Input
            label="Institutional Email"
            type="email"
            placeholder="name@schoolerp.io"
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full justify-center shadow-md shadow-primary/20"
            isLoading={isSubmitting}
            icon={<Send className="h-4 w-4" />}
          >
            {isSubmitting ? 'Dispatching Link...' : 'Send Recovery Link'}
          </Button>

          <div className="pt-2 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
