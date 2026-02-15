import { Monitor, Smartphone, Laptop, TabletSmartphone } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTranslation } from '../hooks/useTranslation';

export type DeviceType = 'mac' | 'windows' | 'linux' | 'android' | 'ios';
export type DeviceStatus = 'connected' | 'disconnected' | 'connecting';

interface DeviceCardProps {
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  resolution?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function DeviceCard({
  name,
  type,
  status,
  resolution,
  onConnect,
  onDisconnect,
}: DeviceCardProps) {
  const { t } = useTranslation();

  const getIcon = () => {
    switch (type) {
      case 'mac':
      case 'windows':
      case 'linux':
        return <Laptop className="w-8 h-8 text-blue-500" />;
      case 'android':
      case 'ios':
        return <Smartphone className="w-8 h-8 text-blue-500" />;
      default:
        return <Monitor className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">{t('connected')}</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-500">{t('connecting')}</Badge>;
      default:
        return <Badge variant="secondary">{t('disconnected')}</Badge>;
    }
  };

  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      {/* Status Badge - positioned at top right */}
      <div className="flex justify-end mb-3">
        {getStatusBadge()}
      </div>
      
      {/* Device Info */}
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex-shrink-0">
          {getIcon()}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-sm sm:text-base truncate">{name}</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {type.toUpperCase()}
          </p>
          {resolution && (
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {resolution}
            </p>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-2">
        {status === 'connected' ? (
          <Button
            variant="outline"
            className="flex-1"
            onClick={onDisconnect}
          >
            {t('disconnect')}
          </Button>
        ) : (
          <Button
            className="flex-1"
            onClick={onConnect}
            disabled={status === 'connecting'}
          >
            {status === 'connecting' ? t('connecting') : t('connect')}
          </Button>
        )}
      </div>
    </Card>
  );
}