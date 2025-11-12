import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  User,
  Book,
  Folder,
  MessageSquare,
  Reply,
  Users,
  Sparkles,
  Target,
  TrendingUp,
  X,
  PartyPopper,
  ExternalLink,
} from 'lucide-react';
import {
  getJourneyWithTasks,
  updateTaskProgress,
  getOnboardingBuddy,
  JourneyWithTasks,
  OnboardingTask,
  OnboardingProgress,
  OnboardingBuddy,
} from '@/services/onboarding';
import { getUser } from '@/services/users/user-manager';
import { toast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Header from '@/components/community/Header';
import Sidebar from '@/components/community/Sidebar';
import ConfettiCelebration from '@/components/onboarding/ConfettiCelebration';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  user: User,
  book: Book,
  folder: Folder,
  'message-square': MessageSquare,
  reply: Reply,
  users: Users,
};

// Get icon color based on task status (matching community style)
const getIconColor = (isCompleted: boolean, isInProgress: boolean): string => {
  if (isCompleted) {
    return 'text-green-600 dark:text-green-400';
  }
  if (isInProgress) {
    return 'text-blue-600 dark:text-blue-400';
  }
  return 'text-gray-600 dark:text-gray-400';
};

const Onboarding = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<JourneyWithTasks | null>(null);
  const [buddy, setBuddy] = useState<OnboardingBuddy | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [completedTaskTitle, setCompletedTaskTitle] = useState<string>('');

  const currentUser = getUser();
  const userId = currentUser?.profile?.sub || '';

  // Fetch onboarding journey with tasks
  const { data: journeyData, isLoading, error } = useQuery({
    queryKey: ['onboarding', userId],
    queryFn: () => getJourneyWithTasks(userId, 1), // Default journey ID
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Fetch buddy
  const { data: buddyData } = useQuery({
    queryKey: ['onboarding-buddy', userId],
    queryFn: () => getOnboardingBuddy(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (journeyData) {
      setSelectedJourney(journeyData);
    }
  }, [journeyData]);

  useEffect(() => {
    if (buddyData) {
      setBuddy(buddyData);
    }
  }, [buddyData]);

  // Update task progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ taskId, status, notes }: { taskId: number; status: 'pending' | 'in_progress' | 'completed' | 'skipped'; notes?: string }) =>
      updateTaskProgress(userId, taskId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', userId] });
      // Toast removed - celebration dialog shows instead
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleTaskClick = (task: OnboardingTask) => {
    // Navigate to the task detail page
    navigate(`/onboarding/task/${task.id}`);
  };

  const handleTaskComplete = (task: OnboardingTask, completed: boolean) => {
    const status = completed ? 'completed' : 'pending';
    
    // Show celebration when task is completed
    if (completed) {
      setCompletedTaskTitle(task.title);
      setShowCelebration(true);
      
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
    
    updateProgressMutation.mutate({
      taskId: task.id,
      status,
    });
  };

  const getTaskStatus = (taskId: number): OnboardingProgress | undefined => {
    return selectedJourney?.progress?.find(p => p.task_id === taskId);
  };

  const getProgressPercentage = (): number => {
    if (!selectedJourney || !selectedJourney.tasks.length) return 0;
    
    const completedTasks = selectedJourney.tasks.filter(task => {
      const progress = getTaskStatus(task.id);
      return progress?.status === 'completed';
    }).length;

    return Math.round((completedTasks / selectedJourney.tasks.length) * 100);
  };

  const getCompletedTasksCount = (): number => {
    if (!selectedJourney) return 0;
    return selectedJourney.tasks.filter(task => {
      const progress = getTaskStatus(task.id);
      return progress?.status === 'completed';
    }).length;
  };

  const getRequiredTasksCompleted = (): boolean => {
    if (!selectedJourney) return false;
    const requiredTasks = selectedJourney.tasks.filter(t => t.is_required);
    return requiredTasks.every(task => {
      const progress = getTaskStatus(task.id);
      return progress?.status === 'completed';
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your onboarding journey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedJourney) {
    return (
      <div className="min-h-screen">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Error Loading Onboarding</CardTitle>
              <CardDescription>
                We couldn't load your onboarding journey. Please try again later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();
  const completedCount = getCompletedTasksCount();
  const allRequiredCompleted = getRequiredTasksCompleted();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-950/10 dark:via-pink-950/10 dark:to-blue-950/10">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex">
          {/* Mobile Sidebar */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-[70]">
              <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-[80]">
                <Sidebar isMobile />
              </div>
            </div>
          )}

          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 md:ml-64">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
              {/* Header Section */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to Fastn Community!</h1>
                    <p className="text-muted-foreground mt-1">
                      Let's get you started with a quick onboarding journey
                    </p>
                  </div>
                </div>

                {/* Progress Overview */}
                <Card className="mb-6 border-2 bg-gradient-to-r from-purple-50/50 via-pink-50/50 to-blue-50/50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-blue-950/20 backdrop-blur-sm animate-card-in shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Overall Progress</p>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold">{progressPercentage}%</h3>
                          <Badge variant="secondary" className="ml-2">
                            {completedCount} of {selectedJourney.tasks.length} tasks
                          </Badge>
                        </div>
                      </div>
                      {allRequiredCompleted && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Required Tasks Complete
                        </Badge>
                      )}
                    </div>
                    <Progress value={progressPercentage} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {selectedJourney.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Tasks Section */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Your Onboarding Tasks
                    </h2>
                  </div>

                  {selectedJourney.tasks.map((task, index) => {
                    const progress = getTaskStatus(task.id);
                    const isCompleted = progress?.status === 'completed';
                    const isInProgress = progress?.status === 'in_progress';
                    const TaskIcon = iconMap[task.icon || 'circle'] || Circle;

                    return (
                      <Card
                        key={task.id}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                        }}
                        className={`card-hover-animate animate-card-in backdrop-blur-sm ${
                          isCompleted 
                            ? 'border-green-500/50 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30' 
                            : isInProgress
                            ? 'border-primary/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20'
                            : 'bg-gradient-to-r from-white/80 via-purple-50/30 to-blue-50/30 dark:from-gray-900/80 dark:via-purple-950/10 dark:to-blue-950/10'
                        }`}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <TaskIcon className={`h-5 w-5 ${getIconColor(isCompleted, isInProgress)}`} />
                            <div className="flex-1">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-lg">{task.title}</h3>
                                    {task.is_required && (
                                      <Badge variant="outline" className="text-xs">Required</Badge>
                                    )}
                                    {isCompleted && (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {task.description}
                                  </p>
                                  {task.estimated_minutes && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                      <Clock className="h-3 w-3" />
                                      ~{task.estimated_minutes} minutes
                                    </div>
                                  )}
                                </div>
                                <Checkbox
                                  checked={isCompleted}
                                  onCheckedChange={(checked) => handleTaskComplete(task, checked as boolean)}
                                  className="mt-1"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                {task.action_url && (
                                  <Button
                                    variant={isCompleted ? "outline" : "default"}
                                    size="sm"
                                    onClick={() => handleTaskClick(task)}
                                    className="flex items-center gap-1 transition-all duration-300 hover:scale-105 hover:shadow-md group"
                                  >
                                    {isCompleted ? 'Review' : 'Start Task'}
                                    <ArrowRight className={`h-3 w-3 transition-transform duration-300 ${
                                      !isCompleted ? 'group-hover:translate-x-1' : ''
                                    }`} />
                                  </Button>
                                )}
                                {isInProgress && (
                                  <Badge variant="secondary" className="text-xs">
                                    In Progress
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Sidebar - Stats & Buddy */}
                <div className="space-y-4">
                  {/* Stats Card */}
                  <Card className="animate-card-in shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 animate-pulse" />
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tasks Completed</span>
                        <span className="font-semibold">{completedCount}/{selectedJourney.tasks.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Required Tasks</span>
                        <span className="font-semibold">
                          {selectedJourney.tasks.filter(t => t.is_required).length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Optional Tasks</span>
                        <span className="font-semibold">
                          {selectedJourney.tasks.filter(t => !t.is_required).length}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Progress</span>
                          <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Buddy Card */}
                  {buddy ? (
                    <Card className="bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/40 dark:from-blue-950/15 dark:via-purple-950/15 dark:to-pink-950/15 backdrop-blur-sm animate-card-in shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 animate-pulse" />
                          Your Buddy
                        </CardTitle>
                        <CardDescription>
                          You've been paired with an experienced community member
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {buddy.slack_channel_url && (
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-sm"
                            onClick={() => window.open(buddy.slack_channel_url, '_blank', 'noopener,noreferrer')}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Join Slack Channel
                            <ExternalLink className="h-3 w-3 ml-2" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-dashed bg-gradient-to-br from-purple-50/30 via-pink-50/20 to-blue-50/30 dark:from-purple-950/10 dark:via-pink-950/10 dark:to-blue-950/10 backdrop-blur-sm animate-card-in shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-solid">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 transition-transform duration-300 hover:scale-110" />
                          Get a Buddy
                        </CardTitle>
                        <CardDescription>
                          Connect with an experienced member for guidance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" size="sm" className="w-full">
                          Request Buddy
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Completion Card */}
                  {allRequiredCompleted && (
                    <Card className="border-green-500 bg-green-50/50 dark:bg-green-950/20 animate-card-in shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                          <CheckCircle2 className="h-5 w-5 animate-pulse" />
                          Congratulations!
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-green-700 dark:text-green-400 mb-4">
                          You've completed all required onboarding tasks. You're all set to explore the community!
                        </p>
                        <Button 
                          onClick={() => {
                            localStorage.setItem("onboarding_completed", "true");
                            navigate('/');
                          }} 
                          className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          Explore Community
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confetti Celebration */}
      <ConfettiCelebration 
        show={showCelebration} 
        onComplete={() => setShowCelebration(false)}
      />

      {/* Celebration Dialog - Friendly & Modern */}
      {showCelebration && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="relative flex flex-col items-center justify-center text-center space-y-5 py-10 px-8 pointer-events-auto animate-scale-in">
            {/* Celebration Emoji and Animation */}
            <div className="relative animate-scale-bounce">
              <div className="text-[10rem] drop-shadow-2xl leading-none">🎉</div>
              <div className="absolute -top-3 -right-3 text-7xl animate-pulse drop-shadow-xl">✨</div>
              <div className="absolute -bottom-3 -left-3 text-7xl animate-pulse delay-75 drop-shadow-xl">⭐</div>
              <div className="absolute top-10 -left-10 text-6xl animate-pulse delay-150 drop-shadow-xl">🌟</div>
              <div className="absolute bottom-10 -right-10 text-6xl animate-pulse delay-200 drop-shadow-xl">💫</div>
            </div>
            
            <div className="space-y-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl border border-white/20">
              <h3 className="text-5xl font-extrabold drop-shadow-2xl animate-scale-in-delay bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                Amazing Work! 🎊
              </h3>
              
              <p className="text-2xl font-bold text-foreground drop-shadow-lg animate-scale-in-delay-2">
                "{completedTaskTitle}"
              </p>
              
              <div className="flex items-center justify-center gap-3 text-xl text-muted-foreground mt-4 drop-shadow-md animate-scale-in-delay-3">
                <CheckCircle2 className="h-7 w-7 text-green-500 animate-pulse" />
                <span className="font-semibold">You're crushing it! Keep going! 🚀</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthGuard>
  );
};

export default Onboarding;

