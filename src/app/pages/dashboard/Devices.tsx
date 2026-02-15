import { useState } from 'react';
import { Scan, Plus } from 'lucide-react';
import { DeviceCard, DeviceType, DeviceStatus } from '../../components/DeviceCard';
import { ConnectionModal, ConnectionSettings } from '../../components/ConnectionModal';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../../components/ui/button';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  resolution?: string;
}

export function Devices() {
  const { t } = useTranslation();
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'mac',
      status: 'connected',
      resolution: '2560x1600',
    },
    {
      id: '2',
      name: 'iPad Pro',
      type: 'ios',
      status: 'disconnected',
      resolution: '2048x1536',
    },
    {
      id: '3',
      name: 'Windows Desktop',
      type: 'windows',
      status: 'disconnected',
      resolution: '1920x1080',
    },
    {
      id: '4',
      name: 'Samsung Galaxy',
      type: 'android',
      status: 'disconnected',
      resolution: '1080x2400',
    },
    {
      id: '5',
      name: 'Ubuntu Desktop',
      type: 'linux',
      status: 'disconnected',
      resolution: '1920x1080',
    },
  ]);

  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  const handleScan = () => {
    setScanning(true);
    toast.info('Scanning for devices...');
    setTimeout(() => {
      setScanning(false);
      toast.success('Scan complete! Found 3 devices.');
    }, 2000);
  };

  const handleConnectClick = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (device) {
      setSelectedDevice(device);
      setShowConnectionModal(true);
    }
  };

  const handleConnect = (settings: ConnectionSettings) => {
    if (selectedDevice) {
      setDevices(devices.map(d =>
        d.id === selectedDevice.id ? { ...d, status: 'connecting' as DeviceStatus } : d
      ));
      
      toast.loading(`Connecting to ${selectedDevice.name}...`, { id: selectedDevice.id });
      
      setTimeout(() => {
        setDevices(devices.map(d =>
          d.id === selectedDevice.id ? { ...d, status: 'connected' as DeviceStatus } : d
        ));
        toast.success(`Successfully connected to ${selectedDevice.name}`, { id: selectedDevice.id });
      }, 1500);
    }
  };

  const handleDisconnect = (id: string) => {
    const device = devices.find(d => d.id === id);
    setDevices(devices.map(d =>
      d.id === id ? { ...d, status: 'disconnected' as DeviceStatus } : d
    ));
    if (device) {
      toast.success(`Disconnected from ${device.name}`);
    }
  };

  const connectedDevices = devices.filter(d => d.status === 'connected');
  const availableDevices = devices.filter(d => d.status !== 'connected');

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
        <Button onClick={handleScan} disabled={scanning} className="w-full sm:w-auto">
          <Scan className={`w-5 h-5 mr-2 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? t('scanning') : t('scanDevices')}
        </Button>
      </div>

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