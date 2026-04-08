import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {

  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  // User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wisemind_user');
    return saved ? JSON.parse(saved) : null;
  });


  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('wisemind_user', JSON.stringify(user));
    }
  }, [user]);

  // Load initial data from localStorage or use defaults
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('wisemind_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('wisemind_projects');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('wisemind_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('wisemind_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyTasks, setDailyTasks] = useState(() => {
    const saved = localStorage.getItem('wisemind_daily_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  // NEW: Daily Plan with date-specific structure
  const [dailyPlan, setDailyPlan] = useState(() => {
    const saved = localStorage.getItem('wisemind_daily_plan');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toISOString().split('T')[0];
      // Reset if date changed
      if (parsed.date !== today) {
        return { date: today, plannedTasks: [] };
      }
      return parsed;
    }
    return { 
      date: new Date().toISOString().split('T')[0], 
      plannedTasks: [] 
    };
  });

  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('wisemind_scores');
    return saved ? JSON.parse(saved) : { productivity: 0, discipline: 0 };
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('wisemind_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('wisemind_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('wisemind_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('wisemind_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('wisemind_daily_tasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);

   useEffect(() => {
    localStorage.setItem('wisemind_daily_plan', JSON.stringify(dailyPlan));
  }, [dailyPlan]);

  useEffect(() => {
    localStorage.setItem('wisemind_scores', JSON.stringify(scores));
  }, [scores]);

  // Add Goal
  const addGoal = (goal) => {
    const newGoal = {
      id: Date.now().toString(),
      title: goal.title,
      type: goal.type,
      createdAt: new Date().toISOString(),
      ...goal
    };
    setGoals([...goals, newGoal]);
    return newGoal;
  };

  // Add Project
  const addProject = (project) => {
    const newProject = {
      id: Date.now().toString(),
      title: project.title,
      goalId: project.goalId || null,
      deadline: project.deadline,
      createdAt: new Date().toISOString(),
      ...project
    };
    setProjects([...projects, newProject]);
    return newProject;
  };

  // Add Task
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString() + Math.random(),
      title: task.title,
      deadline: task.deadline,
      completed: false,
      goalId: task.goalId || null,
      projectId: task.projectId || null,
      isImportant: task.isImportant || false,
      createdFrom: task.createdFrom || 'manual',
      createdAt: new Date().toISOString(),
      ...task
    };
    setTasks([...tasks, newTask]);
    return newTask;
  };

  // Add Habit
  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      type: habit.type,
      startTime: habit.startTime,
      endTime: habit.endTime,
      streak: 0,
      mode: habit.mode || '21-day',
      createdAt: new Date().toISOString(),
      lastCompleted: null,
      ...habit
    };
    setHabits([...habits, newHabit]);
    return newHabit;
  };

  const toggleTaskCompletion = (taskId) => {
    // Update main tasks list
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));

    // SYNC: Update in dailyPlan if exists
    setDailyPlan(prev => ({
      ...prev,
      plannedTasks: prev.plannedTasks.map(item =>
        item.taskId === taskId 
          ? { ...item, completed: !item.completed }
          : item
      )
    }));
    
    // Legacy: Update old dailyTasks for compatibility 
    setDailyTasks(dailyTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const updateTask = (taskId, updates) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setDailyTasks(dailyTasks.filter(task => task.id !== taskId));
  };

  const updateGoal = (goalId, updates) => {
    setGoals(goals.map(goal =>
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const updateProject = (projectId, updates) => {
    setProjects(projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const deleteProject = (projectId) => {
    setProjects(projects.filter(project => project.id !== projectId));
  };

  const updateHabit = (habitId, updates) => {
    setHabits(habits.map(habit =>
      habit.id === habitId ? { ...habit, ...updates } : habit
    ));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const calculateGoalProgress = (goalId) => {
    const goalTasks = tasks.filter(task => task.goalId === goalId);
    if (goalTasks.length === 0) return 0;
    const completedTasks = goalTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / goalTasks.length) * 100);
  };

  const calculateProjectProgress = (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.completed).length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  };

  const getTasksByGoal = (goalId) => tasks.filter(task => task.goalId === goalId);
  const getTasksByProject = (projectId) => tasks.filter(task => task.projectId === projectId);
  const getProjectsByGoal = (goalId) => projects.filter(project => project.goalId === goalId);
  const getImportantTasks = () => tasks.filter(task => !task.completed && task.isImportant);

  const getBehindTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      if (task.completed || !task.deadline) return false;
      const deadline = new Date(task.deadline);

      if (deadline < now) return true;

      if (task.createdAt) {
        const createdAt = new Date(task.createdAt);
        const totalTime = deadline - createdAt;
        const usedTime = now - createdAt;
        return (usedTime / totalTime) >= 0.75;
      }

      return false;
    });
  };

  const updateScores = (newScores) => {
    setScores({ ...scores, ...newScores });
  };

  const calculateProductivityScore = () => {
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(task =>
      new Date(task.createdAt).toDateString() === today
    );

    if (todayTasks.length === 0) return 0;
    const completed = todayTasks.filter(task => task.completed).length;
    return Math.round((completed / todayTasks.length) * 100);
  };

  const calculateDisciplineScore = () => {
    if (habits.length === 0) return 0;
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const maxPossibleStreak = habits.length * 21;
    return Math.min(Math.round((totalStreak / maxPossibleStreak) * 100), 100);
  };

  const setDailyTasksList = (tasksList) => {
    setDailyTasks(tasksList);
  };

  // ========== DAILY PLAN FUNCTIONS (BIDIRECTIONAL SYNC) ==========

  // Add task to daily plan
  const addToDailyPlan = (item) => {
    const newItem = {
      id: Date.now().toString() + Math.random(),
      source: item.source, // 'task' | 'habit' | 'manual'
      taskId: item.taskId || null,
      habitId: item.habitId || null,
      title: item.title,
      startTime: item.startTime || '09:00',
      endTime: item.endTime || '10:00',
      completed: item.completed || false,
      isImportant: item.isImportant || false,
      ...item
    };

    setDailyPlan(prev => ({
      ...prev,
      plannedTasks: [...prev.plannedTasks, newItem]
    }));

    return newItem;
  };

  // Remove from daily plan
  const removeFromDailyPlan = (id) => {
    setDailyPlan(prev => ({
      ...prev,
      plannedTasks: prev.plannedTasks.filter(item => item.id !== id)
    }));
  };

  // Create manual task directly in daily plan
  const createManualDailyTask = (taskData) => {
    const newTask = {
      id: Date.now().toString() + Math.random(),
      source: 'manual',
      taskId: null,
      habitId: null,
      title: taskData.title,
      startTime: taskData.startTime || '09:00',
      endTime: taskData.endTime || '10:00',
      completed: false,
      isImportant: taskData.isImportant || false
    };

    setDailyPlan(prev => ({
      ...prev,
      plannedTasks: [...prev.plannedTasks, newTask]
    }));

    return newTask;
  };

  // CRITICAL: Bidirectional sync for daily plan task completion
  const toggleDailyPlanTaskCompletion = (id) => {
    const item = dailyPlan.plannedTasks.find(t => t.id === id);
    if (!item) return;

    // Update in daily plan
    setDailyPlan(prev => ({
      ...prev,
      plannedTasks: prev.plannedTasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    }));

    // SYNC: Update source
    if (item.source === 'task' && item.taskId) {
      // Sync with main tasks
      setTasks(tasks.map(task =>
        task.id === item.taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
      // Legacy sync
      setDailyTasks(dailyTasks.map(task =>
        task.id === item.taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
    } else if (item.source === 'habit' && item.habitId) {
      // Sync with habits
      const habit = habits.find(h => h.id === item.habitId);
      if (habit && !item.completed) {
        // Mark as completed today
        const today = new Date().toISOString().split('T')[0];
        setHabits(habits.map(h =>
          h.id === item.habitId
            ? {
                ...h,
                lastCompleted: today,
                streak: h.lastCompleted && 
                  new Date(h.lastCompleted).toISOString().split('T')[0] === 
                  new Date(Date.now() - 86400000).toISOString().split('T')[0]
                  ? h.streak + 1
                  : 1
              }
            : h
        ));
      }
    }
    // Manual tasks: only update in dailyPlan (already done above)
  };

  // Update daily plan task
  const updateDailyPlanTask = (id, updates) => {
    setDailyPlan(prev => ({
      ...prev,
      plannedTasks: prev.plannedTasks.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    }));
  };

  // Clear daily plan
  const clearDailyPlan = () => {
    const today = new Date().toISOString().split('T')[0];
    setDailyPlan({ date: today, plannedTasks: [] });
  };

  // ========== END DAILY PLAN FUNCTIONS ==========

  const clearAllData = () => {
    setGoals([]);
    setProjects([]);
    setTasks([]);
    setHabits([]);
    setDailyTasks([]);
    setDailyPlan({ date: new Date().toISOString().split('T')[0], plannedTasks: [] });
    setScores({ productivity: 0, discipline: 0 });
    setUser(null);
  };

  const value = {
    token,
    user,
    setUser,
    setToken,
    navigate,
    backendURL,
    goals,
    projects,
    tasks,
    habits,
    dailyTasks,
    dailyPlan,
    scores,
    addGoal,
    addProject,
    addTask,
    addHabit,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
    updateGoal,
    deleteGoal,
    updateProject,
    deleteProject,
    updateHabit,
    deleteHabit,
    updateScores,
    setDailyTasksList,
    addToDailyPlan,
    removeFromDailyPlan,
    createManualDailyTask,
    toggleDailyPlanTaskCompletion,
    updateDailyPlanTask,
    clearDailyPlan,
    clearAllData,
    calculateGoalProgress,
    calculateProjectProgress,
    getTasksByGoal,
    getTasksByProject,
    getProjectsByGoal,
    getImportantTasks,
    getBehindTasks,
    calculateProductivityScore,
    calculateDisciplineScore
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};