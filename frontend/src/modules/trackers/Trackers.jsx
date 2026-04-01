import { Link } from 'react-router-dom';
import { Target, Folder, CheckSquare, Repeat, Calendar } from 'lucide-react';
import Card from '../../components/Card';
import { motion } from 'framer-motion';

const Trackers = () => {
  const trackerOptions = [
    {
      icon: Target,
      title: 'Goals',
      description: 'Track your final, long-term, and mid-term goals',
      path: '/trackers/goals',
      color: 'from-purple-600 to-pink-600',
      testId: 'tracker-goals'
    },
    {
      icon: Folder,
      title: 'Projects',
      description: 'Manage projects linked to your goals',
      path: '/trackers/projects',
      color: 'from-green-600 to-emerald-600',
      testId: 'tracker-projects'
    },
    {
      icon: CheckSquare,
      title: 'Solo Tasks',
      description: 'Track individual tasks and to-dos',
      path: '/trackers/tasks',
      color: 'from-blue-600 to-cyan-600',
      testId: 'tracker-tasks'
    },
    {
      icon: Repeat,
      title: 'Habits',
      description: 'Build good habits and break bad ones',
      path: '/trackers/habits',
      color: 'from-orange-600 to-red-600',
      testId: 'tracker-habits'
    },
    {
      icon: Calendar,
      title: 'Daily Tasks',
      description: 'Plan and track your daily schedule',
      path: '/trackers/daily-tasks',
      color: 'from-indigo-600 to-violet-600',
      testId: 'tracker-daily'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-8">
          <motion.h1 className="text-3xl young-serif-regular md:text-4xl font-extrabold drop-shadow-[0_0_15px_rgba(99,102,241,0.4)] tracking-tight text-gray-200 text-center mb-2"
          animate={{
              textShadow: [
                "0px 0px 0px rgba(99,102,241,0)",
                "0px 0px 15px rgba(99,102,241,0.6)",
                "0px 0px 0px rgba(99,102,241,0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}>
            Trackers
          </motion.h1>
          <p className="text-gray-400 text-center">Manage all aspects of your life operating system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trackerOptions.map((tracker, index) => {
            const Icon = tracker.icon;
            return (
              <Link to={tracker.path} data-testid={tracker.testId}>
                <motion.div
                  key={tracker.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden
    bg-white/5 backdrop-blur-xl border border-white/10
    hover:scale-[1.03] hover:bg-white/10
    transition-all duration-300 cursor-pointer h-full
    shadow-[0_0_25px_rgba(99,102,241,0.2)] flex justify-center items-center flex-col">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`p-4 bg-gradient-to-r ${tracker.color} rounded-xl w-fit mb-4 shadow-lg`}
                    >
                      <Icon size={32} className="text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">{tracker.title}</h3>
                    <p className="text-gray-400">{tracker.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-indigo-400 text-sm font-medium">
                      Explore →
                    </div>
                  </Card>
                </motion.div>
              </Link>
            );
          })}
        </div >
      </motion.div >
    </div >
  );
};

export default Trackers;