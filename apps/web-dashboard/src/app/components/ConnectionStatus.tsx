import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

export function ConnectionStatus() {
  // In a real app, this would come from a connection context/state
  const isConnected = true;
  const activeConnections = 2;
  const networkQuality = 'excellent'; // excellent, good, fair, poor

  const getQualityColor = () => {
    switch (networkQuality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/50">
            {isConnected ? (
              <Wifi className={`w-4 h-4 ${getQualityColor()}`} />
            ) : (
              <WifiOff className="w-4 h-4 text-slate-400" />
            )}
            <span className="text-sm font-medium">
              {activeConnections} {activeConnections === 1 ? 'device' : 'devices'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">Network Status</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
              Quality: {networkQuality}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeConnections} active connection{activeConnections !== 1 ? 's' : ''}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
