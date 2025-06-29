
import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, CheckCircle, Clock, AlertCircle, Trash2, Target, Sparkles, Zap } from 'lucide-react';

const Tasks = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter a task title.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          user_id: user?.id,
          title: newTask.title,
          description: newTask.description,
          task_type: newTask.type,
          status: 'pending'
        });

      if (error) throw error;

      setNewTask({ title: '', description: '', type: 'general' });
      fetchTasks();

      // Process with AI if it's not a general task
      if (newTask.type !== 'general') {
        await processTaskWithAI(newTask.title, newTask.description, newTask.type);
      }

      toast({
        title: 'Task Created!',
        description: 'Your task has been added successfully.',
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const processTaskWithAI = async (title: string, description: string, type: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-career-assistant', {
        body: {
          type: 'task_processing',
          data: { title, description, taskType: type }
        }
      });

      if (error) throw error;
      console.log('AI processed task:', data);
    } catch (error) {
      console.error('Error processing task with AI:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      fetchTasks();

      toast({
        title: 'Task Deleted',
        description: 'Task has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task.',
        variant: 'destructive',
      });
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;
      fetchTasks();

      toast({
        title: 'Status Updated',
        description: `Task marked as ${status.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getTaskTypeGradient = (type: string) => {
    switch (type) {
      case 'resume_review':
        return 'from-blue-500 to-cyan-600';
      case 'interview_prep':
        return 'from-purple-500 to-pink-600';
      case 'skill_development':
        return 'from-emerald-500 to-teal-600';
      case 'career_planning':
        return 'from-orange-500 to-red-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Task Management</h1>
                  <p className="text-indigo-100 text-lg">Organize and track your career development tasks</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Target className="w-4 h-4 mr-1" />
                    AI Powered
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Smart Tasks
                  </Badge>
                </div>
              </div>
            </div>

            {/* Task Creation Card */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center text-gray-900">
                  <Plus className="w-6 h-6 mr-2 text-blue-600" />
                  Create New Task
                </CardTitle>
                <p className="text-gray-600">Add a new task to your career development journey</p>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
                      <Input
                        placeholder="e.g., Update resume with new skills"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Task Type</label>
                      <Select
                        value={newTask.type}
                        onValueChange={(value) => setNewTask({ ...newTask, type: value })}
                      >
                        <SelectTrigger className="border-2 border-gray-200 focus:border-blue-500 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="general">📝 General Task</SelectItem>
                          <SelectItem value="resume_review">📄 Resume Review</SelectItem>
                          <SelectItem value="interview_prep">🎤 Interview Prep</SelectItem>
                          <SelectItem value="skill_development">🎯 Skill Development</SelectItem>
                          <SelectItem value="career_planning">🚀 Career Planning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <Textarea
                      placeholder="Describe your task in detail..."
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="border-2 border-gray-200 focus:border-blue-500 rounded-xl h-32 resize-none"
                    />
                  </div>
                </div>
                <Button
                  onClick={createTask}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Zap className="w-5 h-5 mr-2 animate-spin" />
                      Creating Task...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Task
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                <CardTitle className="flex items-center justify-between text-gray-900">
                  <span className="flex items-center">
                    <Target className="w-6 h-6 mr-2 text-purple-600" />
                    Your Tasks ({tasks.length})
                  </span>
                  <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                    Active: {tasks.filter(t => t.status !== 'completed').length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {tasks.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <Target className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No tasks yet</h3>
                    <p className="text-gray-600">Create your first task to start organizing your career development!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tasks.map((task) => (
                      <div key={task.id} className="group relative p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                        <div className={`absolute top-4 right-4 w-1 h-16 rounded-full bg-gradient-to-b ${getTaskTypeGradient(task.task_type)}`}></div>
                        
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(task.status)}
                            <div>
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">{task.title}</h3>
                              <p className="text-sm text-gray-600 capitalize">{task.task_type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {task.description && (
                          <p className="text-gray-700 mb-4 line-clamp-2">{task.description}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <Badge className={`${getStatusColor(task.status)} border rounded-xl`}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          
                          <div className="flex space-x-2">
                            {task.status !== 'completed' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-xl"
                                >
                                  Start
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateTaskStatus(task.id, 'completed')}
                                  className="text-green-600 border-green-200 hover:bg-green-50 rounded-xl"
                                >
                                  Complete
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 text-xs text-gray-500 font-medium">
                          Created: {new Date(task.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Tasks;
