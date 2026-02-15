import { Monitor, Github, Twitter, Mail } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useTranslation } from '../hooks/useTranslation';
import { handleDownload } from '../utils/download';

interface FooterLink {
  label: string;
  path: string;
}

export function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      const hash = path.substring(2);
      
      if (location.pathname === '/') {
        // Already on home page, just scroll
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home page first
        navigate('/');
        // Then scroll after navigation
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    }
  };

  const footerLinks: Record<string, FooterLink[]> = {
    product: [
      { label: t('features'), path: '/#features' },
      { label: t('pricing'), path: '/#pricing' },
      { label: t('download'), path: '/download' },
      { label: t('dashboard'), path: '/dashboard' },
    ],
    support: [
      { label: t('documentation'), path: '/documentation' },
      { label: t('help'), path: '/dashboard/help' },
      { label: t('community'), path: '/community' },
      { label: t('contact'), path: '/contact' },
    ],
    company: [
      { label: t('about'), path: '/about' },
      { label: t('blog'), path: '/blog' },
      { label: t('careers'), path: '/careers' },
      { label: t('pressKit'), path: '/press-kit' },
    ],
    legal: [
      { label: t('privacy'), path: '/privacy' },
      { label: t('terms'), path: '/terms' },
      { label: t('license'), path: '/terms' },
      { label: t('security'), path: '/privacy' },
    ],
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="font-semibold text-sm sm:text-base">Mobarez DisplayExtended</span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-3 sm:mb-4">
              {t('footerDescription')}
            </p>
            <div className="flex gap-2 sm:gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a
                href="mailto:support@displayextended.com"
                className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('product')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={`product-${index}`}>
                  <Link
                    to={link.path}
                    onClick={(e) => handleFooterLinkClick(e, link.path)}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('support')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={`support-${index}`}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('company')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={`company-${index}`}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">{t('legal')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={`legal-${index}`}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 sm:pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center md:text-left">
            © 2026 Mobarez DisplayExtended. {t('allRightsReserved')}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {t('madeWithLove')}
          </p>
        </div>
      </div>
    </footer>
  );
}