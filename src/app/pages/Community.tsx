import { Users, MessageSquare, Github, Heart, Trophy, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export function Community() {
  const { t } = useTranslation();

  const platforms = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      name: 'Discord',
      description: t('discordDesc'),
      members: '12,500+',
      color: 'from-indigo-500 to-purple-600',
      link: '#',
    },
    {
      icon: <Github className="w-8 h-8" />,
      name: 'GitHub',
      description: t('githubDesc'),
      members: '3,200+',
      color: 'from-slate-700 to-slate-900',
      link: '#',
    },
    {
      icon: <Users className="w-8 h-8" />,
      name: t('forum'),
      description: t('forumDesc'),
      members: '8,700+',
      color: 'from-blue-500 to-indigo-600',
      link: '#',
    },
  ];

  const topContributors = [
    {
      name: 'Alex Chen',
      avatar: '👨‍💻',
      contributions: 247,
      role: t('coreDeveloper'),
    },
    {
      name: 'Sarah Johnson',
      avatar: '👩‍💼',
      contributions: 189,
      role: t('communityLead'),
    },
    {
      name: 'Mike Wilson',
      avatar: '👨‍🎨',
      contributions: 156,
      role: t('designer'),
    },
    {
      name: 'Emma Davis',
      avatar: '👩‍🔬',
      contributions: 134,
      role: t('qaEngineer'),
    },
  ];

  const discussions = [
    {
      title: 'Feature Request: Multi-clipboard support',
      author: 'john_dev',
      replies: 23,
      likes: 45,
      category: t('featureCategory'),
    },
    {
      title: 'How to optimize performance on older hardware?',
      author: 'sarah_tech',
      replies: 15,
      likes: 32,
      category: t('questionCategory'),
    },
    {
      title: 'Guide: Setting up Mobarez DisplayExtended with Docker',
      author: 'mike_ops',
      replies: 8,
      likes: 67,
      category: t('guideCategory'),
    },
    {
      title: 'Bug: Connection drops on Wi-Fi 6E',
      author: 'emma_qa',
      replies: 12,
      likes: 18,
      category: t('bugCategory'),
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
          <Users className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent leading-tight pb-2">
            {t('joinOurCommunity')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            {t('connectWithThousands')}
          </p>
        </motion.div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          <Card className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">24,000+</div>
            <div className="text-slate-600 dark:text-slate-400">{t('activeMembers')}</div>
          </Card>
          <Card className="p-6 text-center">
            <MessageSquare className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">1,200+</div>
            <div className="text-slate-600 dark:text-slate-400">{t('discussions')}</div>
          </Card>
          <Card className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">500+</div>
            <div className="text-slate-600 dark:text-slate-400">{t('contributors')}</div>
          </Card>
        </motion.div>

        {/* Community Platforms */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">{t('connectWithUs')}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 bg-gradient-to-br ${platform.color} text-white rounded-xl flex items-center justify-center mb-4`}>
                    {platform.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">{platform.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {platform.description}
                  </p>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {platform.members} {t('members')}
                  </div>
                  <Button className="w-full">
                    {t('joinPlatform')} {platform.name}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Contributors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">{t('topContributors')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topContributors.map((contributor, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-5xl mb-3">{contributor.avatar}</div>
                <h3 className="font-semibold mb-1">{contributor.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {contributor.role}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">{contributor.contributions} {t('contributions')}</span>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Recent Discussions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-12">{t('recentDiscussions')}</h2>
          <Card className="divide-y dark:divide-slate-700">
            {discussions.map((discussion, index) => (
              <div key={index} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{discussion.category}</Badge>
                      <h3 className="font-semibold">{discussion.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {t('by')} {discussion.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{discussion.replies}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{discussion.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">{t('readyToJoin')}</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {t('becomePartCommunity')}
            </p>
            <Button size="lg" variant="secondary">
              {t('getStartedToday')}
            </Button>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}