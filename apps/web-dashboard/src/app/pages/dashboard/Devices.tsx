import { useState, useMemo, useEffect, useCallback } from 'react';
import { Scan, Plus, Wifi, WifiOff, Monitor } from 'lucide-react';
import { DeviceCard, DeviceType, DeviceStatus } from '../../components/DeviceCard';
import { ConnectionModal, ConnectionSettings } from '../../components/ConnectionModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useSocket, Device as RealDevice } from '../../hooks/useSocket';
import { useWebRTC } from '../../hooks/useWebRTC';
import { StreamPlayer } from '../../components/StreamPlayer';
import { Button } from '../../components/ui/button';
import { PairingModal } from '../../components/PairingModal';
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

  const handleConnectClick = (id: string) => {
    const device = allDevices.find(d => d.id === id);
    if (device) {
      setSelectedDevice(device);
      setShowConnectionModal(true);
    }
  };

  const handleConnect = (settings: ConnectionSettings) => {
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
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('devices')}</h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Manage and connect your devices
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowPairingModal(true)}
            className="w-full sm:w-auto border-blue-500/30 hover:bg-blue-500/5 text-blue-500"
          >
            <Monitor className="w-4 h-4 mr-2" />
            Connect with Code
          </Button>

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
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t('availableDevices')}</h2>
        {availableDevices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {availableDevices.map((device) => (
              <DeviceCard
                key={device.id}
                name={device.name}
                type={device.type}
                status={device.status}
                resolution={device.resolution}
                onConnect={() => handleConnectClick(device.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 px-4">
              No available devices found
            </p>
            <Button onClick={handleScan} className="w-auto">
              <Scan className="w-5 h-5 mr-2" />
              {t('scanDevices')}
            </Button>
          </div>
        )}
      </motion.div>

      {/* Connection Modal */}
      {selectedDevice && (
        <ConnectionModal
          open={showConnectionModal}
          onOpenChange={setShowConnectionModal}
          deviceName={selectedDevice.name}
          onConnect={handleConnect}
        />
      )}
    </div>
  );
}