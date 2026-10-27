import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle2, Send } from 'lucide-react';
import { ROUTES } from '@/app/router/routes';
import { Input } from '@/components/forms/input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/feedback/alert';
import { authService } from '@/services/auth.service';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage: React.FC = () => {
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setError(null);
    try {
      const response = await authService.requestPasswordReset({ email: values.email });
      setSuccessMessage(response.message);
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to request password reset.';
      setError(msg);
    }
  };

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Password Reset Dispatched</h3>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{successMessage}</p>
        </div>

        <div className="rounded-xl border border-border bg-surface-muted p-3 text-left">
          <p className="text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground">Simulated Dev Link:</span> In this mock
            environment, you can test the password reset UI directly by visiting:
          </p>
          <div className="mt-2 text-center">
            <Link
              to={`${ROUTES.RESET_PASSWORD}?token=demo-reset-token-2026`}
              className="text-xs font-bold text-primary hover:underline"
            >
              Click here to test Reset Password Screen &rarr;
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" className="w-full" icon={<ArrowLeft className="h-4 w-4" />}>
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Reset Your Password</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Enter your registered institutional email to receive a password recovery link.
        </p>
      </div>

      {error && (
        <Alert variant="error" title="Request Failed">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Institutional Email"
          type="email"
          placeholder="name@schoolerp.io"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={isSubmitting}
            icon={<Send className="h-4 w-4" />}
          >
            Send Recovery Link
          </Button>
        </div>
      </form>

      <div className="text-center pt-2">
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
