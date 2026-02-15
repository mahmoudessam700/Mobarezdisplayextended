import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Slider } from '../../components/ui/slider';
import { Button } from '../../components/ui/button';
import { motion } from 'motion/react';

export function Settings() {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('settings')}</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Configure your display extension preferences
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="p-4 sm:p-6">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="general" className="text-xs sm:text-sm px-2 sm:px-3">{t('general')}</TabsTrigger>
              <TabsTrigger value="display" className="text-xs sm:text-sm px-2 sm:px-3">{t('display')}</TabsTrigger>
              <TabsTrigger value="network" className="text-xs sm:text-sm px-2 sm:px-3">{t('network')}</TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs sm:text-sm px-2 sm:px-3">{t('advanced')}</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="space-y-1">
                    <Label>{t('language')}</Label>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Choose your preferred language
                    </p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="space-y-1">
                    <Label>{t('appearance')}</Label>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Choose light or dark theme
                    </p>
                  </div>
                  <Select defaultValue="light">
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <Label>{t('autoConnect')}</Label>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Automatically connect to saved devices
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <Label>{t('startOnBoot')}</Label>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Launch Mobarez DisplayExtended on system startup
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>

            {/* Display Tab */}
            <TabsContent value="display" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>{t('resolution')}</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Default display resolution
                    </p>
                  </div>
                  <Select defaultValue="1920x1080">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1920x1080">1920x1080</SelectItem>
                      <SelectItem value="2560x1440">2560x1440</SelectItem>
                      <SelectItem value="3840x2160">3840x2160</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t('frameRate')}</Label>
                    <span className="text-sm font-medium">60 FPS</span>
                  </div>
                  <Slider defaultValue={[60]} max={120} step={30} />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t('quality')}</Label>
                    <span className="text-sm font-medium">High</span>
                  </div>
                  <Slider defaultValue={[75]} max={100} step={25} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>HDR Support</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Enable HDR when available
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>

            {/* Network Tab */}
            <TabsContent value="network" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Wi-Fi Only</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Disable cellular connections
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Ethernet Priority</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Prefer wired connections when available
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Bandwidth Limit</Label>
                    <span className="text-sm font-medium">Unlimited</span>
                  </div>
                  <Slider defaultValue={[100]} max={100} step={10} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Port</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Default connection port
                    </p>
                  </div>
                  <Select defaultValue="5000">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5000">5000</SelectItem>
                      <SelectItem value="8080">8080</SelectItem>
                      <SelectItem value="9000">9000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Advanced Tab */}
            <TabsContent value="advanced" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Enable detailed logging
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Hardware Acceleration</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Use GPU for encoding/decoding
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Low Latency Mode</Label>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Optimize for gaming and real-time work
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View Logs
                  </Button>
                </div>

                <div>
                  <Button variant="destructive" className="w-full">
                    {t('reset')} Settings
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <Button variant="outline">{t('cancel')}</Button>
            <Button>{t('save')} Changes</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}