import { Plus, Monitor, Scan, Download, Zap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function QuickActions() {
  const navigate = useNavigate();

  const handleQuickConnect = () => {
    toast.loading('Scanning for devices...');
    setTimeout(() => {
      toast.success('Found 3 available devices');
      navigate('/dashboard');
    }, 1500);
  };

  const handleNewSession = () => {
    toast.info('Opening connection settings...');
    navigate('/dashboard/sessions');
  };

  const handleDownloadApp = () => {
    toast.success('Starting download...');
    // In a real app, this would trigger a download
  };

  const handleOptimize = () => {
    toast.loading('Optimizing performance...', { id: 'optimize' });
    setTimeout(() => {
      toast.success('Performance optimized!', { id: 'optimize' });
    }, 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Quick Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleQuickConnect}>
          <Scan className="w-4 h-4 mr-2" />
          Scan for Devices
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleNewSession}>
          <Monitor className="w-4 h-4 mr-2" />
          New Session
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleDownloadApp}>
          <Download className="w-4 h-4 mr-2" />
          Download Mobile App
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleOptimize}>
          <Zap className="w-4 h-4 mr-2" />
          Optimize Performance
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
