import { Card, CardContent } from "@/components/ui/card";
import { Flame, Calendar, CheckSquare, Trophy } from "lucide-react";
import { useData } from "@/hooks/useData";
import { useState, useEffect } from "react";

const StreakTracker = () => {
  const { streak, userActivity, refreshData } = useData();
  const [maxStreak, setMaxStreak] = useState(0);
  
  // Add effect to refresh data when component mounts
  useEffect(() => {
    refreshData();
  }, [refreshData]);
  
  useEffect(() => {
    if (userActivity?.maxLoginStreak) {
      setMaxStreak(userActivity.maxLoginStreak);
    }
  }, [userActivity]);
  
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardContent className="p-4">
        <h3 className="font-medium text-sm mb-3">Your Streaks</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Login Streak</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{streak.loginStreak} days</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Task Streak</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{streak.taskStreak} days</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Combined Streak</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{streak.combinedStreak} days</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Best Streak</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{maxStreak} days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakTracker;
