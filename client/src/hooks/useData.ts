import { useState, useEffect, useCallback } from 'react';
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

  const refreshData = useCallback(async () => {
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
  }, [user]);

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
  }, [user, refreshData]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return null;
    
    const newTask = dataService.addTask({
      ...task,
      userId: user.id
    });
    refreshData(); // This will update both tasks and streak
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!user) return null;
    
    const updatedTask = dataService.updateTask(taskId, updates, user.id);
    refreshData(); // This will update both tasks and streak
    return updatedTask;
  };

  const deleteTask = (taskId: string) => {
    if (!user) return false;
    
    const success = dataService.deleteTask(taskId, user.id);
    refreshData(); // This will update both tasks and streak
    return success;
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'lastUpdated' | 'userId'>) => {
    if (!user) return null;
    
    const newGoal = dataService.addGoal({
      ...goal,
      userId: user.id
    });
    
    // Immediately update local goals state to avoid UI delay
    setGoals(prev => [...prev, newGoal]);
    refreshData();
    return newGoal;
  };

  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    if (!user) return null;
    
    const updatedGoal = dataService.updateGoal(goalId, updates, user.id);
    
    // Immediately update local goals state to avoid UI delay
    if (updatedGoal) {
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g));
    }
    
    refreshData();
    return updatedGoal;
  };

  const deleteGoal = (goalId: string) => {
    if (!user) return false;
    
    const success = dataService.deleteGoal(goalId, user.id);
    
    // Immediately update local goals state to avoid UI delay
    if (success) {
      setGoals(prev => prev.filter(g => g.id !== goalId));
    }
    
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
