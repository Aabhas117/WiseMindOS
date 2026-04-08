import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ListTodo, Sparkles, X, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../store/AppContext';
import Card from '../../../components/Card';
import TaskItem from '../../../components/TaskItem';
import DonutChart from '../../../components/DonutChart';
import GradientButton from '../../../components/GradientButton';
import InputField from '../../../components/InputField';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const DailyTaskTracker = () => {
  const {
    tasks,
    habits,
    dailyPlan,
    addToDailyPlan,
    removeFromDailyPlan,
    createManualDailyTask,
    toggleDailyPlanTaskCompletion,
    clearDailyPlan,
    calculateProductivityScore,
    calculateDisciplineScore
  } = useApp();

  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'add'
  const [addMode, setAddMode] = useState('tasks'); // 'tasks' | 'habits' | 'manual'
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTaskForm, setManualTaskForm] = useState({
    title: '',
    startTime: '09:00',
    endTime: '10:00',
    isImportant: false
  });

  const currentHour = new Date().getHours();
  const productivityScore = calculateProductivityScore();
  const disciplineScore = calculateDisciplineScore();

  const isPlanEmpty = dailyPlan.plannedTasks.length === 0;

  // Get tasks not yet in daily plan
  const availableTasks = tasks.filter(
    task => !task.completed && 
    !dailyPlan.plannedTasks.some(pt => pt.taskId === task.id)
  );

  // Get habits with time that aren't in daily plan
  const suggestedHabits = habits.filter(
    habit => habit.startTime && 
    !dailyPlan.plannedTasks.some(pt => pt.habitId === habit.id)
  );

  // Timeline sections
  const morningTasks = dailyPlan.plannedTasks.filter(t => {
    const hour = parseInt(t.startTime.split(':')[0]);
    return hour >= 6 && hour < 12;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const afternoonTasks = dailyPlan.plannedTasks.filter(t => {
    const hour = parseInt(t.startTime.split(':')[0]);
    return hour >= 12 && hour < 18;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const eveningTasks = dailyPlan.plannedTasks.filter(t => {
    const hour = parseInt(t.startTime.split(':')[0]);
    return hour >= 18 || hour < 6;
  }).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pendingCount = dailyPlan.plannedTasks.filter(t => !t.completed).length;
  const completedCount = dailyPlan.plannedTasks.filter(t => t.completed).length;

  // Add tasks from task list
  const handleAddTasksToPlan = () => {
    if (selectedTaskIds.length === 0) {
      alert('Please select at least one task');
      return;
    }

    selectedTaskIds.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        addToDailyPlan({
          source: 'task',
          taskId: task.id,
          title: task.title,
          startTime: task.deadline ? format(new Date(task.deadline), 'HH:mm') : '09:00',
          endTime: task.deadline ? format(new Date(new Date(task.deadline).getTime() + 3600000), 'HH:mm') : '10:00',
          completed: task.completed,
          isImportant: task.isImportant
        });
      }
    });

    setSelectedTaskIds([]);
    setActiveTab('timeline');
  };

  // Add habit to plan
  const handleAddHabitToPlan = (habit) => {
    addToDailyPlan({
      source: 'habit',
      habitId: habit.id,
      title: habit.name,
      startTime: habit.startTime,
      endTime: habit.endTime || format(new Date(`2000-01-01T${habit.startTime}:00`).getTime() + 3600000, 'HH:mm'),
      completed: false,
      isImportant: false
    });
  };

  // Create manual task
  const handleCreateManualTask = (e) => {
    e.preventDefault();
    if (!manualTaskForm.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    createManualDailyTask(manualTaskForm);
    setManualTaskForm({
      title: '',
      startTime: '09:00',
      endTime: '10:00',
      isImportant: false
    });
    setShowManualForm(false);
    setActiveTab('timeline');
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getSourceBadge = (source) => {
    if (source === 'task') return { label: 'Task', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (source === 'habit') return { label: 'Habit', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    return { label: 'Manual', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
  };

  const TimelineSection = ({ title, tasks: sectionTasks, icon, gradient }) => {
    if (sectionTasks.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className={`text-lg font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {title}
          </h3>
          <span className="text-sm text-gray-500">({sectionTasks.length})</span>
        </div>
        <div className="space-y-3 pl-6 border-l-2 border-gray-700">
          {sectionTasks.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[27px] top-4 w-3 h-3 rounded-full bg-indigo-500 border-2 border-gray-900" />

              <Card className={`${item.completed ? 'opacity-60' : ''} bg-white/5 backdrop-blur-lg border border-white/10 hover:border-indigo-500/50 transition-all`}>
                <div className="flex items-start gap-3">
                  {/* Time */}
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-indigo-400 font-semibold">{item.startTime}</p>
                    <p className="text-xs text-gray-500">{item.endTime}</p>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${getSourceBadge(item.source).color}`}>
                            {getSourceBadge(item.source).label}
                          </span>
                          {item.isImportant && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                              Important
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleDailyPlanTaskCompletion(item.id)}
                          className={`p-2 rounded-lg transition-all ${
                            item.completed
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                          }`}
                          data-testid={`complete-daily-task-${item.id}`}
                        >
                          <CheckCircle2 size={20} />
                        </button>
                        <button
                          onClick={() => removeFromDailyPlan(item.id)}
                          className="p-2 rounded-lg bg-gray-700/50 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                          data-testid={`remove-daily-task-${item.id}`}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pb-20 px-4 pt-6 relative overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-20"
          animate={{ x: [0, -40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-3xl young-serif-regular font-bold text-gray-200 mb-2\">Daily Task Planner</h1>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={20} />
              <p>{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
            </div>
          </motion.div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-sm text-gray-400 mb-3 text-center">Productivity Score</h3>
              <DonutChart value={productivityScore} color="#10b981" size={120} />
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-sm text-gray-400 mb-3 text-center">Discipline Score</h3>
              <DonutChart value={disciplineScore} color="#f59e0b" size={120} />
            </Card>
          </div>

          {/* Warning if past 8 AM and no plan */}
          {currentHour >= 8 && isPlanEmpty && (
            <Card className="mb-6 bg-orange-900/20 border border-orange-500/30">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-orange-400" />
                <div>
                  <p className="text-orange-400 font-semibold">You haven't planned your day yet!</p>
                  <p className="text-sm text-gray-400">It's recommended to plan before 8 AM</p>
                </div>
              </div>
            </Card>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'timeline'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              data-testid="timeline-tab"
            >
              <ListTodo size={20} className="inline mr-2" />
              Today's Timeline ({dailyPlan.plannedTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'add'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              data-testid="add-tasks-tab"
            >
              <Plus size={20} className="inline mr-2" />
              Add to Plan
            </button>
          </div>

          {/* TIMELINE VIEW */}
          {activeTab === 'timeline' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isPlanEmpty ? (
                <Card className="text-center py-12">
                  <Sparkles size={48} className="mx-auto text-indigo-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Your day is wide open!</h3>
                  <p className="text-gray-400 mb-4">Start planning by adding tasks, habits, or creating manual tasks</p>
                  <GradientButton onClick={() => setActiveTab('add')} data-testid="start-planning-btn">
                    Start Planning
                  </GradientButton>
                </Card>
              ) : (
                <>
                  {/* Progress Summary */}
                  <Card className="mb-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Today's Progress</h3>
                        <p className="text-gray-400 text-sm">
                          {completedCount} of {dailyPlan.plannedTasks.length} tasks completed
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-indigo-400">
                          {dailyPlan.plannedTasks.length > 0
                            ? Math.round((completedCount / dailyPlan.plannedTasks.length) * 100)
                            : 0}%
                        </p>
                        <button
                          onClick={clearDailyPlan}
                          className="text-sm text-red-400 hover:text-red-300 mt-1"
                          data-testid="clear-plan-btn"
                        >
                          Clear Plan
                        </button>
                      </div>
                    </div>
                  </Card>

                  {/* Timeline Sections */}
                  <TimelineSection
                    title="Morning"
                    tasks={morningTasks}
                    icon={<span className="text-2xl">🌅</span>}
                    gradient="from-yellow-400 to-orange-500"
                  />

                  <TimelineSection
                    title="Afternoon"
                    tasks={afternoonTasks}
                    icon={<span className="text-2xl">☀️</span>}
                    gradient="from-orange-400 to-red-500"
                  />

                  <TimelineSection
                    title="Evening"
                    tasks={eveningTasks}
                    icon={<span className="text-2xl">🌙</span>}
                    gradient="from-indigo-400 to-purple-500"
                  />
                </>
              )}
            </motion.div>
          )}

          {/* ADD TO PLAN VIEW */}
          {activeTab === 'add' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Sub-tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAddMode('tasks')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    addMode === 'tasks'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  data-testid="add-from-tasks-tab"
                >
                  From Tasks ({availableTasks.length})
                </button>
                <button
                  onClick={() => setAddMode('habits')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    addMode === 'habits'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  data-testid="add-from-habits-tab"
                >
                  Suggested Habits ({suggestedHabits.length})
                </button>
                <button
                  onClick={() => setAddMode('manual')}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    addMode === 'manual'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                  data-testid="create-manual-task-tab"
                >
                  Create Manual
                </button>
              </div>

              {/* Add from Tasks */}
              {addMode === 'tasks' && (
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Select Tasks to Add</h3>
                  {availableTasks.length > 0 ? (
                    <>
                      <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                        {availableTasks.map(task => (
                          <motion.div
                            key={task.id}
                            onClick={() => toggleTaskSelection(task.id)}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              selectedTaskIds.includes(task.id)
                                ? 'bg-indigo-600/30 border border-indigo-500'
                                : 'bg-gray-700/50 hover:bg-gray-700'
                            }`}
                            data-testid={`select-task-${task.id}`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedTaskIds.includes(task.id)}
                                onChange={() => {}}
                                className="w-5 h-5"
                              />
                              <div className="flex-1">
                                <p className="text-white font-medium">{task.title}</p>
                                {task.deadline && (
                                  <p className="text-xs text-gray-400">
                                    Due: {format(new Date(task.deadline), 'MMM d, h:mm a')}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <GradientButton
                        onClick={handleAddTasksToPlan}
                        className="w-full"
                        disabled={selectedTaskIds.length === 0}
                        data-testid="add-selected-tasks-btn"
                      >
                        Add {selectedTaskIds.length > 0 ? `(${selectedTaskIds.length})` : ''} Tasks to Plan
                      </GradientButton>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No available tasks to add</p>
                      <p className="text-sm text-gray-500 mt-1">All tasks are either completed or already in your plan</p>
                    </div>
                  )}
                </Card>
              )}

              {/* Suggested Habits */}
              {addMode === 'habits' && (
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Suggested Habits</h3>
                  {suggestedHabits.length > 0 ? (
                    <div className="space-y-3">
                      {suggestedHabits.map(habit => (
                        <motion.div
                          key={habit.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-green-500/50 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-medium">{habit.name}</h4>
                              <p className="text-sm text-gray-400">
                                {habit.startTime} - {habit.endTime || 'No end time'}
                              </p>
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 inline-block mt-1">
                                Habit
                              </span>
                            </div>
                            <button
                              onClick={() => handleAddHabitToPlan(habit)}
                              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all"
                              data-testid={`add-habit-${habit.id}`}
                            >
                              Add to Plan
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No habits available</p>
                      <p className="text-sm text-gray-500 mt-1">Habits without time or already in plan are hidden</p>
                    </div>
                  )}
                </Card>
              )}

              {/* Create Manual Task */}
              {addMode === 'manual' && (
                <Card>
                  <h3 className="text-lg font-semibold text-white mb-4">Create Manual Task</h3>
                  <form onSubmit={handleCreateManualTask} className="space-y-4">
                    <InputField
                      label="Task Title"
                      type="text"
                      value={manualTaskForm.title}
                      onChange={(e) => setManualTaskForm({ ...manualTaskForm, title: e.target.value })}
                      placeholder="What do you need to do?"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label="Start Time"
                        type="time"
                        value={manualTaskForm.startTime}
                        onChange={(e) => setManualTaskForm({ ...manualTaskForm, startTime: e.target.value })}
                        required
                      />
                      <InputField
                        label="End Time"
                        type="time"
                        value={manualTaskForm.endTime}
                        onChange={(e) => setManualTaskForm({ ...manualTaskForm, endTime: e.target.value })}
                        required
                      />
                    </div>

                    <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={manualTaskForm.isImportant}
                        onChange={(e) => setManualTaskForm({ ...manualTaskForm, isImportant: e.target.checked })}
                        className="w-5 h-5"
                      />
                      Mark as Important
                    </label>

                    <GradientButton type="submit" className="w-full" data-testid="create-manual-task-btn">
                      Create & Add to Plan
                    </GradientButton>
                  </form>
                </Card>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyTaskTracker;