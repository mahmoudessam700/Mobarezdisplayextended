import { Languages } from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function LanguageToggle() {
  const { language, setLanguage } = useApp();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <Languages className="w-5 h-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className={language === 'en' ? 'bg-slate-100 dark:bg-slate-800' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('ar')}
          className={language === 'ar' ? 'bg-slate-100 dark:bg-slate-800' : ''}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
