
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [session, setSession] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workTime = 25 * 60; // 25 minutes
  const breakTime = 5 * 60; // 5 minutes

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsActive(false);
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(breakTime);
        setSession(session + 1);
      } else {
        setMode('work');
        setTimeLeft(workTime);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, mode, session]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(workTime);
    setSession(1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = mode === 'work' ? workTime : breakTime;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <Timer className="h-5 w-5" />
          <span>Pomodoro Timer</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className={`text-sm font-medium ${
            mode === 'work' 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-green-600 dark:text-green-400'
          }`}>
            {mode === 'work' ? 'Work Time' : 'Break Time'}
          </div>
          
          <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
            {formatTime(timeLeft)}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Session {session}
          </div>
        </div>

        <Progress 
          value={getProgress()} 
          className={`h-2 ${mode === 'work' ? '' : 'bg-green-100 dark:bg-green-900'}`}
        />

        <div className="flex space-x-2">
          <Button
            onClick={toggleTimer}
            className="flex-1"
            variant={isActive ? "destructive" : "default"}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button onClick={resetTimer} variant="outline" size="icon" className="dark:border-gray-600">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
