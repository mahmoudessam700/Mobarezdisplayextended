import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useTranslation } from '../hooks/useTranslation';
import { Monitor, Maximize2, Copy } from 'lucide-react';

interface ConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceName: string;
  onConnect: (settings: ConnectionSettings) => void;
}

export interface ConnectionSettings {
  mode: 'extend' | 'mirror';
  resolution: string;
  frameRate: number;
  quality: number;
  audioEnabled: boolean;
  cursorEnabled: boolean;
  touchEnabled: boolean;
}

export function ConnectionModal({
  open,
  onOpenChange,
  deviceName,
  onConnect,
}: ConnectionModalProps) {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ConnectionSettings>({
    mode: 'extend',
    resolution: '1920x1080',
    frameRate: 60,
    quality: 80,
    audioEnabled: true,
    cursorEnabled: true,
    touchEnabled: false,
  });

  const handleConnect = () => {
    onConnect(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Connect to {deviceName}</DialogTitle>
          <DialogDescription>
            Configure connection settings before connecting
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="display" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="display">Display</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="input">Input</TabsTrigger>
          </TabsList>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6 mt-6">
            {/* Connection Mode */}
            <div className="space-y-3">
              <Label>Connection Mode</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSettings({ ...settings, mode: 'extend' })}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    settings.mode === 'extend'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Maximize2 className={`w-8 h-8 mb-3 mx-auto ${
                    settings.mode === 'extend' ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                  <div className="font-semibold mb-1">{t('extend')}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Add as second display
                  </div>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, mode: 'mirror' })}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    settings.mode === 'mirror'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Copy className={`w-8 h-8 mb-3 mx-auto ${
                    settings.mode === 'mirror' ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                  <div className="font-semibold mb-1">{t('mirror')}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Duplicate main screen
                  </div>
                </button>
              </div>
            </div>

            {/* Resolution */}
            <div className="space-y-3">
              <Label>{t('resolution')}</Label>
              <Select
                value={settings.resolution}
                onValueChange={(value) => setSettings({ ...settings, resolution: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                  <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                  <SelectItem value="2560x1440">2560x1440 (2K)</SelectItem>
                  <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audio */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Audio</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Route audio to connected device
                </p>
              </div>
              <Switch
                checked={settings.audioEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, audioEnabled: checked })
                }
              />
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6 mt-6">
            {/* Frame Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t('frameRate')}</Label>
                <span className="text-sm font-medium">{settings.frameRate} FPS</span>
              </div>
              <Slider
                value={[settings.frameRate]}
                onValueChange={([value]) => setSettings({ ...settings, frameRate: value })}
                min={30}
                max={120}
                step={30}
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>30 FPS</span>
                <span>60 FPS</span>
                <span>90 FPS</span>
                <span>120 FPS</span>
              </div>
            </div>

            {/* Quality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t('quality')}</Label>
                <span className="text-sm font-medium">{settings.quality}%</span>
              </div>
              <Slider
                value={[settings.quality]}
                onValueChange={([value]) => setSettings({ ...settings, quality: value })}
                min={25}
                max={100}
                step={25}
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Ultra</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Higher settings provide better quality but require more bandwidth and processing power.
              </p>
            </div>
          </TabsContent>

          {/* Input Tab */}
          <TabsContent value="input" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Cursor</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Show cursor on extended display
                </p>
              </div>
              <Switch
                checked={settings.cursorEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, cursorEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Touch Input</Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Use touchscreen on compatible devices
                </p>
              </div>
              <Switch
                checked={settings.touchEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, touchEnabled: checked })
                }
              />
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Touch input is only available on devices with touchscreen capabilities.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleConnect}>
            <Monitor className="w-4 h-4 mr-2" />
            {t('connect')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
