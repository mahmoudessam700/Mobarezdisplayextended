import { Mail, MessageSquare, Phone, MapPin, Send } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '../hooks/useTranslation';

export function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('messageSent'), {
      description: t('messageResponse'),
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('emailContact'),
      value: 'support@displayextended.com',
      description: t('emailDesc'),
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: t('liveChat'),
      value: t('liveChatValue'),
      description: t('liveChatDesc'),
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: t('phoneContact'),
      value: '+1 (555) 123-4567',
      description: t('phoneDesc'),
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: t('office'),
      value: t('officeValue'),
      description: t('officeDesc'),
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
          <Mail className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent leading-tight pb-2">
            {t('contactUs')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('contactSubtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">{t('sendMessage')}</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('yourName')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('yourEmail')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('subject')}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">{t('selectSubject')}</option>
                    <option value="support">{t('technicalSupport')}</option>
                    <option value="sales">{t('salesInquiry')}</option>
                    <option value="feature">{t('featureRequest')}</option>
                    <option value="bug">{t('bugReport')}</option>
                    <option value="other">{t('other')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('message')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder={t('tellUsHelp')}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  {t('sendMessageBtn')}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6">{t('getInTouch')}</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8">
                {t('getInTouchDesc')}
              </p>
            </div>

            <div className="grid gap-4">
              {contactMethods.map((method, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{method.title}</h3>
                      <p className="text-blue-500 font-medium mb-1">{method.value}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* FAQ Link */}
            <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <h3 className="text-xl font-bold mb-2">{t('quickAnswers')}</h3>
              <p className="mb-4 opacity-90">
                {t('quickAnswersDesc')}
              </p>
              <Button variant="secondary">
                {t('viewFaq')}
              </Button>
            </Card>
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-slate-100 dark:bg-slate-800 text-center">
            <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('visitOffice')}</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {t('officeDesc')}<br />
              {t('officeValue')}
            </p>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
