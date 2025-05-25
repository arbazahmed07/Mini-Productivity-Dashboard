import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, Target, Flame, Calendar, CheckSquare } from "lucide-react";
import TaskManager from "@/components/TaskManager";
import GoalsSection from "@/components/GoalsSection";
import MotivationalQuote from "@/components/MotivationalQuote";
import PomodoroTimer from "@/components/PomodoroTimer";
import StreakTracker from "@/components/StreakTracker";

import { dataService } from "@/services/dataService";

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    loginStreak: 0,
    taskStreak: 0,
    combinedStreak: 0
  });

  useEffect(() => {
    // Track user login
    dataService.trackLogin();
    updateStats();
    // Update stats every 30 seconds
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStats = () => {
    const goals = dataService.getGoals();
    const { loginStreak, taskStreak, combinedStreak } = dataService.getStreak();
    
    setStats({
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.progress >= g.target).length,
      loginStreak,
      taskStreak,
      combinedStreak
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} pt-16 sm:pt-20`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-xl border-b border-gray-200/20 dark:border-gray-700/20 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 animate-scale-in">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm sm:text-lg">BB</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BoostBoard
              </h1>
            </div>
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="dark:border-gray-600 transition-all duration-200 hover:scale-110 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Motivational Quote */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <MotivationalQuote />
            </div>
            
            {/* Task Manager */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <TaskManager />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 mt-4 lg:mt-0">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="dark:bg-gray-800/80 dark:border-gray-700/20 bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Goals</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.completedGoals}/{stats.totalGoals}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="dark:bg-gray-800/80 dark:border-gray-700/20 bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center space-x-2">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Streak</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.combinedStreak}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Streak Tracker */}
            <div className="animate-fade-in" style={{ animationDelay: '0.35s' }}>
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <StreakTracker />
              </div>
            </div>

            {/* Pomodoro Timer */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <PomodoroTimer />
              </div>
            </div>
            
            {/* Goals Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <GoalsSection />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
