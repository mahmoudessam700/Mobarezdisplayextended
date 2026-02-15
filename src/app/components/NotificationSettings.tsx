import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface NotificationSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationSettings({ open, onOpenChange }: NotificationSettingsProps) {
  const handleSave = () => {
    toast.success('Notification settings saved');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification Settings</DialogTitle>
          <DialogDescription>
            Configure how and when you receive notifications
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Device Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium">Device Events</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Device Connected</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Notify when a device connects
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Device Disconnected</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Notify when a device disconnects
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>

          {/* Performance Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium">Performance</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Performance Warnings</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Alert on high latency or low FPS
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Bandwidth Alerts</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Notify when bandwidth is limited
                </p>
              </div>
              <Switch />
            </div>
          </div>

          {/* System Notifications */}
          <div className="space-y-4">
            <h4 className="font-medium">System</h4>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Updates Available</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Notify about new app updates
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Sound Notifications</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Play sound for important alerts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
