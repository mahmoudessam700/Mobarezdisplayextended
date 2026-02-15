import { useRouteError, isRouteErrorResponse, Link } from 'react-router';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import { Button } from './ui/button';

export function ErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message || 'Something went wrong';
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else {
    errorMessage = 'An unexpected error occurred';
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          
          {errorStatus && (
            <h1 className="text-6xl font-bold text-red-500 mb-4">{errorStatus}</h1>
          )}
          
          <h2 className="text-3xl font-semibold mb-2">Oops! Something went wrong</h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            {errorMessage}
          </p>
          
          <p className="text-sm text-slate-500 dark:text-slate-500">
            We apologize for the inconvenience. Please try refreshing the page or go back home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="default"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh Page
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/" className="gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error instanceof Error && (
          <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left">
            <h3 className="font-semibold text-sm mb-2 text-red-600 dark:text-red-400">
              Error Details (Development Only):
            </h3>
            <pre className="text-xs overflow-auto text-slate-700 dark:text-slate-300">
              {error.stack}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
