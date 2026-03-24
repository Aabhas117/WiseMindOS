import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import Card from './Card';
import { motion } from "framer-motion";

const ClockWidget = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>

      {/* Background Glow */}
      <motion.div
        className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative flex flex-col items-center justify-center text-center">

        {/* Digital Time */}
        <div className="flex items-center gap-2 md:gap-3 text-3xl md:text-5xl font-bold text-white tracking-widest">

          <TimeBlock value={format(currentTime, 'HH')} />

          <BlinkColon />

          <TimeBlock value={format(currentTime, 'mm')} />

          <BlinkColon />

          <TimeBlock value={format(currentTime, 'ss')} />

        </div>

        {/* Date */}
        <p className="text-gray-400 mt-3 text-sm">
          {format(currentTime, 'EEEE, MMMM dd, yyyy')}
        </p>

      </div>
    </>
  );
};

const TimeBlock = ({ value }) => {
  return (
    <motion.div
      className="
        px-3 py-2 rounded-lg
        bg-gradient-to-b from-indigo-500/20 to-purple-500/20
        border border-white/10
        shadow-[0_0_10px_rgba(99,102,241,0.4)]
      "
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      {value}
    </motion.div>
  );
};

const BlinkColon = () => {
  return (
    <motion.span
      className="text-indigo-400"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      :
    </motion.span>
  );
};

export default ClockWidget;