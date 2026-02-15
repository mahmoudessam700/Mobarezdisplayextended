import { FileText } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Footer } from '../components/Footer';
import { motion } from 'motion/react';

export function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <FileText className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Terms of Service
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
              Welcome to Mobarez DisplayExtended. These Terms of Service ("Terms") govern your use of our screen extension services. By accessing or using Mobarez DisplayExtended, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
          </Card>
        </motion.div>

        {/* Terms Sections */}
        <div className="space-y-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                By creating an account or using Mobarez DisplayExtended, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. You must be at least 13 years old to use our services.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                If you are using Mobarez DisplayExtended on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">2. Use of Services</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Mobarez DisplayExtended grants you a limited, non-exclusive, non-transferable license to use our software and services for personal or commercial use in accordance with these Terms.
              </p>
              <div className="space-y-3">
                <p className="text-slate-600 dark:text-slate-400">You agree not to:</p>
                <ul className="space-y-2 ml-6">
                  <li className="text-slate-600 dark:text-slate-400">• Reverse engineer, decompile, or disassemble the software</li>
                  <li className="text-slate-600 dark:text-slate-400">• Use the service for any illegal purposes</li>
                  <li className="text-slate-600 dark:text-slate-400">• Attempt to gain unauthorized access to our systems</li>
                  <li className="text-slate-600 dark:text-slate-400">• Interfere with or disrupt the service</li>
                  <li className="text-slate-600 dark:text-slate-400">• Share your account credentials with others</li>
                </ul>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">3. Account Responsibilities</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                You are responsible for maintaining the security of your account and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent, abusive, or illegal activities.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">4. Subscription and Payments</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Mobarez DisplayExtended offers both free and paid subscription plans. Paid subscriptions are billed on a recurring basis according to your selected plan (monthly or annually).
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                You authorize us to charge your payment method for all fees incurred. Subscription fees are non-refundable except as required by law or as otherwise stated in these Terms.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You may cancel your subscription at any time. Cancellation will take effect at the end of your current billing period.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Mobarez DisplayExtended and its original content, features, and functionality are owned by DisplayExtended, Inc. and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                You retain ownership of any content you transmit through our services. By using Mobarez DisplayExtended, you grant us a limited license to transmit and display your content solely for the purpose of providing our services.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">6. Disclaimer of Warranties</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Mobarez DisplayExtended is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your use of Mobarez DisplayExtended is at your own risk. We are not responsible for any damage to your devices or loss of data resulting from use of our services.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                To the maximum extent permitted by law, DisplayExtended, Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">8. Updates to Services and Terms</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                We reserve the right to modify or discontinue Mobarez DisplayExtended at any time. We may also update these Terms from time to time. Material changes will be communicated through the service or via email.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Your continued use of Mobarez DisplayExtended after any changes constitutes acceptance of the new Terms.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">9. Governing Law</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of San Francisco County, California.
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="text-slate-600 dark:text-slate-400">
                <p>Email: legal@displayextended.com</p>
                <p className="mt-2">
                  DisplayExtended, Inc.<br />
                  123 Tech Street, Suite 100<br />
                  San Francisco, CA 94105
                </p>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Acknowledgment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">By using Mobarez DisplayExtended, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.</h2>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}