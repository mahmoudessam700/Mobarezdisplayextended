import { Briefcase, MapPin, Clock, DollarSign, Heart, Zap, Users, Code } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';

export function Careers() {
  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Great Team',
      description: 'Work with talented, passionate colleagues',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Latest Tech',
      description: 'Use cutting-edge tools and technologies',
    },
  ];

  const openPositions = [
    {
      title: 'Senior Backend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $180k',
      description: 'Build scalable backend systems for real-time screen streaming',
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100k - $150k',
      description: 'Design beautiful, intuitive interfaces for cross-platform apps',
    },
    {
      title: 'Mobile Engineer (iOS/Android)',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$110k - $160k',
      description: 'Develop high-performance mobile applications',
    },
    {
      title: 'DevOps Engineer',
      department: 'Infrastructure',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Build and maintain our cloud infrastructure',
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $120k',
      description: 'Help our users succeed with Mobarez DisplayExtended',
    },
    {
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$90k - $130k',
      description: 'Drive growth and brand awareness',
    },
  ];

  const values = [
    {
      title: 'Innovation First',
      description: 'We push boundaries and embrace new ideas',
    },
    {
      title: 'User-Centric',
      description: 'Our users inspire everything we build',
    },
    {
      title: 'Collaboration',
      description: 'We work together to achieve great things',
    },
    {
      title: 'Continuous Learning',
      description: 'We invest in growth and development',
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
          <Briefcase className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Help us build the future of screen extension. We're looking for talented, passionate people to join our mission.
          </p>
        </motion.div>

        {/* Benefits */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500 mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {benefit.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Our Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <Card className="p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="opacity-90">{value.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{position.title}</h3>
                        <Badge variant="outline">{position.department}</Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {position.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span>{position.salary}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="md:w-auto">
                      Apply Now
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="p-12">
            <h2 className="text-3xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              We're always looking for talented people. Send us your resume and tell us why you'd be a great fit for Mobarez DisplayExtended.
            </p>
            <Button size="lg">
              Send General Application
            </Button>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}