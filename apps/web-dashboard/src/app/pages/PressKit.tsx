import { Download, FileText, Image, Package } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function PressKit() {
  const handleDownload = (item: string) => {
    toast.success(`Downloading ${item}`, {
      description: 'Your download will begin shortly',
    });
  };

  const logos = [
    { name: 'Logo - Full Color', file: 'displayextended-logo-color.svg' },
    { name: 'Logo - White', file: 'displayextended-logo-white.svg' },
    { name: 'Logo - Black', file: 'displayextended-logo-black.svg' },
    { name: 'Icon - Full Color', file: 'displayextended-icon-color.svg' },
    { name: 'Icon - White', file: 'displayextended-icon-white.svg' },
    { name: 'Icon - Black', file: 'displayextended-icon-black.svg' },
  ];

  const screenshots = [
    'Dashboard View',
    'Connection Screen',
    'Settings Panel',
    'Mobile App',
    'Multi-Monitor Setup',
    'Performance Analytics',
  ];

  const brandColors = [
    { name: 'Primary Blue', hex: '#3B82F6', rgb: 'rgb(59, 130, 246)' },
    { name: 'Secondary Green', hex: '#10B981', rgb: 'rgb(16, 185, 129)' },
    { name: 'Dark Slate', hex: '#1E293B', rgb: 'rgb(30, 41, 59)' },
    { name: 'Light Gray', hex: '#F1F5F9', rgb: 'rgb(241, 245, 249)' },
  ];

  const companyInfo = {
    name: 'Mobarez DisplayExtended',
    tagline: 'Extend Your Screen Across Any Device',
    description: 'Mobarez DisplayExtended is a professional screen extension solution that connects Mac, Windows, Linux, Android, and iOS devices via Wi-Fi or USB. Simple, fast, and powerful.',
    founded: '2023',
    headquarters: 'San Francisco, CA',
    employees: '15-25',
    website: 'displayextended.com',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Package className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Press Kit
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Download our logos, screenshots, and brand assets for media coverage
          </p>
          <Button size="lg" onClick={() => handleDownload('Complete Press Kit')}>
            <Download className="w-5 h-5 mr-2" />
            Download Complete Press Kit
          </Button>
        </motion.div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">Company Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Company Name</h3>
                <p className="text-slate-600 dark:text-slate-400">{companyInfo.name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Tagline</h3>
                <p className="text-slate-600 dark:text-slate-400">{companyInfo.tagline}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-slate-600 dark:text-slate-400">{companyInfo.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Founded</h3>
                <p className="text-slate-600 dark:text-slate-400">{companyInfo.founded}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Headquarters</h3>
                <p className="text-slate-600 dark:text-slate-400">{companyInfo.headquarters}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Team Size</h3>
                <p className="text-slate-600 dark:text-slate-400">{companyInfo.employees}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Website</h3>
                <p className="text-blue-500">{companyInfo.website}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Logos & Icons</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {logos.map((logo, index) => (
              <Card key={index} className="p-6">
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-16 h-16 text-slate-400" />
                </div>
                <h3 className="font-semibold mb-2">{logo.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  {logo.file}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload(logo.name)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Brand Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Brand Colors</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {brandColors.map((color, index) => (
              <Card key={index} className="p-6">
                <div 
                  className="aspect-square rounded-lg mb-4"
                  style={{ backgroundColor: color.hex }}
                />
                <h3 className="font-semibold mb-2">{color.name}</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-slate-600 dark:text-slate-400">
                    HEX: {color.hex}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    RGB: {color.rgb}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8">Screenshots</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {screenshots.map((screenshot, index) => (
              <Card key={index} className="p-6">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <Image className="w-16 h-16 text-white" />
                </div>
                <h3 className="font-semibold mb-4">{screenshot}</h3>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload(screenshot)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Media Inquiries</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              For press inquiries, interviews, or additional assets, please contact our media team
            </p>
            <div className="space-y-2">
              <p className="text-lg">press@displayextended.com</p>
              <p className="opacity-90">We typically respond within 24 hours</p>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}