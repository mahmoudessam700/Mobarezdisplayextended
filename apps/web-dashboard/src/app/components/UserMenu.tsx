import { User, LogOut, Settings, CreditCard, HelpCircle, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router';
import { useTranslation } from '../hooks/useTranslation';
import { toast } from 'sonner';

export function UserMenu() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    toast.success('Successfully logged out');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-blue-500 text-white">
              JD
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">john.doe@email.com</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigate('/dashboard/account')}>
          <User className="w-4 h-4 mr-2" />
          {t('account')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigate('/dashboard/settings')}>
          <Settings className="w-4 h-4 mr-2" />
          {t('settings')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleNavigate('/dashboard/account')}>
          <CreditCard className="w-4 h-4 mr-2" />
          Billing
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleNavigate('/dashboard/help')}>
          <HelpCircle className="w-4 h-4 mr-2" />
          {t('help')}
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => window.open('https://docs.displayextended.com', '_blank')}>
          <Shield className="w-4 h-4 mr-2" />
          Documentation
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
          <LogOut className="w-4 h-4 mr-2" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
