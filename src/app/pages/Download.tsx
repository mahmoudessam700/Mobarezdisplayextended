import { Download as DownloadIcon, Monitor, Smartphone, Apple, Chrome } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/Footer';
import { detectPlatform, getPlatformName, handleDownload } from '../utils/download';
import { motion } from 'motion/react';

export function Download() {
  const currentPlatform = detectPlatform();
  const platformName = getPlatformName(currentPlatform);

  const downloads = [
    {
      platform: 'windows',
      name: 'Windows',
      icon: <Monitor className="w-8 h-8" />,
      version: '1.0.0',
      size: '45 MB',
      requirements: 'Windows 10 or later',
      recommended: currentPlatform === 'windows',
    },
    {
      platform: 'mac',
      name: 'macOS',
      icon: <Apple className="w-8 h-8" />,
      version: '1.0.0',
      size: '52 MB',
      requirements: 'macOS 11 or later',
      recommended: currentPlatform === 'mac',
    },
    {
      platform: 'linux',
      name: 'Linux',
      icon: <Chrome className="w-8 h-8" />,
      version: '1.0.0',
      size: '48 MB',
      requirements: 'Ubuntu 20.04+, Fedora 34+',
      recommended: currentPlatform === 'linux',
    },
    {
      platform: 'android',
      name: 'Android',
      icon: <Smartphone className="w-8 h-8" />,
      version: '1.0.0',
      size: '35 MB',
      requirements: 'Android 8.0 or later',
      recommended: currentPlatform === 'android',
    },
    {
      platform: 'ios',
      name: 'iOS',
      icon: <Apple className="w-8 h-8" />,
      version: '1.0.0',
      size: '40 MB',
      requirements: 'iOS 14 or later',
      recommended: currentPlatform === 'ios',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Download Mobarez DisplayExtended
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Choose your platform and start extending your screen across all your devices
          </p>
          
          {/* Quick Download */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 max-w-md mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
              <h3 className="text-2xl font-bold mb-2">Recommended for {platformName}</h3>
              <p className="mb-6 opacity-90">Version 1.0.0 • Free Download</p>
              <Button 
                size="lg" 
                variant="secondary" 
                className="w-full text-lg"
                onClick={handleDownload}
              >
                <DownloadIcon className="w-5 h-5 mr-2" />
                Download Now
              </Button>
            </Card>
          </motion.div>
        </motion.div>

        {/* All Platforms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">All Platforms</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {downloads.map((download, index) => (
              <motion.div
                key={download.platform}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 h-full ${download.recommended ? 'border-blue-500 border-2' : ''}`}>
                  {download.recommended && (
                    <Badge className="mb-4 bg-blue-500">Recommended</Badge>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-blue-500">
                      {download.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{download.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        v{download.version} • {download.size}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {download.requirements}
                  </p>
                  <Button 
                    className="w-full" 
                    variant={download.recommended ? 'default' : 'outline'}
                    onClick={handleDownload}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">System Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Desktop Requirements</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li>• Processor: Intel Core i3 or equivalent</li>
                <li>• RAM: 4GB minimum, 8GB recommended</li>
                <li>• Graphics: DirectX 11 or OpenGL 3.3 compatible</li>
                <li>• Storage: 500MB available space</li>
                <li>• Network: Wi-Fi or Ethernet connection</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Mobile Requirements</h3>
              <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                <li>• Android 8.0+ or iOS 14+</li>
                <li>• 2GB RAM minimum</li>
                <li>• 100MB available storage</li>
                <li>• Wi-Fi connection recommended</li>
                <li>• USB cable for wired connection</li>
              </ul>
            </Card>
          </div>
        </motion.div>

        {/* Installation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
            <h2 className="text-3xl font-bold text-center mb-8">Quick Installation Guide</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="font-semibold mb-2">Download & Install</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Download the installer for your platform and run it
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="font-semibold mb-2">Launch Application</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Open Mobarez DisplayExtended on both your main device and secondary device
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="font-semibold mb-2">Connect & Extend</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Scan for devices and connect to start extending your screen
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}