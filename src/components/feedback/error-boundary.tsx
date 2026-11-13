import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // Log error to console for debugging
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleClearCacheAndLogin = (): void => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'An unexpected rendering error occurred.';
      const errorStack = this.state.error?.stack;

      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Application Error
            </h2>

            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              The application encountered an unexpected runtime issue and could not render this screen.
            </p>

            <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-3 text-left">
              <p className="font-mono text-xs font-semibold text-danger break-words">
                {errorMessage}
              </p>
              {import.meta.env.DEV && errorStack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-[11px] font-medium text-muted-foreground hover:text-foreground">
                    View Component Stack
                  </summary>
                  <pre className="mt-1 max-h-48 overflow-auto font-mono text-[10px] text-muted-foreground whitespace-pre-wrap">
                    {errorStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReload}
                icon={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Reload Page
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = '/workspace';
                }}
                icon={<Home className="h-3.5 w-3.5" />}
              >
                Go to Workspace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={this.handleClearCacheAndLogin}
                icon={<LogIn className="h-3.5 w-3.5" />}
              >
                Reset Session & Login
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
