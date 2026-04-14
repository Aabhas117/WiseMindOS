import { Link, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, CheckCircle, Zap, ArrowRight, UserPlus2, Camera, CalendarCheck, CalendarDays } from 'lucide-react';
import { useApp } from '../store/AppContext';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import ClockWidget from '../components/ClockWidget';
import DonutChart from '../components/DonutChart';
import GoalCard from '../components/GoalCard';
import ProjectCard from '../components/ProjectCard';
import TaskItem from '../components/TaskItem';
import HabitCard from '../components/HabitCard';
import GradientButton from '../components/GradientButton';
import { motion } from 'framer-motion'
import { useMemo } from 'react';
import profile_pic from '../assets/profile_pic.svg'
import { showToast } from '../utils/toastHelper';


const Dashboard = () => {
  const {
    goals,
    user,
    projects,
    tasks,
    habits,
    scores,
    dailyPlan,
    calculateGoalProgress,
    calculateProjectProgress,
    toggleDailyPlanTaskCompletion,
    getImportantTasks,
    getBehindTasks,
    toggleTaskCompletion,
    getProjectsByGoal,
    calculateProductivityScore,
    calculateDisciplineScore
  } = useApp();

  const navigate = useNavigate();



  const productivityScore = useMemo(() => calculateProductivityScore(), [tasks, habits, goals]);
  const disciplineScore = useMemo(() => calculateDisciplineScore(), [tasks, habits]);

  // Get today's planned tasks from dailyPlan
  const todayPlannedTasks = dailyPlan?.plannedTasks || [];
  const pendingPlannedTasks = todayPlannedTasks.filter(t => !t.completed);
  const hasPlannedTasks = todayPlannedTasks.length > 0;

  // Weekly mock data for charts
  const weeklyData = [
    { name: 'Mon', productivity: productivityScore - 10, discipline: disciplineScore - 5 },
    { name: 'Tue', productivity: productivityScore - 5, discipline: disciplineScore - 3 },
    { name: 'Wed', productivity: productivityScore - 8, discipline: disciplineScore },
    { name: 'Thu', productivity: productivityScore + 2, discipline: disciplineScore + 5 },
    { name: 'Fri', productivity: productivityScore, discipline: disciplineScore + 2 },
    { name: 'Sat', productivity: productivityScore + 5, discipline: disciplineScore + 8 },
    { name: 'Sun', productivity: productivityScore + 3, discipline: disciplineScore + 3 },
  ];

  const todayTasks = tasks.filter(task => {
    const today = new Date().toDateString();
    const taskDate = task.createdAt ? new Date(task.createdAt).toDateString() : today;
    return taskDate === today && !task.completed;
  });

  const importantTasks = getImportantTasks();
  const behindTasks = getBehindTasks();

  const topGoals = goals.slice(0, 4);
  const topProjects = projects.slice(0, 4);
  const topHabits = habits.slice(0, 3);

  // const handleConnect = ()=>{
  //   showToast({ message: "Not Functional"})
  // }

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
      <div className="max-w-6xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-6 w-full  relative overflow-hidden bg-white/15 backdrop-blur-xl border-20 border-black/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]">

            <div className="rounded w-full mb-6 p-4 flex flex-col items-center">
              {/* Image div  */}
              <div className='h-30 w-30 rounded-full relative group border-6 border-black/15 shadow-[0_0_40px_rgba(99,102,241,0.2)] shrink-0'>
                <img src={user.profile_pic || profile_pic} className='w-full h-full object-cover rounded-full' alt="" />
                <div className='w-full h-full bg-black/50 absolute rounded-full inset-0 cursor-pointer opacity-0 z-10 group-hover:opacity-100'>
                  <div className='h-full w-full flex items-center justify-center'>
                    <Camera size={18} className='text-white' />
                  </div>
                </div>
                <div className='border-6 h-5 w-5 rounded-full z-10 bottom-1 absolute right-1 border-green-400'></div>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-3xl md:text-4xl default-bold text-gray-100'>{user.name || 'User'}</span>
                <span className='cursor-pointer text-sm text-gray-300'>@{user.username || 'username'}</span>
              </div>
            </div>

            <div className='text-gray-400 mb-6'>Heyaa My aim is Software Developer . come lets build momentum today. Give me your hand.</div>

            <div className='flex justify-around mb-4'>
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-400">{productivityScore}%</p>
                <p className="text-xs text-gray-400">Productivity</p>
              </div>

              <div className="text-center">
                <p className="text-lg font-bold text-green-400">{disciplineScore}%</p>
                <p className="text-xs text-gray-400">Discipline</p>
              </div>
            </div>

            <GradientButton className="w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
              <UserPlus2 size={20} />
              <span>Connect</span>
            </GradientButton>

          </Card>

        </motion.div>


        <div className='rounded-2xl p-6 mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]'>

          {/* Clock Widget & Focus Room */}
          <div className="mb-6">
            <ClockWidget />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

            <StatCard
              title="Productivity"
              value={`${productivityScore}%`}
              icon={<Zap size={24} />}
              data-testid="productivity-score-card"
            />
            <StatCard
              title="Discipline"
              value={`${disciplineScore}%`}
              icon={<TrendingUp size={24} />}
              data-testid="discipline-score-card"
            />
            <StatCard
              title="Active Goals"
              value={goals.length.toString()}
              icon={<Target size={24} />}
              data-testid="active-goals-card"
            />
            <StatCard
              title="Tasks Today"
              value={`${tasks.filter(t => t.completed).length}/${tasks.length}`}
              icon={<CheckCircle size={24} />}
              data-testid="tasks-today-card"
            />
          </div>
        </div>


        {/* Important Tasks */}
        {importantTasks.length > 0 && (
          <Card className="mb-6 border-orange-500/30 bg-orange-500/5 backdrop-blur-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-400">⭐</span> Important Tasks
            </h2>
            <div className="space-y-3">
              {importantTasks.slice(0, 4).map(task => (
                <motion.div key={task.id} whileHover={{ scale: 1.02 }}>
                  <TaskItem
                    task={task}
                    onToggle={toggleTaskCompletion}
                  />
                </motion.div>
              ))}
              <Link to="/focus-room">
                <GradientButton className="w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]" data-testid="focus-room-cta">
                  <span>Enter Focus Room</span>
                  <ArrowRight size={20} />
                </GradientButton>
              </Link>
            </div>
          </Card>
        )}

        {/* Today's Tasks */}
        {hasPlannedTasks ? (
          <Card className="mb-6 bg-white/5 border border-white/10 backdrop-blur-lg shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <div className="flex justify-between items-center mb-4">
              {/* <h2 className="text-xl font-bold text-white">Today's Task Checklist</h2> */}
              <h2 className="text-xl font-bold text-white">Today's Planned Tasks</h2>
              <Link to="/trackers/daily-tasks" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {/* {todayTasks.slice(0, 5).map(task => (
                <motion.div key={task.id} whileHover={{ scale: 1.02 }}>
                  <TaskItem
                    task={task}
                    onToggle={toggleTaskCompletion}
                  /> */}
              {pendingPlannedTasks.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-white/5 rounded-lg border border-white/10 hover:border-indigo-500/50 transition-all"
                  data-testid={`planned-task-${item.id}`}
                >
                  <div className="flex items-start gap-3">
                    {/* Time */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-indigo-400 font-semibold">{item.startTime}</p>
                      <p className="text-xs text-gray-500">{item.endTime}</p>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${item.source === 'task'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : item.source === 'habit'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                              }`}>
                              {item.source === 'task' ? 'Task' : item.source === 'habit' ? 'Habit' : 'Manual'}
                            </span>
                            {item.isImportant && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                                Important
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Completion Toggle */}
                        <button
                          onClick={() => toggleDailyPlanTaskCompletion(item.id)}
                          className={`p-2 rounded-lg transition-all ${item.completed
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                            }`}
                          data-testid={`toggle-planned-task-${item.id}`}
                        >
                          <CheckCircle size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              <Link to="/focus-room">
                <GradientButton className="w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]" data-testid="focus-room-cta">
                  <span>Enter Focus Room</span>
                  <ArrowRight size={20} />
                </GradientButton>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="mb-6 bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <div className="text-center py-8">
              <CalendarDays size={48} className="text-indigo-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
              <h3 className="text-xl font-bold text-white mb-2">Plan Your Day to Stay Productive</h3>
              <p className="text-gray-400 mb-4">
                Create a structured daily plan to maximize your productivity
              </p>
              <Link to="/trackers/daily-tasks">
                <GradientButton data-testid="plan-now-btn">
                  Plan Now
                </GradientButton>
              </Link>
            </div>
          </Card>
        )}

        {/* Behind Tasks */}
        {behindTasks.length > 0 && (
          <Card className="mb-6 border-red-500/30 bg-orange-500/5 backdrop-blur-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">⚠️</span> Behind Schedule
            </h2>
            <div className="space-y-3">
              {behindTasks.slice(0, 4).map(task => (
                <motion.div key={task.id} whileHover={{ scale: 1.02 }}>
                  <TaskItem
                    task={task}
                    onToggle={toggleTaskCompletion}
                  />
                </motion.div>
              ))}
              <Link to="/focus-room">
                <GradientButton className="w-full h-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.5)]" data-testid="focus-room-cta">
                  <span>Enter Focus Room</span>
                  <ArrowRight size={20} />
                </GradientButton>
              </Link>
            </div>
          </Card>
        )}


        {/* Weekly Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Productivity Score</h3>
            <div className="flex justify-center">
              <DonutChart value={productivityScore} size={140} color="#6366f1" label="This Week" />
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Discipline Score</h3>
            <div className="flex justify-center">
              <DonutChart value={disciplineScore} size={140} color="#10b981" label="This Week" />
            </div>
          </Card>

          <Card className="bg-white/5 backdrop-blur-lg border border-white/10 hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-lg font-semibold text-white mb-4">Weekly Trend</h3>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="productivity" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="discipline" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Goals Progress */}
        {goals.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Goals Progress</h2>
              <Link to="/trackers/goals" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All <ArrowRight size={16} className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topGoals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    progress={calculateGoalProgress(goal.id)}
                    onClick={() => { }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Progress */}
        {projects.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Projects Progress</h2>
              <Link to="/trackers/projects" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All <ArrowRight size={16} className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {topProjects.map((project, index) => {
                const linkedGoal = goals.find(g => g.id === project.goalId);
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ProjectCard
                      key={project.id}
                      project={project}
                      progress={calculateProjectProgress(project.id)}
                      linkedGoal={linkedGoal?.title}
                      onClick={() => { }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Habits */}
        {habits.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Habits</h2>
              <Link to="/trackers/habits" className="text-indigo-400 hover:text-indigo-300 text-sm">
                View All <ArrowRight size={16} className="inline" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate('/trackers/habits')}
                >
                  <HabitCard key={habit.id} habit={habit} />
                </motion.div>
              ))}
            </div>
          </div>
        )}





        {/* FutureTwin CTA */}
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Doubt on Self ? Ask Your Twin...</h2>
            <p className="text-gray-300 mb-4">Use FutureTwin to predict outcomes and optimize your decisions.</p>
            <Link to="/future-twin">
              <GradientButton data-testid="future-twin-cta">
                Question your FutureTwin
              </GradientButton>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;