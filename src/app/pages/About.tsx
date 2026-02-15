import { Target, Users, Zap, Heart } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export function About() {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: t('innovation'),
      description: t('innovationDesc'),
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t('userCentric'),
      description: t('userCentricDesc'),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('performanceValue'),
      description: t('performanceDesc'),
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: t('communityValue'),
      description: t('communityDesc'),
    },
  ];

  const team = [
    {
      name: 'David Zhang',
      role: t('ceoFounder'),
      avatar: '👨‍💼',
      bio: t('formerEngineer'),
    },
    {
      name: 'Sarah Martinez',
      role: t('cto'),
      avatar: '👩‍💻',
      bio: t('distributedExpert'),
    },
    {
      name: 'James Wilson',
      role: t('headOfDesign'),
      avatar: '👨‍🎨',
      bio: t('awardDesigner'),
    },
    {
      name: 'Emily Chen',
      role: t('headOfProduct'),
      avatar: '👩‍🔬',
      bio: t('productLeader'),
    },
  ];

  const milestones = [
    { year: '2023', event: t('companyFounded') },
    { year: '2024', event: t('betaLaunch') },
    { year: '2025', event: t('publicRelease') },
    { year: '2026', event: t('activeUsers') },
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent leading-tight pb-2">
            {t('aboutTitle')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            {t('aboutSubtitle')}
          </p>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-24"
        >
          <Card className="p-12">
            <h2 className="text-3xl font-bold mb-6 text-center">{t('ourStory')}</h2>
            <div className="max-w-3xl mx-auto space-y-4 text-slate-600 dark:text-slate-400">
              <p>{t('ourStoryP1')}</p>
              <p>{t('ourStoryP2')}</p>
              <p>{t('ourStoryP3')}</p>
              <p>{t('ourStoryP4')}</p>
            </div>
          </Card>
        </motion.div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">{t('ourValues')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 mx-auto mb-4">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <h2 className="text-3xl font-bold text-center mb-12">{t('meetOurTeam')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-6xl mb-4">{member.avatar}</div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-blue-500 mb-3">{member.role}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">{t('ourJourney')}</h2>
          <Card className="p-8">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">{t('joinUsJourney')}</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {t('joinUsDesc')}
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="#"
                className="px-6 py-3 bg-white text-blue-500 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
              >
                {t('joinOurTeam')}
              </a>
              <a
                href="#"
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {t('becomePartner')}
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
