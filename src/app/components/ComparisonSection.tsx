import { Check, Monitor, Wifi, Usb, Hand, Volume2, Gift, Sparkles, Zap, FolderSync } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export function ComparisonSection() {
  const { t } = useTranslation();
  
  const features = [
    { 
      featureKey: 'crossPlatformSupport' as const,
      icon: <Monitor className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      featureKey: 'wirelessUsbConnection' as const,
      icon: <Wifi className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      featureKey: 'touchScreenSupport' as const,
      icon: <Hand className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      featureKey: 'audioRouting' as const,
      icon: <Volume2 className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500'
    },
    { 
      featureKey: 'freeVersionAvailable' as const,
      icon: <Gift className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      featureKey: 'fourKSupport' as const,
      icon: <Sparkles className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      featureKey: 'lowLatencyMode' as const,
      icon: <Zap className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500'
    },
    { 
      featureKey: 'fileTransfer' as const,
      icon: <FolderSync className="w-5 h-5" />,
      color: 'from-teal-500 to-cyan-500'
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>{t('featuresTitle')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {t('comparisonTitle')}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto px-4 leading-relaxed">
            {t('comparisonSubtitle')}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden p-6 h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-transparent hover:border-blue-500/20 group">
                  {/* Gradient Background */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${item.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                  
                  {/* Icon */}
                  <div className={`relative w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  
                  {/* Feature Name */}
                  <h3 className="relative text-base sm:text-lg font-semibold mb-3 text-slate-900 dark:text-white leading-tight">
                    {t(item.featureKey)}
                  </h3>
                  
                  {/* Check Badge */}
                  <div className="relative flex items-center gap-2 text-green-600 dark:text-green-400">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{t('included')}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 sm:mt-16"
          >
            <Card className="relative overflow-hidden p-8 sm:p-12 text-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 border-0">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Sparkles className="w-4 h-4" />
                  <span>{t('allFeaturesIncluded')}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                  {t('everythingYouNeed')}
                </h3>
                <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto mb-8">
                  {t('experienceComplete')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                    <div className="text-3xl font-bold text-white">100%</div>
                    <div className="text-sm text-white/80">{t('featureComplete')}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                    <div className="text-3xl font-bold text-white">0</div>
                    <div className="text-sm text-white/80">{t('hiddenCosts')}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg">
                    <div className="text-3xl font-bold text-white">∞</div>
                    <div className="text-sm text-white/80">{t('possibilities')}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}