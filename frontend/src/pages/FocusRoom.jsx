import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import TaskItem from '../components/TaskItem';
import { motion } from 'framer-motion'
import Bag from '../components/Bag';

const FocusRoom = () => {
  const { tasks, toggleTaskCompletion, deleteTask } = useApp();

  // Pomodoro Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, shortBreak, longBreak
  const [pomodoroCount, setPomodoroCount] = useState(0);

  // Notes State
  // const [notes, setNotes] = useState(() => {
  //   const saved = localStorage.getItem('wisemind_focus_notes');
  //   return saved || '';
  // });

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer complete
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  // useEffect(() => {
  //   localStorage.setItem('wisemind_focus_notes', notes);
  // }, [notes]);

  const handleTimerComplete = () => {
    setIsActive(false);

    if (mode === 'work') {
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      // After 4 pomodoros, long break
      if (newCount % 4 === 0) {
        setMode('longBreak');
        setMinutes(15);
      } else {
        setMode('shortBreak');
        setMinutes(5);
      }
    } else {
      setMode('work');
      setMinutes(25);
    }

    setSeconds(0);

    // Play notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Timer Complete!', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to work!',
      });
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    if (mode === 'work') setMinutes(25);
    else if (mode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
  };

  const switchMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
    setSeconds(0);
    if (newMode === 'work') setMinutes(25);
    else if (newMode === 'shortBreak') setMinutes(5);
    else setMinutes(15);
  };

  const todayTasks = tasks.filter(t => !t.completed).slice(0, 5);

  const getModeColor = () => {
    if (mode === 'work') return 'from-red-600 to-orange-600';
    if (mode === 'shortBreak') return 'from-green-600 to-emerald-600';
    return 'from-blue-600 to-cyan-600';
  };

  const getModeText = () => {
    if (mode === 'work') return 'Focus Time';
    if (mode === 'shortBreak') return 'Short Break';
    return 'Long Break';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
      <motion.div
        className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl opacity-10"
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-10"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl md:text-4xl young-serif-regular font-extrabold text-white mb-2"
            animate={{
              textShadow: [
                "0px 0px 0px rgba(99,102,241,0)",
                "0px 0px 15px rgba(99,102,241,0.6)",
                "0px 0px 0px rgba(99,102,241,0)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Focus Room
          </motion.h1>
          <p className="text-gray-400">Minimize distractions, maximize productivity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timer Section */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden text-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              {/* Mode Selector */}
              <div className="flex justify-center gap-2 mb-6">
                <button
                  onClick={() => switchMode('work')}
                  className={`px-4 py-2 rounded-lg border cursor-pointer border-white/10 transition-all duration-300 ${mode === 'work'
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  data-testid="mode-work"
                >
                  Work
                </button>
                <button
                  onClick={() => switchMode('shortBreak')}
                  className={`px-4 py-2 rounded-lg border cursor-pointer border-white/10 transition-all duration-300 ${mode === 'shortBreak'
                    ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  data-testid="mode-short-break"
                >
                  Short Break
                </button>
                <button
                  onClick={() => switchMode('longBreak')}
                  className={`px-4 py-2 rounded-lg border cursor-pointer border-white/10 transition-all duration-300 ${mode === 'longBreak'
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  data-testid="mode-long-break"
                >
                  Long Break
                </button>
              </div>

              {/* Timer Display */}
              <motion.div
                animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
              >
                {/* Timer */}

                <div className={`bg-gradient-to-r ${getModeColor()} rounded-2xl p-12 mb-6`}>
                  <p className="text-white text-xl mb-4">{getModeText()}</p>
                  <div className="text-8xl font-bold text-white mb-4" data-testid="timer-display">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <p className="text-white mt-4 text-sm">
                    Completed Sessions: <span className="text-white font-semibold">{pomodoroCount}</span>
                  </p>
                </div>
              </motion.div>

              {/* Timer Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={toggleTimer}
                  data-testid="timer-toggle"
                  className={`bg-gradient-to-r ${getModeColor()} hover:opacity-90 text-white px-8 py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] 
hover:scale-105 cursor-pointer active:scale-95 transition-all flex items-center gap-2 text-lg font-semibold`}
                >
                  {isActive ? (
                    <>
                      <Pause size={24} />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play size={24} />
                      Start
                    </>
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  data-testid="timer-reset"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-4 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.5)] 
hover:scale-110 active:scale-95 cursor-pointer transition-all"
                >
                  <RotateCcw size={24} />
                </button>
              </div>
            </Card>

            {/* Notes Section */}
            {/* Focus Workspace */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6"
            >

              {/* 🧠 BAG (MAIN AREA) */}
              <div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_0_40px_rgba(99,102,241,0.15)] h-[92vh] flex flex-col">

                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-white text-lg font-semibold">
                      Focus Notes
                    </h2>
                    <span className="text-xs text-gray-400">
                      Deep Work Mode
                    </span>
                  </div>

                  {/* Bag */}
                  <div className="flex-1 min-h-0">
                    <Bag />
                  </div>

                </div>
              </div>
            </motion.div>
          </div>

          {/* Today's Tasks */}
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-xl font-bold text-white mb-4">Today's Tasks</h2>
              {todayTasks.length > 0 ? (
                <div className="space-y-3">
                  {todayTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskCompletion}
                        onDelete={deleteTask}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No pending tasks</p>
                  <p className="text-sm text-gray-500 mt-2">Great job! 🎉</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusRoom;