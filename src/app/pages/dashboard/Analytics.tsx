import { useTranslation } from '../../hooks/useTranslation';
import { Card } from '../../components/ui/card';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Cpu, Gauge, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

export function Analytics() {
  const { t } = useTranslation();

  // Mock data
  const performanceData = Array.from({ length: 20 }, (_, i) => ({
    time: `${i}s`,
    fps: Math.floor(Math.random() * 10) + 55,
    latency: Math.floor(Math.random() * 5) + 10,
    cpu: Math.floor(Math.random() * 20) + 30,
    gpu: Math.floor(Math.random() * 25) + 40,
  }));

  const stats = [
    {
      label: t('frameRate'),
      value: '60 FPS',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: t('latency'),
      value: '12ms',
      icon: <Gauge className="w-6 h-6" />,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: t('cpuUsage'),
      value: '42%',
      icon: <Cpu className="w-6 h-6" />,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: t('bandwidth'),
      value: '45 Mbps',
      icon: <Wifi className="w-6 h-6" />,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="p-3 sm:p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('analytics')}</h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Monitor performance and connection quality
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 sm:p-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3 sm:mb-4`}>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* FPS Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">{t('frameRate')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="fps" stroke="#3B82F6" fill="url(#colorFps)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Latency Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">{t('latency')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="latency" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* CPU Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">{t('cpuUsage')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stroke="#F59E0B" fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* GPU Usage Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">{t('gpuUsage')}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="gpu" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}