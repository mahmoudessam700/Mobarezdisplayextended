import { useState, useMemo, useEffect, useCallback } from 'react';
import { Scan, Plus, Wifi, WifiOff, Monitor, RefreshCw } from 'lucide-react';
import { DeviceCard, DeviceType, DeviceStatus } from '../../components/DeviceCard';
import { ConnectionModal, ConnectionSettings } from '../../components/ConnectionModal';
import { useTranslation } from '../../hooks/useTranslation';
import { usePeer } from '../../hooks/usePeer';
import { useWebRTC } from '../../hooks/useWebRTC';
import { StreamPlayer } from '../../components/StreamPlayer';
import { Button } from '../../components/ui/button';
import { PairingModal } from '../../components/PairingModal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  resolution?: string;
}

export function Devices() {
  const { t } = useTranslation();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const { peer, connected } = usePeer();
  const { startScreenShare, stopStreaming, isStreaming, remoteCursorPos, remoteClickEffect } = useWebRTC({
    peer,
    onRemoteStream: (stream) => setRemoteStream(stream)
  });

  const [localDevices, setLocalDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [pairedTargetId, setPairedTargetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('devices');

  // Virtual Display State
  const [virtualDisplayActive, setVirtualDisplayActive] = useState(false);
  const [isVirtualDisplayLoading, setIsVirtualDisplayLoading] = useState(false);

  // PeerJS logic for pairing
  const onPairingVerify = useCallback((code: string) => {
    console.log('[DASHBOARD] Attempting direct Peer connection to code:', code);
    if (!connected) {
      toast.error('Not connected to peer network. Please wait.');
      return;
    }

    // In PeerJS, the code is the ID. We'll set it as target and let the user click "Become Host"
    // or we could auto-start sharing.
    setPairedTargetId(code);
    setShowPairingModal(false);
    toast.success('Ready to share! Click "Become Host" to start.');
  }, [connected]);


  const allDevices = useMemo(() => {
    // For now, PeerJS discovery is limited to pairing codes.
    return [] as Device[];
  }, []);

  const handleScan = () => {
    toast.info('Discovery in this mode requires a Pairing Code.');
  };

  const handleConnect = (device: Device) => {
    // Direct connection by clicking a card will require service discovery
    toast.info('Please use "Connect with Code"');
  };

  const handleConfirmConnection = (settings: ConnectionSettings) => {
    if (selectedDevice) {
      toast.info(`Attempting connection to ${selectedDevice.name}...`);
      setShowConnectionModal(false);
    }
  };

  const handleDisconnect = (id: string) => {
    toast.success(`Disconnected from device`);
  };

  const handleToggleVirtualDisplay = async () => {
    setIsVirtualDisplayLoading(true);
    const newState = !virtualDisplayActive;

    try {
      // @ts-ignore
      const isElectron = window.process?.versions?.electron || (window.require && window.require('electron'));
      if (isElectron) {
        // @ts-ignore
        const ipc = (window as any).ipcRenderer || (window.require && window.require('electron').ipcRenderer);
        const result = await ipc.invoke('virtual-display:toggle', newState);
        if (result.success) {
          setVirtualDisplayActive(newState);
          toast.success(newState ? 'Virtual monitor created successfully!' : 'Virtual monitor removed.');
        } else {
          toast.error(result.message || 'Failed to manage virtual monitor.');
        }
      } else {
        toast.error('Native features are only available in the desktop app.');
      }
    } catch (e) {
      console.error('IPC Invoke error:', e);
      toast.error('System error occurred during virtual monitor setup.');
    } finally {
      setIsVirtualDisplayLoading(false);
    }
  };

  const connectedDevices = allDevices.filter(d => d.status === 'connected');
  const availableDevices = allDevices.filter(d => d.status !== 'connected');

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {t('devices.title')}
          </h1>
          <p className="text-slate-400 text-sm">{t('devices.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPairingModal(true)}
            className="w-full sm:w-auto border-blue-500/30 hover:bg-blue-500/5 text-blue-500"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Connect with Code
          </Button>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-slate-900 border border-slate-800">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="extend">How to Extend</TabsTrigger>
            </TabsList>
          </Tabs>

          {!isStreaming ? (
            <Button
              variant="outline"
              onClick={() => {
                const target = pairedTargetId || 'broadcast';
                toast.promise(startScreenShare(target), {
                  loading: 'Preparing stream...',
                  success: 'Screen streaming active',
                  error: 'Sharing cancelled'
                });
              }}
              className="w-full sm:w-auto"
            >
              <Plus className="w-5 h-5 mr-2" />
              {/* @ts-ignore */}
              {window.process?.versions?.electron ? "Become Host (Native)" : "Become Host"}
            </Button>
          ) : (
            <Button variant="destructive" onClick={stopStreaming} className="w-full sm:w-auto">
              Stop Sharing
            </Button>
          )}
          <Button onClick={handleScan} disabled={scanning} className="w-full sm:w-auto">
            <Scan className={`w-5 h-5 mr-2 ${scanning ? 'animate-spin' : ''}`} />
            {scanning ? t('scanning') : t('scanDevices')}
          </Button>
        </div>
      </div>

      <PairingModal open={showPairingModal} onOpenChange={setShowPairingModal} onVerify={onPairingVerify} />

      {remoteStream && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold">Remote Display</h2>
            <Button variant="ghost" onClick={() => setRemoteStream(null)}>Close Stream</Button>
          </div>
          <StreamPlayer
            stream={remoteStream}
            deviceName={allDevices.find(d => d.status === 'connected')?.name || 'Remote Device'}
            onClose={() => setRemoteStream(null)}
          />
        </motion.div>
      )}

      {/* Remote Control Indicator — shows when host is streaming and remote user is controlling */}
      {isStreaming && remoteCursorPos && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="bg-slate-900/95 border border-blue-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-sm min-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-semibold text-blue-400">Remote Control Active</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1 font-mono">
              <div>Cursor: ({Math.round(remoteCursorPos.x * 100)}%, {Math.round(remoteCursorPos.y * 100)}%)</div>
              <div>Clicks: {remoteClickEffect}</div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'devices' ? (
        <>
          {connectedDevices.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t('connectedDevices')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {connectedDevices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    name={device.name}
                    type={device.type}
                    status={device.status}
                    resolution={device.resolution}
                    onDisconnect={() => handleDisconnect(device.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">{t('availableDevices')}</h2>
              {scanning && <div className="flex items-center text-blue-500 text-sm animate-pulse"><Wifi className="w-4 h-4 mr-2" />Searching...</div>}
            </div>

            {availableDevices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {availableDevices.map((device) => (
                  <DeviceCard key={device.id} name={device.name} type={device.type} status={device.status} resolution={device.resolution} onConnect={() => handleConnect(device)} />
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 mb-4">
                  <WifiOff className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
                </div>
                <h3 className="text-lg font-medium text-slate-400 mb-2">No devices found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">Make sure your other devices are running Mobarez DisplayExtended and are on the same Wi-Fi network.</p>
                <Button variant="outline" onClick={handleScan} disabled={scanning}>{scanning ? 'Scanning...' : 'Try Again'}</Button>
              </div>
            )}
          </motion.div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl"><Monitor className="w-8 h-8 text-blue-500" /></div>
                <div>
                  <h2 className="text-2xl font-bold">{t('home') === 'الرئيسية' ? 'التحكم في الشاشة الافتراضية' : 'Virtual Monitor Control'}</h2>
                  <p className="text-slate-400">{t('home') === 'الرئيسية' ? 'توسيع سطح المكتب الخاص بك بنقرة واحدة' : 'Extend your desktop with one click'}</p>
                </div>
              </div>
              <Badge variant={virtualDisplayActive ? "default" : "secondary"} className={virtualDisplayActive ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}>
                {virtualDisplayActive ? (t('home') === 'الرئيسية' ? 'نشط' : 'Active') : (t('home') === 'الرئيسية' ? 'غير نشط' : 'Inactive')}
              </Badge>
            </div>

            <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">{t('home') === 'الرئيسية' ? 'شاشة ممتدة برمجية' : 'Software-based Extended Monitor'}</h3>
                <p className="text-slate-400 text-sm">{t('home') === 'الرئيسية' ? 'أنشئ شاشات ثانوية بدون أجهزة إضافية.' : 'Create secondary monitors without extra hardware.'}</p>
              </div>
              <Button onClick={handleToggleVirtualDisplay} disabled={isVirtualDisplayLoading} variant={virtualDisplayActive ? "destructive" : "default"}>
                {isVirtualDisplayLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : (virtualDisplayActive ? <WifiOff className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                {virtualDisplayActive ? (t('home') === 'الرئيسية' ? 'إزالة الشاشة' : 'Remove Screen') : (t('home') === 'الرئيسية' ? 'إنشاء شاشة ممتدة' : 'Create Extended Screen')}
              </Button>
            </div>

            {virtualDisplayActive && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-400 leading-relaxed">
                  <span className="font-bold">Next Step:</span> {t('home') === 'الرئيسية' ? 'انقر على "Become Host" في الأعلى واختر "Virtual Display" الجديدة لبدء المشاركة.' : 'Click "Become Host" at the top and select the new "Virtual Display" to start sharing.'}
                </p>
              </motion.div>
            )}

            {!virtualDisplayActive && (
              <div className="text-xs text-slate-500 italic mt-4">
                {t('home') === 'الرئيسية' ? '* سيتم حذف الشاشة الافتراضية تلقائياً عند إغلاق التطبيق.' : '* Virtual monitors are automatically cleaned up when you close the app.'}
              </div>
            )}
          </div>
        </motion.div>
      )}
      {selectedDevice && (
        <ConnectionModal open={showConnectionModal} onOpenChange={setShowConnectionModal} deviceName={selectedDevice.name} onConnect={handleConfirmConnection} />
      )}
    </div>
  );
}