import { Monitor, Wifi, Usb, Zap, Cloud, Shield, Download, Check, ArrowRight } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/Footer';
import { ComparisonSection } from '../components/ComparisonSection';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { handleDownload } from '../utils/download';
import { useEffect } from 'react';

export function Landing() {
  const { t } = useTranslation();

  // Handle hash links on page load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  const features = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: t('feature1Title'),
      description: t('feature1Desc'),
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('feature2Title'),
      description: t('feature2Desc'),
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: t('feature3Title'),
      description: t('feature3Desc'),
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: t('feature4Title'),
      description: t('feature4Desc'),
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: t('feature5Title'),
      description: t('feature5Desc'),
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('feature6Title'),
      description: t('feature6Desc'),
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  const steps = [
    {
      number: '1',
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      number: '2',
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      number: '3',
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  const pricingPlans = [
    {
      name: t('free'),
      price: '0',
      features: [
        t('basicFeatures'),
        '1 Device',
        '720p',
        '30 FPS',
      ],
    },
    {
      name: t('pro'),
      price: '9',
      popular: true,
      features: [
        t('unlimitedDevices'),
        t('hdSupport'),
        '60 FPS',
        t('audioSync'),
        t('prioritySupport'),
        t('noWatermark'),
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge className="mb-4 sm:mb-6 bg-blue-500">Version 1.0</Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-blue-600 dark:text-blue-400">
              {t('heroTitle')}
              <br />
              {t('heroSubtitle')}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              {t('heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" onClick={handleDownload}>
                <Download className="w-5 h-5 mr-2" />
                {t('downloadNow')}
              </Button>
              <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link to="/dashboard">
                  {t('dashboard')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" asChild>
                <Link to="/display">
                  <Monitor className="w-5 h-5 mr-2" />
                  {t('joinAsDisplay')}
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Hero Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 sm:mt-16 md:mt-20 relative"
          >
            <div className="relative mx-auto max-w-5xl px-4">
              <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap">
                {/* Main Display */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative"
                >
                  <div className="w-48 h-32 sm:w-56 sm:h-36 md:w-64 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-2xl flex items-center justify-center">
                    <Monitor className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-28 md:w-32 h-3 bg-slate-300 dark:bg-slate-700 rounded-full blur-sm opacity-50"></div>
                </motion.div>

                {/* Connected Devices */}
                <div className="flex flex-col gap-3 sm:gap-4">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-24 h-16 sm:w-28 sm:h-18 md:w-32 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow-lg flex items-center justify-center"
                  >
                    <Wifi className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ x: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="w-24 h-16 sm:w-28 sm:h-18 md:w-32 md:h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg shadow-lg flex items-center justify-center"
                  >
                    <Usb className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('featuresTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <div className={feature.color}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('howItWorksTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <Card className="p-6 sm:p-8 text-center h-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4 sm:mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{step.description}</p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 ltr:-right-4 ltr:translate-x-1/2 rtl:-left-4 rtl:-translate-x-1/2 w-8 lg:w-12 xl:w-16 h-0.5 bg-blue-500 z-10"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 sm:py-20 md:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              {t('pricingTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 sm:p-8 h-full ${plan.popular ? 'border-blue-500 border-2 shadow-xl' : ''}`}>
                  {plan.popular && (
                    <Badge className="mb-4 bg-blue-500">Popular</Badge>
                  )}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl sm:text-5xl font-bold">${plan.price}</span>
                    {plan.price !== '0' && (
                      <span className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{t('perMonth')}</span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={handleDownload}
                  >
                    {t('download')}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              {t('ctaTitle')}
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-90 max-w-2xl mx-auto px-4">
              {t('ctaSubtitle')}
            </p>
            <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" onClick={handleDownload}>
              <Download className="w-5 h-5 mr-2" />
              {t('downloadNow')}
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}