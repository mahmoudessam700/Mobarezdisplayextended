import { Shield, Lock, Eye, Database } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';

export function Privacy() {
  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Information We Collect',
      content: [
        'Account information (email, username)',
        'Device information (OS version, device type)',
        'Usage data (features used, session duration)',
        'Performance metrics (FPS, latency, connection quality)',
        'Crash reports and error logs',
      ],
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'How We Use Your Information',
      content: [
        'Provide and improve our services',
        'Troubleshoot technical issues',
        'Send important service updates',
        'Analyze usage patterns to enhance features',
        'Ensure security and prevent fraud',
      ],
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Data Security',
      content: [
        'End-to-end encryption for screen data',
        'Secure cloud storage with encryption at rest',
        'Regular security audits and updates',
        'SOC 2 Type II compliant infrastructure',
        'Two-factor authentication available',
      ],
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Your Rights',
      content: [
        'Access your personal data',
        'Request data deletion',
        'Export your data',
        'Opt-out of marketing communications',
        'Update or correct your information',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Shield className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Last Updated: February 14, 2026
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="p-8">
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              At Mobarez DisplayExtended, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our screen extension services. By using Mobarez DisplayExtended, you agree to the collection and use of information in accordance with this policy.
            </p>
          </Card>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-8 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-500">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8 mb-12"
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. Account data is retained while your account is active. Usage data and performance metrics are typically retained for 90 days.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              You can request deletion of your account and associated data at any time through the account settings or by contacting our support team.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Third-Party Services</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Mobarez DisplayExtended uses third-party services for analytics, crash reporting, and infrastructure. These services may collect information sent by your device. We only work with providers who maintain strong privacy standards.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Third-party services we use include: Amazon Web Services (infrastructure), Stripe (payments), and Sentry (error tracking).
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Mobarez DisplayExtended is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of your country. We ensure appropriate safeguards are in place for such transfers, including standard contractual clauses approved by relevant authorities.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Changes to This Policy</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
            </p>
          </Card>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-lg mb-6 opacity-90">
              If you have any questions about this Privacy Policy, please contact us
            </p>
            <div className="space-y-2">
              <p className="text-lg font-semibold">privacy@displayextended.com</p>
              <p className="opacity-90">
                Mobarez DisplayExtended, Inc.<br />
                123 Tech Street, Suite 100<br />
                San Francisco, CA 94105
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}