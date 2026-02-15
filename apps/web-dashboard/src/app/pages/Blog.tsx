import { Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export function Blog() {
  const { t } = useTranslation();
  
  const featuredPost = {
    title: t('blogPost1Title'),
    excerpt: t('blogPost1Excerpt'),
    author: 'David Zhang',
    date: 'Feb 14, 2026',
    category: t('productCategory'),
    readTime: `5 ${t('minRead')}`,
    image: '🚀',
  };

  const posts = [
    {
      title: t('blogPost2Title'),
      excerpt: t('blogPost2Excerpt'),
      author: 'Sarah Martinez',
      date: 'Feb 10, 2026',
      category: t('tutorialCategory'),
      readTime: `8 ${t('minRead')}`,
    },
    {
      title: t('blogPost3Title'),
      excerpt: t('blogPost3Excerpt'),
      author: 'James Wilson',
      date: 'Feb 5, 2026',
      category: t('technicalCategory'),
      readTime: `12 ${t('minRead')}`,
    },
    {
      title: t('blogPost4Title'),
      excerpt: t('blogPost4Excerpt'),
      author: 'Emily Chen',
      date: 'Jan 28, 2026',
      category: t('tipsCategory'),
      readTime: `6 ${t('minRead')}`,
    },
    {
      title: t('blogPost5Title'),
      excerpt: t('blogPost5Excerpt'),
      author: 'David Zhang',
      date: 'Jan 20, 2026',
      category: t('comparisonCategory'),
      readTime: `10 ${t('minRead')}`,
    },
    {
      title: t('blogPost6Title'),
      excerpt: t('blogPost6Excerpt'),
      author: 'Sarah Martinez',
      date: 'Jan 15, 2026',
      category: t('tutorialCategory'),
      readTime: `7 ${t('minRead')}`,
    },
    {
      title: t('blogPost7Title'),
      excerpt: t('blogPost7Excerpt'),
      author: 'James Wilson',
      date: 'Jan 8, 2026',
      category: t('technicalCategory'),
      readTime: `15 ${t('minRead')}`,
    },
  ];

  const categories = [
    t('allCategory'),
    t('productCategory'),
    t('tutorialCategory'),
    t('technicalCategory'),
    t('tipsCategory'),
    t('comparisonCategory')
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
            {t('blogTitle')}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('blogSubtitle')}
          </p>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === t('allCategory') ? 'default' : 'outline'}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-12 flex items-center justify-center">
                <div className="text-9xl">{featuredPost.image}</div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4 bg-blue-500">{featuredPost.category}</Badge>
                <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Button>
                  {t('readMore')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Posts */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">{t('recentPosts')}</h2>
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-shadow cursor-pointer">
                  <Badge variant="outline" className="w-fit mb-4">
                    {post.category}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <span className="text-blue-500">{post.readTime}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">{t('subscribeNewsletter')}</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {t('newsletterDescription')}
            </p>
            <div className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder={t('yourEmail')}
                className="flex-1 px-4 py-3 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button variant="secondary" size="lg">
                {t('subscribe')}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}