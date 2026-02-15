import { useState } from 'react';
import { Bell, Check, Trash2, Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { NotificationSettings } from './NotificationSettings';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function NotificationDropdown() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Device Connected',
      message: 'MacBook Pro successfully connected via Wi-Fi',
      time: '2 min ago',
      read: false,
      type: 'success',
    },
    {
      id: '2',
      title: 'Low Performance',
      message: 'iPad Pro experiencing high latency',
      time: '15 min ago',
      read: false,
      type: 'warning',
    },
    {
      id: '3',
      title: 'Update Available',
      message: 'Mobarez DisplayExtended 1.1 is now available',
      time: '1 hour ago',
      read: true,
      type: 'info',
    },
  ]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400';
      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400';
      case 'error': return 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400';
      default: return 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          <AnimatePresence>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getTypeColor(notification.type)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-slate-500">{notification.time}</span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                <p className="text-sm text-slate-500">No notifications</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => setSettingsOpen(true)}>
            <Settings2 className="w-4 h-4 mr-2" />
            Notification Settings
          </Button>
        </div>
      </DropdownMenuContent>

      {/* Notification Settings Modal */}
      <NotificationSettings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </DropdownMenu>
  );
}