import { Link } from 'react-router';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useTranslation } from '../hooks/useTranslation';

export function NotFound() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
          <h2 className="text-3xl font-semibold mb-2">{t('pageNotFound')}</h2>
          <p className="text-slate-600 dark:text-slate-400">
            {t('pageNotFoundDesc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link to="/" className="gap-2">
              <Home className="w-4 h-4" />
              {t('goHome')}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('dashboard')}
            </Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-lg border">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Search className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold">{t('lookingForSomething')}</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t('popularPages')}
          </p>
        </div>
      </div>
    </div>
  );
}
