import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Target,
  Trash2,
  Minus,
  GripVertical,
} from "lucide-react";
import { Goal } from "@/services/dataService";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/hooks/useData";
import { useAuth } from "@/contexts/AuthContext";

const GoalsSection = () => {
  const { goals, addGoal, updateGoal, deleteGoal } = useData();
  const { user } = useAuth();
  const [newGoal, setNewGoal] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState("10");
  const [newGoalPeriod, setNewGoalPeriod] = useState<
    "daily" | "weekly" | "monthly"
  >("weekly");
  const [newGoalCategory, setNewGoalCategory] = useState("General");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddGoal = () => {
    if (newGoal.trim() && newGoalTarget) {
      try {
        addGoal({
          title: newGoal,
          progress: 0,
          target: parseInt(newGoalTarget),
          period: newGoalPeriod,
          category: newGoalCategory,
        });
        setNewGoal("");
        setNewGoalTarget("10");
        toast({
          title: "Goal added",
          description: "Your goal has been created successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add goal. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpdateProgress = (id: string, increment: number) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      const newProgress = Math.max(
        0,
        Math.min(goal.target, goal.progress + increment)
      );
      
      // First update local UI for immediate feedback
      const updatedGoal = { ...goal, progress: newProgress };
      
      // Then update the backend
      updateGoal(id, { progress: newProgress });

      if (newProgress === goal.target && increment > 0) {
        toast({
          title: "Goal completed! 🎉",
          description: `Congratulations on achieving "${goal.title}"!`,
        });
      }
    }
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
    toast({
      title: "Goal deleted",
      description: "Goal has been removed.",
    });
  };

  const handleDragStart = (e: React.DragEvent, goalId: string) => {
    setDraggedItem(goalId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", goalId);
  };

  const handleDragOver = (e: React.DragEvent, goalId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(goalId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as Element;
    const related = e.relatedTarget as Element;
    if (!target.contains(related)) {
      setDragOverItem(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetGoalId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetGoalId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedIndex = goals.findIndex((g) => g.id === draggedItem);
    const targetIndex = goals.findIndex((g) => g.id === targetGoalId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newGoals = [...goals];
    const [removed] = newGoals.splice(draggedIndex, 1);
    newGoals.splice(targetIndex, 0, removed);

    // Update the order of each goal
    newGoals.forEach((goal, index) => {
      updateGoal(goal.id, { order: index });
    });

    setDraggedItem(null);
    setDragOverItem(null);

    toast({
      title: "Goals reordered",
      description: "Your goals have been rearranged successfully.",
    });
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handlePeriodChange = (value: string) => {
    setNewGoalPeriod(value as "daily" | "weekly" | "monthly");
  };

  // Sort goals by order property
  const sortedGoals = [...goals].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 shadow-xl bg-white/80 backdrop-blur-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <Target className="h-5 w-5" />
          <span>Goals</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex space-x-2">
            <Input
              placeholder="Add a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddGoal()}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button
              onClick={handleAddGoal}
              size="icon"
              className="bg-gradient-to-r from-green-500 to-blue-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="Target"
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              min="1"
            />
            <Select value={newGoalPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Category"
              value={newGoalCategory}
              onChange={(e) => setNewGoalCategory(e.target.value)}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-4">
          {!user ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Please log in to manage your goals.</p>
            </div>
          ) : sortedGoals.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No goals yet. Set your first goal above!</p>
            </div>
          ) : (
            sortedGoals.map((goal) => (
              <div
                key={goal.id}
                draggable
                onDragStart={(e) => handleDragStart(e, goal.id)}
                onDragOver={(e) => handleDragOver(e, goal.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, goal.id)}
                onDragEnd={handleDragEnd}
                className={`space-y-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 animate-fade-in cursor-move transition-all duration-200 ${
                  draggedItem === goal.id ? "opacity-50 scale-95" : ""
                } ${
                  dragOverItem === goal.id && draggedItem !== goal.id
                    ? "ring-2 ring-blue-400 ring-opacity-50 transform scale-102"
                    : ""
                } hover:shadow-md hover:bg-gray-100 dark:hover:bg-gray-700/70`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {goal.title}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      onClick={() => handleUpdateProgress(goal.id, -1)}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleUpdateProgress(goal.id, 1)}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteGoal(goal.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Progress value={(goal.progress / goal.target) * 100} />
                <div className="text-xs flex justify-between text-gray-600 dark:text-gray-300">
                  <span>
                    {goal.progress} / {goal.target}
                  </span>
                  <Badge className="bg-blue-500 text-white">{goal.period}</Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsSection;