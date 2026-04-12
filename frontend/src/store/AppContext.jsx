import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { goalAPI, projectAPI, taskAPI, habitAPI, dailyPlanAPI } from '../api/apiService';
// import { toast } from 'react-toastify';
import { showToast } from '../utils/toastHelper';

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
  const [loading, setLoading] = useState(false);

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

  // HYBRID: Load initial data from localStorage or use defaults (fallback)
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

  // Persist to localStorage whenever state changes (HYBRID - keep for now)
  // useEffect(() => {
  //   localStorage.setItem('wisemind_goals', JSON.stringify(goals));
  // }, [goals]);

  // useEffect(() => {
  //   localStorage.setItem('wisemind_projects', JSON.stringify(projects));
  // }, [projects]);

  // useEffect(() => {
  //   localStorage.setItem('wisemind_tasks', JSON.stringify(tasks));
  // }, [tasks]);

  // useEffect(() => {
  //   localStorage.setItem('wisemind_habits', JSON.stringify(habits));
  // }, [habits]);

  // useEffect(() => {
  //   localStorage.setItem('wisemind_daily_tasks', JSON.stringify(dailyTasks));
  // }, [dailyTasks]);

  //  useEffect(() => {
  //   localStorage.setItem('wisemind_daily_plan', JSON.stringify(dailyPlan));
  // }, [dailyPlan]);

  // useEffect(() => {
  //   localStorage.setItem('wisemind_scores', JSON.stringify(scores));
  // }, [scores]);

  // REMOVED: localStorage persistence (backend is now source of truth)
  // Only token and user are persisted locally




  // BACKEND INTEGRATION: Load initial data when token is available
  useEffect(() => {
    if (token && user) {
      loadInitialData();
    }
  }, [token, user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Fetch all data from backend
      const [goalsRes, projectsRes, tasksRes, habitsRes, dailyPlanRes] = await Promise.all([
        goalAPI.getAll(),
        projectAPI.getAll(),
        taskAPI.getAll(),
        habitAPI.getAll(),
        dailyPlanAPI.getToday()
      ]);

      // Update state with backend data
      if (goalsRes.success) {
        const goalsData = goalsRes.goals.map(g => ({
          ...g,
          id: g._id
        }));
        setGoals(goalsData);
      }

      if (projectsRes.success) {
        const projectsData = projectsRes.projects.map(p => ({
          ...p,
          id: p._id
        }));
        setProjects(projectsData);
      }

      if (tasksRes.success) {
        const tasksData = tasksRes.tasks.map(t => ({
          ...t,
          id: t._id
        }));
        setTasks(tasksData);
      }

      if (habitsRes.success) {
        const habitsData = habitsRes.habits.map(h => ({
          ...h,
          id: h._id
        }));
        setHabits(habitsData);
      }

      if (dailyPlanRes.success && dailyPlanRes.dailyPlan) {
        const planData = {
          ...dailyPlanRes.dailyPlan,
          plannedTasks: dailyPlanRes.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id,
            taskId: pt.taskId || null,
            habitId: pt.habitId || null
          }))
        };
        setDailyPlan(planData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load data from backend:', error);
      setLoading(false);
      // Keep localStorage data as fallback
      showToast({ message: 'Using offline data' })
    }
  };

  // Add Goal
  // const addGoal = (goal) => {

  // Add Goal - Backend Integration
  const addGoal = async (goal) => {
    try {
      const response = await goalAPI.create(goal);
      if (response.success) {
        const newGoal = {
          // id: Date.now().toString(),
          // title: goal.title,
          // type: goal.type,
          // createdAt: new Date().toISOString(),
          // ...goal
          ...response.goal,
          id: response.goal._id
        };
        setGoals([...goals, newGoal]);
        showToast({ message: response.message || 'Goal created successfully', status: 'success' })
        return newGoal;
      } else {
        showToast({ message: response.message || 'Failed to create goal', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      showToast({ message: error.message || 'Failed to create goal. Error!', status: 'error' })
      return null;
    }
  };

  // Add Project
  // const addProject = (project) => {

  // Add Project - Backend Integration
  const addProject = async (project) => {
    try {
      const response = await projectAPI.create(project);
      if (response.success) {
        const newProject = {
          // id: Date.now().toString(),
          // title: project.title,
          // goalId: project.goalId || null,
          // deadline: project.deadline,
          // createdAt: new Date().toISOString(),
          // ...project
          ...response.project,
          id: response.project._id
        };
        setProjects([...projects, newProject]);
        showToast({ message: response.message || 'Project created successfully', status: 'success' })
        return newProject;
      } else {
        showToast({ message: response.message || 'Failed to create project', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating project:', error);
      showToast({ message: error.message || 'Failed to create project', status: 'error' })
      return null;
    }
  };

  // Add Task
  // const addTask = (task) => {
  // Add Task - Backend Integration
  const addTask = async (task) => {
    try {
      const response = await taskAPI.create(task);
      if (response.success) {
        const newTask = {
          // id: Date.now().toString() + Math.random(),
          // title: task.title,
          // deadline: task.deadline,
          // completed: false,
          // goalId: task.goalId || null,
          // projectId: task.projectId || null,
          // isImportant: task.isImportant || false,
          // createdFrom: task.createdFrom || 'manual',
          // createdAt: new Date().toISOString(),
          // ...task
          ...response.task,
          id: response.task._id
        };
        setTasks([...tasks, newTask]);
        showToast({ message: response.message || 'Task created successfully', status: 'success' })
        return newTask;
      } else {
        showToast({ message: response.message || 'Failed to create task', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showToast({ message: error.message || 'Failed to create task', status: 'error' })
      return null;
    }
  };

  // Add Habit
  // const addHabit = (habit) => {
  // Add Habit - Backend Integration
  const addHabit = async (habit) => {
    try {
      const response = await habitAPI.create(habit);
      if (response.success) {
        const newHabit = {
          // id: Date.now().toString(),
          // name: habit.name,
          // type: habit.type,
          // startTime: habit.startTime,
          // endTime: habit.endTime,
          // streak: 0,
          // mode: habit.mode || '21-day',
          // createdAt: new Date().toISOString(),
          // lastCompleted: null,
          // ...habit
          ...response.habit,
          id: response.habit._id
        };
        setHabits([...habits, newHabit]);
        showToast({ message: response.message || 'Habit created successfully', status: 'success' })
        return newHabit;
      } else {
        showToast({ message: response.message || 'Failed to create habit', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      showToast({ message: error.message || 'Failed to create habit', status: 'error' })
      return null;
    }
  };

  // const toggleTaskCompletion = (taskId) => {
  // Update main tasks list
  // Toggle Task Completion - Backend Integration with Global Sync
  const toggleTaskCompletion = async (taskId) => {
    try {
      // Check if task exists in dailyPlan
      const isInDailyPlan = dailyPlan.plannedTasks.some(pt => pt.taskId === taskId);

      if (isInDailyPlan) {
        // If in daily plan, use dailyPlanAPI.toggle (backend syncs both)
        const plannedTask = dailyPlan.plannedTasks.find(pt => pt.taskId === taskId);
        if (plannedTask) {
          const response = await dailyPlanAPI.toggle(plannedTask.id);
          if (response.success) {
            // Update dailyPlan from response
            const updatedPlan = {
              ...response.dailyPlan,
              plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
                ...pt,
                id: pt._id
              }))
            };
            setDailyPlan(updatedPlan);

            // Update tasks array (find completed status from dailyPlan response)
            const updatedPlannedTask = response.dailyPlan.plannedTasks.find(pt => pt._id === plannedTask.id);
            if (updatedPlannedTask) {
              setTasks(tasks.map(task =>
                task.id === taskId
                  ? { ...task, completed: updatedPlannedTask.completed }
                  : task
              ));
            }
          }
        }
      } else {
        // Not in daily plan, use taskAPI.toggle
        const response = await taskAPI.toggle(taskId);
        if (response.success) {
          const updatedTask = {
            ...response.task,
            id: response.task._id
          };
          setTasks(tasks.map(task =>
            // task.id === taskId ? { ...task, completed: !task.completed } : task
            task.id === taskId ? updatedTask : task
          ));

          // SYNC: Update in dailyPlan if exists
          // setDailyPlan(prev => ({
          //   ...prev,
          //   plannedTasks: prev.plannedTasks.map(item =>
          //     item.taskId === taskId
          //       ? { ...item, completed: !item.completed }
          //       : item
          //   )
          // }));
        } else{
          showToast({ message: response.message || 'Failed to update task', status: 'error' })
        }
      }

      // Legacy: Update old dailyTasks for compatibility 
      setDailyTasks(dailyTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      showToast({ message: error.message || 'Failed to update task', status: 'error' })
    }
  };

  // const updateTask = (taskId, updates) => {
  // Update Task - Backend Integration
  const updateTask = async (taskId, updates) => {
    try {
      const response = await taskAPI.update({ taskId, ...updates });
      if (response.success) {
        const updatedTask = {
          ...response.task,
          id: response.task._id
        };
        setTasks(tasks.map(task =>
          // task.id === taskId ? { ...task, ...updates } : task
          task.id === taskId ? updatedTask : task
        ));
        showToast({ message: response.message || 'Task updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update task', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating task:', error);
      showToast({ message: error.message || 'Failed to update task', status: 'error' })
    }
  };

  // const deleteTask = (taskId) => {
  // Delete Task - Backend Integration
  const deleteTask = async (taskId) => {
    try {
      const response = await taskAPI.delete(taskId);
      if (response.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
        setDailyTasks(dailyTasks.filter(task => task.id !== taskId));
        showToast({ message: response.message || 'Task deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete task', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      showToast({ message: error.message || 'Failed to delete task', status: 'error' })
    }
  };

  // const updateGoal = (goalId, updates) => {
  // Update Goal - Backend Integration
  const updateGoal = async (goalId, updates) => {
    try {
      const response = await goalAPI.update({ goalId, ...updates });
      if (response.success) {
        const updatedGoal = {
          ...response.goal,
          id: response.goal._id
        };
        setGoals(goals.map(goal =>
          // goal.id === goalId ? { ...goal, ...updates } : goal
          goal.id === goalId ? updatedGoal : goal
        ));
        showToast({ message: response.message || 'Goal updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update goal', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      showToast({ message: error.message || 'Failed to update goal', status: 'error' })
    }
  };

  // const deleteGoal = (goalId) => {
  // Delete Goal - Backend Integration
  const deleteGoal = async (goalId) => {
    try {
      const response = await goalAPI.delete(goalId);
      if (response.success) {
        setGoals(goals.filter(goal => goal.id !== goalId));
        showToast({ message: response.message || 'Goal deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete goal', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      showToast({ message: error.message || 'Failed to delete goal', status: 'error' })
    }
  };

  // const updateProject = (projectId, updates) => {
  // Update Project - Backend Integration
  const updateProject = async (projectId, updates) => {
    try {
      const response = await projectAPI.update({ projectId, ...updates });
      if (response.success) {
        const updatedProject = {
          ...response.project,
          id: response.project._id
        };
        setProjects(projects.map(project =>
          // project.id === projectId ? { ...project, ...updates } : project
          project.id === projectId ? updatedProject : project
        ));
        showToast({ message: response.message || 'Project Updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update project', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating project:', error);
      showToast({ message: error.message || 'Failed to update project', status: 'error' })
    }
  };

  // const deleteProject = (projectId) => {
  // Delete Project - Backend Integration
  const deleteProject = async (projectId) => {
    try {
      const response = await projectAPI.delete(projectId);
      if (response.success) {
        setProjects(projects.filter(project => project.id !== projectId));
        showToast({ message: response.message || 'Project deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete project', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      showToast({ message: error.message || 'Failed to delete project', status: 'error' })
    }
  };

  // const updateHabit = (habitId, updates) => {
  // Update Habit - Backend Integration
  const updateHabit = async (habitId, updates) => {
    try {
      const response = await habitAPI.update({ habitId, ...updates });
      if (response.success) {
        const updatedHabit = {
          ...response.habit,
          id: response.habit._id
        };
        setHabits(habits.map(habit =>
          // habit.id === habitId ? { ...habit, ...updates } : habit
          habit.id === habitId ? updatedHabit : habit
        ));
        showToast({ message: response.message || 'Habit updated successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to update habit', status: 'error' })
      }
    } catch (error) {
      console.error('Error updating habit:', error);
      showToast({ message: error.message || 'Failed to update habit', status: 'error' })
    }
  };

  // const deleteHabit = (habitId) => {
  // Delete Habit - Backend Integration
  const deleteHabit = async (habitId) => {
    try {
      const response = await habitAPI.delete(habitId);
      if (response.success) {
        setHabits(habits.filter(habit => habit.id !== habitId));
        showToast({ message: response.message || 'Habit deleted successfully', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to delete habit', status: 'error' })
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
      showToast({ message: error.message || 'Failed to delete habit', status: 'error' })
    }
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


  // ========== DAILY PLAN FUNCTIONS (BACKEND INTEGRATION) ==========

  // Add task to daily plan
  // const addToDailyPlan = (item) => {
  //   const newItem = {
  //     id: Date.now().toString() + Math.random(),
  //     source: item.source, // 'task' | 'habit' | 'manual'
  //     taskId: item.taskId || null,
  //     habitId: item.habitId || null,
  //     title: item.title,
  //     startTime: item.startTime || '09:00',
  //     endTime: item.endTime || '10:00',
  //     completed: item.completed || false,
  //     isImportant: item.isImportant || false,
  //     ...item
  //   };

  //   setDailyPlan(prev => ({
  //     ...prev,
  //     plannedTasks: [...prev.plannedTasks, newItem]
  //   }));

  //   return newItem;

  // Add task to daily plan - Backend Integration
  const addToDailyPlan = async (item) => {
    try {
      const response = await dailyPlanAPI.add(item);
      if (response.success) {
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id
          }))
        };
        setDailyPlan(updatedPlan);
        showToast({ message: response.message || 'Added to daily plan', status: 'success' })
        return updatedPlan.plannedTasks[updatedPlan.plannedTasks.length - 1];
      } else {
        showToast({ message: response.message || 'Failed to add to daily plan', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error adding to daily plan:', error);
      showToast({ message: error.message || 'Failed to add to daily plan', status: 'error' })
      return null;
    }
  };

  // Remove from daily plan
  // const removeFromDailyPlan = (id) => {
  //   setDailyPlan(prev => ({
  //     ...prev,
  //     plannedTasks: prev.plannedTasks.filter(item => item.id !== id)
  //   }));
  // Remove from daily plan - Backend Integration
  const removeFromDailyPlan = async (id) => {
    try {
      const response = await dailyPlanAPI.remove(id);
      if (response.success) {
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id
          }))
        };
        setDailyPlan(updatedPlan);
        showToast({ message: response.message || 'Removed from daily plan', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to remove from daily plan', status: 'error' })
      }
    } catch (error) {
      showToast({ message: error.message || 'Failed to remove from daily plan', status: 'error' })
    }
  };

  // Create manual task directly in daily plan
  // const createManualDailyTask = (taskData) => {
  //   const newTask = {
  //     id: Date.now().toString() + Math.random(),
  // Create manual task directly in daily plan - Backend Integration
  const createManualDailyTask = async (taskData) => {
    try {
      const manualTaskData = {
        source: 'manual',
        // taskId: null,
        // habitId: null,
        title: taskData.title,
        startTime: taskData.startTime || '09:00',
        endTime: taskData.endTime || '10:00',
        // completed: false,
        isImportant: taskData.isImportant || false
      };

      // setDailyPlan(prev => ({
      //   ...prev,
      //   plannedTasks: [...prev.plannedTasks, newTask]
      // }));

      // return newTask;
      const response = await dailyPlanAPI.add(manualTaskData);
      if (response.success) {
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id
          }))
        };
        setDailyPlan(updatedPlan);
        showToast({ message: response.message || 'Manual task added to daily plan', status: 'success' })
        return updatedPlan.plannedTasks[updatedPlan.plannedTasks.length - 1];
      } else {
        showToast({ message: response.message || 'Failed to create manual task', status: 'error' })
        return null;
      }
    } catch (error) {
      console.error('Error creating manual task:', error);
      showToast({ message: error.message || 'Failed to create manual task', status: 'error' })
      return null;
    }
  };

  // CRITICAL: Bidirectional sync for daily plan task completion
  // const toggleDailyPlanTaskCompletion = (id) => {
  //   const item = dailyPlan.plannedTasks.find(t => t.id === id);
  //   if (!item) return;

  //   // Update in daily plan
  //   setDailyPlan(prev => ({
  //     ...prev,
  //     plannedTasks: prev.plannedTasks.map(t =>
  //       t.id === id ? { ...t, completed: !t.completed } : t
  //     )
  //   }));

  // CRITICAL: Toggle Daily Plan Task - Backend handles ALL sync (tasks, habits, streaks)
  const toggleDailyPlanTaskCompletion = async (id) => {
    try {
      const response = await dailyPlanAPI.toggle(id);
      if (response.success) {
        // Update dailyPlan from backend response
        const updatedPlan = {
          ...response.dailyPlan,
          plannedTasks: response.dailyPlan.plannedTasks.map(pt => ({
            ...pt,
            id: pt._id
          }))
        };
        setDailyPlan(updatedPlan);

        // Find the toggled item to sync with source
        const toggledItem = response.dailyPlan.plannedTasks.find(pt => pt._id === id);
        if (!toggledItem) return;


        // SYNC: Update source
        // if (item.source === 'task' && item.taskId) {
        //   // Sync with main tasks
        //   setTasks(tasks.map(task =>
        //     task.id === item.taskId
        //       ? { ...task, completed: !task.completed }
        //       : task
        //   ));
        //   // Legacy sync
        //   setDailyTasks(dailyTasks.map(task =>
        //     task.id === item.taskId
        //       ? { ...task, completed: !task.completed }
        //       : task
        //   ));
        // } else if (item.source === 'habit' && item.habitId) {
        //   // Sync with habits
        //   const habit = habits.find(h => h.id === item.habitId);
        //   if (habit && !item.completed) {
        //     // Mark as completed today
        //     const today = new Date().toISOString().split('T')[0];
        //     setHabits(habits.map(h =>
        //       h.id === item.habitId
        //         ? {
        // GLOBAL SYNC: Update source arrays based on backend changes
        if (toggledItem.source === 'task' && toggledItem.taskId) {
          // Refetch tasks to get updated completion status
          const tasksRes = await taskAPI.getAll();
          if (tasksRes.success) {
            const tasksData = tasksRes.tasks.map(t => ({
              ...t,
              id: t._id
            }));
            setTasks(tasksData);
          }
        } else if (toggledItem.source === 'habit' && toggledItem.habitId) {
          // Refetch habits to get updated streak and lastCompleted
          const habitsRes = await habitAPI.getAll();
          if (habitsRes.success) {
            const habitsData = habitsRes.habits.map(h => ({
              ...h,
              //       lastCompleted: today,
              //       streak: h.lastCompleted &&
              //         new Date(h.lastCompleted).toISOString().split('T')[0] ===
              //         new Date(Date.now() - 86400000).toISOString().split('T')[0]
              //         ? h.streak + 1
              //         : 1
              //     }
              //     : h
              // ));
              id: h._id
            }));
            setHabits(habitsData);
          }
        }
        // Manual tasks: only exist in dailyPlan (already updated above)

      } else {
        showToast({ message: response.message || 'Failed to toggle task', status: 'error' })
      }
    } catch (error) {
      console.error('Error toggling daily plan task:', error);
      showToast({ message: error.message || 'Failed to toggle task', status: 'error' })
    }
  };

  // Update daily plan task
  // const updateDailyPlanTask = (id, updates) => {
  // Update daily plan task - Backend Integration
  const updateDailyPlanTask = async (id, updates) => {
    try {
      // For now, update locally (backend doesn't have update endpoint for individual planned tasks)
      // This is typically used for time adjustments, which are plan-specific
      setDailyPlan(prev => ({
        ...prev,
        plannedTasks: prev.plannedTasks.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      }));
    } catch (error) {
      console.error('Error updating daily plan task:', error);
      showToast({ message: error.message || 'Failed to update task', status: 'error' })
    }
  };

  // Clear daily plan
  // const clearDailyPlan = () => {
    // Clear daily plan - Backend Integration
  const clearDailyPlan = async () => {
    try {
      const response = await dailyPlanAPI.clear();
      if (response.success) {
        const today = new Date().toISOString().split('T')[0];
        setDailyPlan({ date: today, plannedTasks: [] });
        showToast({ message: response.message || 'Daily plan cleared', status: 'success' })
      } else {
        showToast({ message: response.message || 'Failed to clear daily plan', status: 'error' })
      }
    } catch (error) {
      console.error('Error clearing daily plan:', error);
      showToast({ message: error.message || 'Failed to clear daily plan', status: 'error' })
    }
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