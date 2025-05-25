import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, GripVertical, Calendar, Flag, Trash2 } from "lucide-react";

// Use the useData hook for user-specific data
import { useData } from "@/hooks/useData";
import { Task } from "@/services/dataService";
import { useAuth } from "@/contexts/AuthContext";

// Use your actual toast hook
import { useToast } from "@/hooks/use-toast";

const TaskManager = () => {
  const { tasks, addTask, updateTask, deleteTask, refreshData } = useData();
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState<'work' | 'personal'>('personal');
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddTask = () => {
    if (!user || !newTask.trim()) return;

    try {
      addTask({
        title: newTask,
        completed: false,
        priority: newTaskPriority,
        category: newTaskCategory
      });
      setNewTask('');
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
      toast({
        title: task.completed ? "Task unmarked" : "Task completed",
        description: task.completed ? "Task marked as incomplete." : "Great job completing this task!",
      });
    }
  };

  const handleDeleteTask = (id) => {
    deleteTask(id);
    toast({
      title: "Task deleted",
      description: "Task has been removed.",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Drag and drop handlers using HTML5 API
  const handleDragStart = (e: React.DragEvent, task: Task, index: number) => {
    setDraggedTask({ task, index });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', (e.target as HTMLElement).outerHTML);
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the container, not a child element
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.index === dropIndex || !user) {
      return;
    }

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(draggedTask.index, 1);
    newTasks.splice(dropIndex, 0, movedTask);

    try {
      // Use our dataService directly since useData doesn't have reorderTasks
      import("@/services/dataService").then(({ dataService }) => {
        dataService.reorderTasks(newTasks, user.id);
        refreshData();
        toast({
          title: "Tasks reordered",
          description: "Your task order has been updated.",
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder tasks. Please try again.",
        variant: "destructive",
      });
    }
    
    setDraggedTask(null);
    setDragOverIndex(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-xl bg-white/90 backdrop-blur-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Daily Tasks
            </span>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {tasks.filter(t => t.completed).length}/{tasks.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Task Input */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex space-x-2">
              <Input
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                className="flex-1 text-lg py-3"
              />
              <Button 
                onClick={handleAddTask} 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex space-x-3">
              <Select value={newTaskPriority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewTaskPriority(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newTaskCategory} onValueChange={(value: 'work' | 'personal') => setNewTaskCategory(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {!user ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl font-medium">Please log in to manage tasks</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl font-medium">No tasks yet!</p>
                <p className="text-sm mt-2">Add your first task above to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-move ${
                      task.completed 
                        ? 'bg-gray-50 opacity-75 border-gray-200' 
                        : 'bg-white hover:shadow-lg border-gray-200 hover:border-purple-300'
                    } ${
                      dragOverIndex === index ? 'border-purple-500 shadow-lg transform scale-[1.02]' : ''
                    } ${
                      draggedTask?.index === index ? 'opacity-50 transform rotate-2' : ''
                    }`}
                  >
                    <div className="cursor-grab active:cursor-grabbing p-1">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                    </div>
                    
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="scale-125"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-lg font-medium ${
                        task.completed 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-900'
                      }`}>
                        {task.title}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                          <Flag className="h-3 w-3 mr-1" />
                          {task.priority}
                        </Badge>
                        
                        <Badge className={`text-xs ${getCategoryColor(task.category)}`}>
                          {task.category}
                        </Badge>
                        
                        {task.deadline && (
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(task.deadline).toLocaleDateString()}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleDeleteTask(task.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskManager;
