interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  category: 'work' | 'personal';
  deadline?: string;
  createdAt: string;
  completedAt?: string;
  userId: string; // Add userId to associate tasks with users
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: number;
  period: 'daily' | 'weekly' | 'monthly';
  category: string;
  createdAt: string;
  lastUpdated: string;
  userId: string; // Add userId to associate goals with users
  order?: number;
}

interface DailyTaskModel {
  date: string;
  userId: string; // Add userId to associate daily models with users
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

interface UserActivity {
  lastLogin: string;
  loginDates: string[];
  loginStreak: number;
  maxLoginStreak: number;
}

interface StreakInfo {
  taskStreak: number;
  loginStreak: number;
  combinedStreak: number;
}

class DataService {
  private static TASKS_KEY = 'boostboard_tasks';
  private static GOALS_KEY = 'boostboard_goals';
  private static DAILY_MODELS_KEY = 'boostboard_daily_models';
  private static USER_ACTIVITY_KEY = 'boostboard_user_activity';

  // Task Management
  getTasks(userId: string): Task[] {
    const tasks = localStorage.getItem(DataService.TASKS_KEY);
    const allTasks = tasks ? JSON.parse(tasks) : [];
    return allTasks.filter((task: Task) => task.userId === userId);
  }

  saveTasks(tasks: Task[]): void {
    // Get all tasks, not just for one user
    const allTasks = localStorage.getItem(DataService.TASKS_KEY);
    const existingTasks = allTasks ? JSON.parse(allTasks) : [];
    
    // Remove tasks for this user and add the new ones
    if (tasks.length > 0) {
      const userId = tasks[0].userId;
      const otherUsersTasks = existingTasks.filter((task: Task) => task.userId !== userId);
      const updatedTasks = [...otherUsersTasks, ...tasks];
      localStorage.setItem(DataService.TASKS_KEY, JSON.stringify(updatedTasks));
    } else {
      localStorage.setItem(DataService.TASKS_KEY, JSON.stringify(existingTasks));
    }
    
    // Only update daily model for the current user's tasks
    if (tasks.length > 0) {
      this.updateDailyModel(tasks);
    }
  }

  addTask(task: Omit<Task, 'id' | 'createdAt'> & { userId: string }): Task {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const tasks = this.getTasks(task.userId);
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  updateTask(taskId: string, updates: Partial<Task>, userId: string): Task | null {
    const tasks = this.getTasks(userId);
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    tasks[taskIndex] = { 
      ...tasks[taskIndex], 
      ...updates,
      completedAt: updates.completed ? new Date().toISOString() : undefined
    };
    this.saveTasks(tasks);
    return tasks[taskIndex];
  }

  deleteTask(taskId: string, userId: string): boolean {
    const tasks = this.getTasks(userId);
    const filteredTasks = tasks.filter(t => t.id !== taskId);
    if (filteredTasks.length !== tasks.length) {
      this.saveTasks(filteredTasks);
      return true;
    }
    return false;
  }

  reorderTasks(newTaskOrder: Task[], userId: string): void {
    const currentTasks = this.getTasks(userId);
    // Validate that we have the same tasks (just in different order)
    if (newTaskOrder.length !== currentTasks.length) {
      throw new Error('Invalid task reordering: task count mismatch');
    }

    // Optional: Additional validation could check that all IDs are present
    const currentIds = new Set(currentTasks.map(t => t.id));
    const newIds = new Set(newTaskOrder.map(t => t.id));
    
    if (currentIds.size !== newIds.size) {
      throw new Error('Invalid task reordering: task IDs mismatch');
    }
    
    // Apply the new order
    this.saveTasks(newTaskOrder);
  }

  // Goal Management
  getGoals(userId: string): Goal[] {
    const goals = localStorage.getItem(DataService.GOALS_KEY);
    const allGoals = goals ? JSON.parse(goals) : [];
    return allGoals.filter((goal: Goal) => goal.userId === userId);
  }

  saveGoals(goals: Goal[]): void {
    // Get all goals, not just for one user
    const allGoals = localStorage.getItem(DataService.GOALS_KEY);
    const existingGoals = allGoals ? JSON.parse(allGoals) : [];
    
    // Remove goals for this user and add the new ones
    if (goals.length > 0) {
      const userId = goals[0].userId;
      const otherUsersGoals = existingGoals.filter((goal: Goal) => goal.userId !== userId);
      const updatedGoals = [...otherUsersGoals, ...goals];
      localStorage.setItem(DataService.GOALS_KEY, JSON.stringify(updatedGoals));
    } else {
      localStorage.setItem(DataService.GOALS_KEY, JSON.stringify(existingGoals));
    }
  }

  addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'lastUpdated'> & { userId: string }): Goal {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    const goals = this.getGoals(goal.userId);
    goals.push(newGoal);
    this.saveGoals(goals);
    return newGoal;
  }

  updateGoal(goalId: string, updates: Partial<Goal>, userId: string): Goal | null {
    const goals = this.getGoals(userId);
    const goalIndex = goals.findIndex(g => g.id === goalId);
    if (goalIndex === -1) return null;

    goals[goalIndex] = { 
      ...goals[goalIndex], 
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    this.saveGoals(goals);
    return goals[goalIndex];
  }

  deleteGoal(goalId: string, userId: string): boolean {
    const goals = this.getGoals(userId);
    const filteredGoals = goals.filter(g => g.id !== goalId);
    if (filteredGoals.length !== goals.length) {
      this.saveGoals(filteredGoals);
      return true;
    }
    return false;
  }

  // Daily Task Model
  private updateDailyModel(tasks: Task[]): void {
    if (tasks.length === 0) return;
    
    const userId = tasks[0].userId;
    const today = new Date().toDateString();
    const todayTasks = tasks.filter(task => 
      new Date(task.createdAt).toDateString() === today
    );

    const dailyModel: DailyTaskModel = {
      date: today,
      userId: userId, // Add userId to DailyTaskModel
      tasks: todayTasks,
      totalTasks: todayTasks.length,
      completedTasks: todayTasks.filter(t => t.completed).length,
      completionRate: todayTasks.length > 0 ? 
        (todayTasks.filter(t => t.completed).length / todayTasks.length) * 100 : 0
    };

    const dailyModels = this.getDailyModels();
    const existingIndex = dailyModels.findIndex(m => m.date === today && m.userId === userId);
    
    if (existingIndex >= 0) {
      dailyModels[existingIndex] = dailyModel;
    } else {
      dailyModels.push(dailyModel);
    }

    localStorage.setItem(DataService.DAILY_MODELS_KEY, JSON.stringify(dailyModels));
  }

  getDailyModels(userId?: string): DailyTaskModel[] {
    const models = localStorage.getItem(DataService.DAILY_MODELS_KEY);
    const allModels = models ? JSON.parse(models) : [];
    
    // If userId is provided, filter by userId
    return userId ? allModels.filter((m: DailyTaskModel) => m.userId === userId) : allModels;
  }

  getTodayModel(userId: string): DailyTaskModel | null {
    const today = new Date().toDateString();
    const models = this.getDailyModels();
    return models.find(m => m.date === today && m.userId === userId) || null;
  }

  // User Activity Management
  private getUserActivity(): UserActivity {
    const activityData = localStorage.getItem(DataService.USER_ACTIVITY_KEY);
    if (activityData) {
      return JSON.parse(activityData);
    }
    // Default activity if none exists
    return {
      lastLogin: new Date().toISOString(),
      loginDates: [new Date().toDateString()],
      loginStreak: 1,
      maxLoginStreak: 1
    };
  }

  private saveUserActivity(activity: UserActivity): void {
    localStorage.setItem(DataService.USER_ACTIVITY_KEY, JSON.stringify(activity));
  }

  async trackLogin(): Promise<UserActivity> {
    try {
      // First try API call
      const response = await fetch('/api/users/track-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const activity: UserActivity = {
          lastLogin: data.lastLogin,
          loginDates: data.loginDates,
          loginStreak: data.loginStreak,
          maxLoginStreak: data.maxLoginStreak || data.loginStreak
        };
        this.saveUserActivity(activity);
        return activity;
      } else {
        // Handle non-ok responses explicitly
        console.warn('Server returned status:', response.status);
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      console.error('API track login failed, using local fallback', error);
    }
    
    // Fallback to local storage method
    const today = new Date().toDateString();
    const activity = this.getUserActivity();
    const lastLoginDate = new Date(activity.lastLogin).toDateString();
    
    // Update last login time
    activity.lastLogin = new Date().toISOString();
    
    // If already logged in today, don't update streak
    if (activity.loginDates.includes(today)) {
      this.saveUserActivity(activity);
      return activity;
    }
    
    // Add today to login dates
    activity.loginDates.push(today);
    
    // Calculate streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();
    
    if (lastLoginDate === yesterdayString) {
      // Consecutive login - increase streak
      activity.loginStreak += 1;
      if (activity.loginStreak > (activity.maxLoginStreak || 0)) {
        activity.maxLoginStreak = activity.loginStreak;
      }
    } else if (lastLoginDate !== today) {
      // Not consecutive and not already logged in today - reset streak
      activity.loginStreak = 1;
    }
    
    this.saveUserActivity(activity);
    return activity;
  }

  getLoginStreak(): number {
    return this.getUserActivity().loginStreak;
  }

  // Enhanced streak functionality
  async getStreak(): Promise<StreakInfo> {
    try {
      // Try to get streak from API
      const response = await fetch('/api/users/streak-info', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      
      if (response.ok) {
        return await response.json();
      } else {
        // Handle non-ok responses explicitly
        console.warn('Streak API returned status:', response.status);
        throw new Error(`API returned ${response.status}`);
      }
    } catch (error) {
      console.error('API streak fetch failed, using local fallback', error);
    }
    
    // Fallback to local calculations
    // Get task completion streak
    const models = this.getDailyModels().sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    let taskStreak = 0;
    const today = new Date();
    
    for (let i = 0; i < models.length; i++) {
      const modelDate = new Date(models[i].date);
      const daysDiff = Math.floor((today.getTime() - modelDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i && models[i].completedTasks > 0) {
        taskStreak++;
      } else {
        break;
      }
    }
    
    // Get login streak
    const loginStreak = this.getLoginStreak();
    
    // Combined streak (minimum of both - you need both to maintain a combined streak)
    const combinedStreak = Math.min(taskStreak, loginStreak);
    
    return { taskStreak, loginStreak, combinedStreak };
  }
}

export const dataService = new DataService();
export type { Task, Goal, DailyTaskModel, UserActivity, StreakInfo };
