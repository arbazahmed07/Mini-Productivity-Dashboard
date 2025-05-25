import { useState, useEffect } from 'react';
import { dataService, Task, Goal, DailyTaskModel, UserActivity, StreakInfo } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';

export const useData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyModel, setDailyModel] = useState<DailyTaskModel | null>(null);
  const [streak, setStreak] = useState<StreakInfo>({ 
    taskStreak: 0, 
    loginStreak: 0, 
    combinedStreak: 0 
  });
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const { user } = useAuth();

  const refreshData = async () => {
    if (!user) return;
    
    setTasks(dataService.getTasks(user.id));
    setGoals(dataService.getGoals(user.id));
    setDailyModel(dataService.getTodayModel(user.id));
    
    try {
      const streakInfo = await dataService.getStreak();
      setStreak(streakInfo);
    } catch (error) {
      console.error('Failed to fetch streak info', error);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    // Track login on component mount
    const trackUserLogin = async () => {
      try {
        const activity = await dataService.trackLogin();
        setUserActivity(activity);
      } catch (error) {
        console.error('Failed to track login', error);
      }
      
      await refreshData();
    };
    
    trackUserLogin();
  }, [user]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return null;
    
    const newTask = dataService.addTask({
      ...task,
      userId: user.id
    });
    refreshData();
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!user) return null;
    
    const updatedTask = dataService.updateTask(taskId, updates, user.id);
    refreshData();
    return updatedTask;
  };

  const deleteTask = (taskId: string) => {
    if (!user) return false;
    
    const success = dataService.deleteTask(taskId, user.id);
    refreshData();
    return success;
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'lastUpdated' | 'userId'>) => {
    if (!user) return null;
    
    const newGoal = dataService.addGoal({
      ...goal,
      userId: user.id
    });
    refreshData();
    return newGoal;
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    if (!user) return null;
    
    const updatedGoal = dataService.updateGoal(goalId, updates, user.id);
    refreshData();
    return updatedGoal;
  };

  const deleteGoal = (goalId: string) => {
    if (!user) return false;
    
    const success = dataService.deleteGoal(goalId, user.id);
    refreshData();
    return success;
  };

  return {
    tasks,
    goals,
    dailyModel,
    streak,
    userActivity,
    addTask,
    updateTask,
    deleteTask,
    addGoal,
    updateGoal,
    deleteGoal,
    refreshData
  };
};
