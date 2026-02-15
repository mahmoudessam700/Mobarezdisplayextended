import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../../components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Button } from '../../components/ui/button';
import { Book, MessageCircle, Mail, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export function Help() {
  const { t } = useTranslation();

  const resources = [
    {
      icon: <Book className="w-6 h-6" />,
      title: t('documentationResource'),
      description: t('documentationResourceDesc'),
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: t('communityForum'),
      description: t('communityForumDesc'),
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: t('contactSupportResource'),
      description: t('contactSupportDesc'),
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('releaseNotesHelp'),
      description: t('releaseNotesDesc'),
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  const faqs = [
    {
      question: t('faqQuestion1'),
      answer: t('faqAnswer1'),
    },
    {
      question: t('faqQuestion2'),
      answer: t('faqAnswer2'),
    },
    {
      question: t('faqQuestion3'),
      answer: t('faqAnswer3'),
    },
    {
      question: t('faqQuestion4'),
      answer: t('faqAnswer4'),
    },
    {
      question: t('faqQuestion5'),
      answer: t('faqAnswer5'),
    },
    {
      question: t('faqQuestion6'),
      answer: t('faqAnswer6'),
    },
  ];

  return (
    <div className="p-3 sm:p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('help')}</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          {t('findAnswersSupport')}
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 sm:mb-8">
        {resources.map((resource, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${resource.bg} flex items-center justify-center flex-shrink-0`}>
                  <div className={resource.color}>
                    {resource.icon}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-1 text-sm sm:text-base">{resource.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {resource.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">{t('frequentlyAsked')}</h2>
        <Card className="p-4 sm:p-6">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 sm:mt-12 text-center"
      >
        <Card className="p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('stillNeedHelp')}</h3>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6">
            {t('supportTeamAssist')}
          </p>
          <Button size="lg" className="w-full sm:w-auto">
            <Mail className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
            {t('contactSupportResource')}
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
