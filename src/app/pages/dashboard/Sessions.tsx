import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Monitor, Smartphone, Activity, Wifi, Maximize2, Copy, X, Settings2 } from 'lucide-react';
import { motion } from 'motion/react';

interface Session {
  id: string;
  deviceName: string;
  deviceType: 'mac' | 'windows' | 'linux' | 'android' | 'ios';
  mode: 'extend' | 'mirror';
  connectionType: 'wifi' | 'usb';
  duration: string;
  fps: number;
  resolution: string;
  latency: number;
  quality: number;
}

export function Sessions() {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      deviceName: 'MacBook Pro',
      deviceType: 'mac',
      mode: 'extend',
      connectionType: 'wifi',
      duration: '2h 34m',
      fps: 60,
      resolution: '2560x1600',
      latency: 12,
      quality: 95,
    },
    {
      id: '2',
      deviceName: 'iPad Pro',
      deviceType: 'ios',
      mode: 'mirror',
      connectionType: 'usb',
      duration: '45m',
      fps: 30,
      resolution: '2048x1536',
      latency: 8,
      quality: 85,
    },
  ]);

  const handleEndSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mac':
      case 'windows':
      case 'linux':
        return <Monitor className="w-6 h-6 text-blue-500" />;
      case 'android':
      case 'ios':
        return <Smartphone className="w-6 h-6 text-blue-500" />;
      default:
        return <Monitor className="w-6 h-6 text-blue-500" />;
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === 'extend' ? <Maximize2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />;
  };

  const getConnectionIcon = () => {
    return <Wifi className="w-4 h-4" />;
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return 'text-green-500';
    if (quality >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('sessions')}</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Active screen extension sessions
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">{sessions.length}</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Active Sessions</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">3</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Total Devices</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">10ms</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Avg Latency</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold">45 FPS</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Avg FPS</div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Active Sessions */}
      <div className="space-y-4 sm:space-y-6">
        {sessions.length > 0 ? (
          sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* Device Info */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base sm:text-lg truncate">{session.deviceName}</h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {getModeIcon(session.mode)}
                          <span className="ml-1 capitalize">{session.mode}</span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {getConnectionIcon()}
                          <span className="ml-1 uppercase">{session.connectionType}</span>
                        </Badge>
                        <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          {session.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {t('resolution')}
                      </div>
                      <div className="font-semibold text-sm sm:text-base">{session.resolution}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {t('frameRate')}
                      </div>
                      <div className="font-semibold text-sm sm:text-base">{session.fps} FPS</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {t('latency')}
                      </div>
                      <div className="font-semibold text-sm sm:text-base">{session.latency}ms</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">
                        {t('quality')}
                      </div>
                      <div className={`font-semibold text-sm sm:text-base ${getQualityColor(session.quality)}`}>
                        {session.quality}%
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-initial">
                      <Settings2 className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Settings</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-600 flex-1 sm:flex-initial"
                      onClick={() => handleEndSession(session.id)}
                    >
                      <X className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">End</span>
                    </Button>
                  </div>

                  {/* Quality Progress Bar */}
                  <div className="mt-2">
                    <Progress value={session.quality} className="h-2" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No Active Sessions</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
                Connect a device to start a new session
              </p>
              <Button className="w-full sm:w-auto">Go to Devices</Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}