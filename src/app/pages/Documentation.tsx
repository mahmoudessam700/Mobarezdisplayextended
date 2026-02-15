import { Book, Search, Monitor, Smartphone, Settings, Zap } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function Documentation() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: t('gettingStarted'),
      description: t('gettingStartedDesc'),
      articles: [
        t('installationGuide'),
        t('firstTimeSetup'),
        t('systemRequirements'),
        t('troubleshootInstall'),
      ],
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: t('deviceConnection'),
      description: t('deviceConnectionDesc'),
      articles: [
        t('wifiConnection'),
        t('usbConnection'),
        t('deviceDiscovery'),
        t('connectionTroubleshoot'),
      ],
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: t('configuration'),
      description: t('configurationDesc'),
      articles: [
        t('displaySettings'),
        t('performanceOpt'),
        t('audioConfig'),
        t('networkSettings'),
      ],
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('advancedFeaturesCat'),
      description: t('advancedDesc'),
      articles: [
        t('multiMonitorSetup'),
        t('keyboardMouse'),
        t('fileTransferFeature'),
        t('clipboardSync'),
      ],
    },
  ];

  const popularArticles = [
    t('howToWifi'),
    t('optimizingPerf'),
    t('usingMultiDisp'),
    t('keyboardShortcuts'),
    t('audioTroubleshoot'),
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
          <Book className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            {t('documentationTitle')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            {t('documentationSubtitle')}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder={t('searchDocs')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ltr:pl-12 rtl:pr-12 ltr:pr-4 rtl:pl-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Popular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold mb-6">{t('popularArticles')}</h2>
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <button
                  key={index}
                  className="text-left rtl:text-right p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="text-blue-500 hover:text-blue-600">{article}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Documentation Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">{t('browseByCat')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{category.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {category.articles.map((article, idx) => (
                      <li key={idx}>
                        <button className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors">
                          {article}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <h2 className="text-3xl font-bold mb-4">{t('apiReference')}</h2>
            <p className="mb-6 opacity-90">
              {t('apiDesc')}
            </p>
            <Button variant="secondary" size="lg">
              {t('viewApiDocs')}
            </Button>
          </Card>
        </motion.div>

        {/* Need More Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-bold mb-4">{t('needMoreHelp')}</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {t('needHelpDesc')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact">
              <Button variant="outline">{t('contactSupport')}</Button>
            </Link>
            <Link to="/community">
              <Button>{t('joinCommunity')}</Button>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
