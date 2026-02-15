import { Monitor, Menu, X, Home, Zap, Settings as SettingsIcon, DollarSign, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import { Link, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { handleDownload } from '../utils/download';

export function Navbar() {
  const { t } = useTranslation();
  const { isRTL } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    navigate('/');
  };

  const navItems = [
    { label: t('home'), path: '/', icon: Home },
    { label: t('features'), path: '/#features', icon: Zap },
    { label: t('howItWorks'), path: '/#how-it-works', icon: SettingsIcon },
    { label: t('pricing'), path: '/#pricing', icon: DollarSign },
    { label: t('dashboard'), path: '/dashboard', icon: LayoutDashboard },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    
    // Handle hash links
    if (path.startsWith('/#')) {
      const hash = path.substring(2);
      if (location.pathname === '/') {
        // Already on home page, just scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page, hash will be handled by browser
        window.location.href = path;
      }
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Monitor className="w-5 h-5 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-sm sm:text-base">Mobarez</span>
              <span className="font-medium text-xs sm:text-sm text-slate-600 dark:text-slate-400">DisplayExtended</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return item.path.startsWith('/#') ? (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-1.5 text-sm xl:text-base transition-colors cursor-pointer ${
                    isActive(item.path)
                      ? 'text-blue-500'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 text-sm xl:text-base transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-500'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <Button 
                  size="sm"
                  className="hidden lg:inline-flex text-xs xl:text-sm px-3 xl:px-4" 
                  onClick={handleDownload}
                >
                  {t('download')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden lg:inline-flex text-xs xl:text-sm px-3 xl:px-4" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  size="sm"
                  className="hidden lg:inline-flex text-xs xl:text-sm px-3 xl:px-4" 
                  onClick={handleDownload}
                >
                  {t('download')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="hidden lg:inline-flex text-xs xl:text-sm px-3 xl:px-4" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  size="sm"
                  className="hidden lg:inline-flex text-xs xl:text-sm px-3 xl:px-4" 
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="flex flex-col gap-2 sm:gap-3">{navItems.map((item) => {
                const Icon = item.icon;
                return item.path.startsWith('/#') ? (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-lg transition-colors text-left text-sm sm:text-base ${
                      isActive(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      isActive(item.path)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-500'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t pt-3 mt-2 mx-3 sm:mx-4 space-y-2">
                <Button className="w-full text-sm sm:text-base" onClick={handleDownload}>
                  {t('download')}
                </Button>
                
                {isAuthenticated ? (
                  <Button 
                    variant="outline" 
                    className="w-full text-sm sm:text-base" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full text-sm sm:text-base" 
                      onClick={() => {
                        navigate('/login');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full text-sm sm:text-base" 
                      onClick={() => {
                        navigate('/register');
                        setMobileMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}