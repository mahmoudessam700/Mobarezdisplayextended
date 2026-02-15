import { Link, Outlet, useLocation } from 'react-router';
import { Monitor, BarChart3, Settings, HelpCircle, User, Menu, X, Activity, Search } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from '../components/LanguageToggle';
import { ThemeToggle } from '../components/ThemeToggle';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { UserMenu } from '../components/UserMenu';
import { SearchBar } from '../components/SearchBar';
import { QuickActions } from '../components/QuickActions';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { KeyboardShortcuts } from '../components/KeyboardShortcuts';
import { useState } from 'react';
import { Button } from '../components/ui/button';

export function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navItems = [
    { icon: Monitor, label: t('devices'), path: '/dashboard' },
    { icon: Activity, label: t('sessions'), path: '/dashboard/sessions' },
    { icon: BarChart3, label: t('analytics'), path: '/dashboard/analytics' },
    { icon: Settings, label: t('settings'), path: '/dashboard/settings' },
    { icon: User, label: t('account'), path: '/dashboard/account' },
    { icon: HelpCircle, label: t('help'), path: '/dashboard/help' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b">
        <div className="flex items-center justify-between px-3 sm:px-4 h-14 sm:h-16 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight hidden sm:flex">
                <span className="font-bold text-sm sm:text-base">Mobarez</span>
                <span className="font-medium text-xs sm:text-sm text-slate-600 dark:text-slate-400">DisplayExtended</span>
              </div>
            </Link>
          </div>
          
          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <SearchBar />
          </div>
          
          {/* Right - Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ConnectionStatus />
            <div className="hidden sm:block">
              <QuickActions />
            </div>
            <NotificationDropdown />
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-slate-800 border-r
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            top-16
          `}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />
    </div>
  );
}