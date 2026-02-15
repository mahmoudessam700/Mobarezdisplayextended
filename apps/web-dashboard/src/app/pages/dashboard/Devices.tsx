import { useState, useMemo, useEffect, useCallback } from 'react';
import { Scan, Plus, Wifi, WifiOff, Monitor, RefreshCw } from 'lucide-react';
import { DeviceCard, DeviceType, DeviceStatus } from '../../components/DeviceCard';
import { ConnectionModal, ConnectionSettings } from '../../components/ConnectionModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useSocket, Device as RealDevice } from '../../hooks/useSocket';
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
  const { devices: socketDevices, connected, socket } = useSocket();
  const { startScreenShare, stopStreaming, isStreaming } = useWebRTC({
    socket,
    onRemoteStream: (stream) => setRemoteStream(stream)
  });

  const [localDevices, setLocalDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [pairedTargetId, setPairedTargetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('devices');

  const onPairingVerify = useCallback((code: string) => {
    console.log('[DASHBOARD] onPairingVerify called with code:', code);
    console.log('[DASHBOARD] socket exists:', !!socket);
    console.log('[DASHBOARD] socket connected:', socket?.connected);
    if (socket && socket.connected) {
      socket.emit('pairing:verify', { code });
      console.log('[DASHBOARD] Emitted pairing:verify with code:', code);
      toast.loading('Verifying pairing code...');
    } else {
      console.error('[DASHBOARD] Socket is not connected!');
      toast.error('Not connected to server. Please refresh the page.');
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handlePairingSuccess = ({ targetId }: { targetId: string }) => {
      console.log('[DASHBOARD] Pairing success! Target display:', targetId);
      toast.success('Pairing successful! Click "Become Host" to start streaming.');
      setPairedTargetId(targetId);
      setShowPairingModal(false);
    };

    const handlePairingError = ({ message }: { message: string }) => {
      toast.error(message);
    };

    socket.on('pairing:success', handlePairingSuccess);
    socket.on('pairing:error', handlePairingError);

    return () => {
      socket.off('pairing:success', handlePairingSuccess);
      socket.off('pairing:error', handlePairingError);
    };
  }, [socket]);

  // Combine socket devices with any local state if needed
  const allDevices = useMemo(() => {
    // Filter out our own device from the list
    const otherDevices = socketDevices.filter(d => d.id !== socket?.id);

    return otherDevices.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type as DeviceType,
      status: d.status as DeviceStatus,
      resolution: d.resolution
    }));
  }, [socketDevices, socket?.id]);

  const handleScan = () => {
    if (scanning) return;

    setScanning(true);
    toast.info('Refreshing device list...');

    // In this real implementation, we just triggers a request to the server
    socket?.emit('device:request-list');

    setTimeout(() => {
      setScanning(false);
      toast.success(`Scan complete! Found ${allDevices.length} devices.`);
    }, 1500);
  };

  const handleConnect = (device: RealDevice) => {
    setSelectedDevice({
      id: device.id,
      name: device.name,
      type: device.type as DeviceType,
      status: device.status as DeviceStatus,
      resolution: device.resolution
    });
    setShowConnectionModal(true);
  };

  const handleConfirmConnection = (settings: ConnectionSettings) => {
    if (selectedDevice) {
      socket?.emit('webrtc:connect-request', {
        targetId: selectedDevice.id,
        settings
      });

      toast.info(`Requesting connection to ${selectedDevice.name}...`);
      setShowConnectionModal(false);
    }
  };

  const handleDisconnect = (id: string) => {
    const device = allDevices.find(d => d.id === id);
    // socket?.emit('webrtc:disconnect', { targetId: id });
    if (device) {
      toast.success(`Disconnected from ${device.name}`);
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
          <p className="text-slate-400 text-sm">
            {t('devices.subtitle')}
          </p>
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
                console.log('[DASHBOARD] Starting screen share to target:', target);
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

      {/* Pairing Modal */}
      <PairingModal
        open={showPairingModal}
        onOpenChange={setShowPairingModal}
        onVerify={onPairingVerify}
      />

      {/* Stream Display */}
      {remoteStream && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
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

      {activeTab === 'devices' ? (
        <>
          {/* Connected Devices */}
          {connectedDevices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 sm:mb-12"
            >
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

          {/* Available Devices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">{t('availableDevices')}</h2>
              {scanning && (
                <div className="flex items-center text-blue-500 text-sm animate-pulse">
                  <Wifi className="w-4 h-4 mr-2" />
                  Searching...
                </div>
              )}
            </div>

            {availableDevices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {availableDevices.map((device) => (
                  <DeviceCard
                    key={device.id}
                    name={device.name}
                    type={device.type}
                    status={device.status}
                    resolution={device.resolution}
                    onConnect={() => handleConnect(device)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-950/50 border border-dashed border-slate-800 rounded-2xl p-8 sm:p-12 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-slate-900 mb-4">
                  <WifiOff className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
                </div>
                <h3 className="text-lg font-medium text-slate-400 mb-2">No devices found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                  Make sure your other devices are running Mobarez DisplayExtended and are on the same Wi-Fi network.
                </p>
                <Button variant="outline" onClick={handleScan} disabled={scanning}>
                  {scanning ? 'Scanning...' : 'Try Again'}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Monitor className="w-8 h-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{t('home') === 'الرئيسية' ? 'دليل الشاشة الممتدة' : 'Extended Display Guide'}</h2>
                <p className="text-slate-400">{t('home') === 'الرئيسية' ? 'حوّل جهاز الوندوز الخاص بك إلى شاشة ثانية' : 'Turn your Windows laptop into a second monitor'}</p>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 font-bold">1</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t('home') === 'الرئيسية' ? 'ثبّت أداة الشاشة الافتراضية' : 'Install a Virtual Display Tool'}</h3>
                  <p className="text-slate-400 text-sm">{t('home') === 'الرئيسية' ? 'لـ "توسيع" سطح المكتب، يحتاج ماك إلى شاشة افتراضية. نوصي بـ BetterDisplay (مجاني ومفتوح المصدر).' : 'To "Extend" your desktop, macOS needs a virtual monitor. We recommend BetterDisplay (Free/Open Source).'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 font-bold">2</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t('home') === 'الرئيسية' ? 'أنشئ شاشة افتراضية' : 'Create a Virtual Screen'}</h3>
                  <p className="text-slate-400 text-sm">{t('home') === 'الرئيسية' ? 'افتح BetterDisplay وانقر على "Create New Virtual Screen". سيرى جهاز ماك الآن شاشة ثانية في إعدادات النظام.' : 'Open BetterDisplay and click "Create New Virtual Screen". Your Mac will now see a second display in System Settings.'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-blue-400 font-bold">3</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{t('home') === 'الرئيسية' ? 'شارك الشاشة الافتراضية' : 'Share the Virtual Screen'}</h3>
                  <p className="text-slate-400 text-sm">{t('home') === 'الرئيسية' ? 'انقر على "Become Host" أعلاه واختر "Virtual Display" الجديدة من قائمة اختيار الشاشة.' : 'Click "Become Host" above and select the new "Virtual Display" from the screen picker list.'}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl text-xs text-blue-400">
              <b>{t('home') === 'الرئيسية' ? 'نصيحة:' : 'Pro Tip:'}</b> {t('home') === 'الرئيسية' ? 'استخدم "التحكم الكامل" على جهاز الوندوز للتحكم بالماك ولوحة المفاتيح الخاصة بك!' : 'Use "Full Control" on the Windows side to use your Windows mouse and keyboard to control your Mac!'}
            </div>
          </div>
        </motion.div>
      )}
      {/* Connection Modal */}
      {selectedDevice && (
        <ConnectionModal
          open={showConnectionModal}
          onOpenChange={setShowConnectionModal}
          deviceName={selectedDevice.name}
          onConnect={handleConfirmConnection}
        />
      )}
    </div>
  );
}