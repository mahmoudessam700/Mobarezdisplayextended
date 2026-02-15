import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { User, Mail, CreditCard, Key } from 'lucide-react';
import { motion } from 'motion/react';

export function Account() {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('account')}</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl sm:text-2xl font-semibold mb-1">John Doe</h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">john.doe@example.com</p>
                <Badge className="mt-2 bg-blue-500">Pro User</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full sm:w-auto">Edit Profile</Button>
          </Card>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-0 sm:mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1">Email Address</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 break-all">
                  john.doe@example.com
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto mt-3 sm:mt-0">Change</Button>
            </div>
          </Card>
        </motion.div>

        {/* Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-0 sm:mb-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Subscription</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Pro Plan - $9/month
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Next billing: March 1, 2026
                </p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </Card>
        </motion.div>

        {/* License Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Key className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">License Key</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">
                  XXXX-XXXX-XXXX-XXXX
                </p>
              </div>
              <Button variant="outline" size="sm">Copy</Button>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 sm:p-6 border-red-200 dark:border-red-900">
            <h3 className="font-semibold mb-4 text-red-600 dark:text-red-400">Danger Zone</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full">
                Sign Out
              </Button>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}