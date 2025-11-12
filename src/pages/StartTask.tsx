import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowLeft,
  User,
  Book,
  Folder,
  MessageSquare,
  Reply,
  Users,
  Target,
  Sparkles,
  ExternalLink,
  Play,
  FileText,
  Link as LinkIcon,
  HelpCircle,
  XCircle,
} from 'lucide-react';
import {
  getTaskById,
  updateTaskProgress,
  getJourneyWithTasks,
  OnboardingTask,
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

const StartTask = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Record<number, boolean>>({});
  const [questionResults, setQuestionResults] = useState<Record<number, { isCorrect: boolean; selectedOption: string }>>({});

  const currentUser = getUser();
  const userId = currentUser?.profile?.sub || '';

  // Fetch task details
  const { data: task, isLoading, error } = useQuery({
    queryKey: ['onboarding-task', taskId],
    queryFn: () => getTaskById(Number(taskId)),
    enabled: !!taskId,
  });

  // Fetch journey to get task status
  const { data: journeyData } = useQuery({
    queryKey: ['onboarding', userId],
    queryFn: () => getJourneyWithTasks(userId, 1),
    enabled: !!userId,
  });

  // Get task status from journey progress
  const getTaskStatus = () => {
    if (!journeyData?.progress) return null;
    return journeyData.progress.find(p => p.task_id === Number(taskId));
  };

  const progress = getTaskStatus();
  const isInProgress = progress?.status === 'in_progress';

  // Update task progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({ taskId, status, notes }: { taskId: number; status: 'pending' | 'in_progress' | 'completed' | 'skipped'; notes?: string }) =>
      updateTaskProgress(userId, taskId, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', userId] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-task', taskId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    },
  });

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (progress) {
      setIsCompleted(progress.status === 'completed');
    }
  }, [progress]);

  // Mark as in progress if not already
  useEffect(() => {
    if (task && !progress && taskId) {
      updateProgressMutation.mutate({
        taskId: task.id,
        status: 'in_progress',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id, progress, taskId]);

  const handleComplete = (completed: boolean) => {
    if (!task) return;
    
    // Check if task has questions and if all are answered correctly
    if (completed && task.questions && task.questions.length > 0) {
      const allQuestionsAnswered = task.questions.every(q => submittedQuestions[q.id]);
      const allCorrect = task.questions.every(q => {
        const result = questionResults[q.id];
        return result && result.isCorrect;
      });
      
      if (!allQuestionsAnswered || !allCorrect) {
        toast({
          title: "Complete Quiz Required",
          description: "Please answer all questions correctly before completing this task.",
          variant: "destructive",
        });
        return;
      }
    }
    
    const status = completed ? 'completed' : 'in_progress';
    setIsCompleted(completed);
    
    if (completed) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }
    
    updateProgressMutation.mutate({
      taskId: task.id,
      status,
    });
  };

  const handleAnswerSelect = (questionId: number, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitAnswer = (questionId: number) => {
    if (!task) return;
    
    const question = task.questions?.find(q => q.id === questionId);
    if (!question) return;
    
    const selectedOption = selectedAnswers[questionId];
    if (!selectedOption) {
      return;
    }
    
    const selectedOptionData = question.options.find(opt => opt.id === selectedOption);
    const isCorrect = selectedOptionData?.isCorrect || false;
    
    setQuestionResults(prev => ({
      ...prev,
      [questionId]: {
        isCorrect,
        selectedOption,
      },
    }));
    
    setSubmittedQuestions(prev => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleRetryQuestion = (questionId: number) => {
    setSubmittedQuestions(prev => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
    setQuestionResults(prev => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
    setSelectedAnswers(prev => {
      const newState = { ...prev };
      delete newState[questionId];
      return newState;
    });
  };

  const TaskIcon = task ? (iconMap[task.icon || 'circle'] || Circle) : Circle;

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex">
            <Sidebar />
            <div className="flex-1 md:ml-64">
              <div className="p-6">
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading task...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  if (error || !task) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-background">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex">
            <Sidebar />
            <div className="flex-1 md:ml-64">
              <div className="p-6">
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-4">Task not found</p>
                    <Button onClick={() => navigate('/onboarding')}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Onboarding
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
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
          
          <ConfettiCelebration 
            show={showCelebration} 
            onComplete={() => setShowCelebration(false)}
          />

          {/* Main Content */}
          <div className="flex-1 md:ml-64">
            {/* Header */}
            <div className="p-6 border-b border-border bg-gradient-subtle">
              <div className="max-w-4xl">
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/onboarding')}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Onboarding</span>
                  </Button>
                </div>
                <div className="flex items-start gap-4">
                  <TaskIcon className={`h-8 w-8 ${getIconColor(isCompleted, isInProgress)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-foreground">{task.title}</h1>
                      {task.is_required && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-500 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                      {isInProgress && !isCompleted && (
                        <Badge variant="secondary">In Progress</Badge>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-muted-foreground text-lg">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="max-w-4xl mx-auto space-y-6">

                {/* Task Details */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {task.estimated_minutes && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Estimated time: ~{task.estimated_minutes} minutes</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-4 w-4" />
                        <span>Task #{task.order_index}</span>
                      </div>
                    </div>

                    {/* Complete Checkbox */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={handleComplete}
                          id="task-complete"
                          className="h-5 w-5"
                        />
                        <label
                          htmlFor="task-complete"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          Mark this task as completed
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Articles Section */}
                {task.articles && task.articles.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Articles
                      </CardTitle>
                    </CardHeader>
                            <CardContent className="space-y-4">
                              {task.articles
                                .sort((a, b) => a.order_index - b.order_index)
                                .map((article) => (
                                  <div key={article.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                                    <h4 className="font-semibold mb-3 text-base">{article.title}</h4>
                                    <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                                      <ReactMarkdown
                                        components={{
                                          h1: ({ children }) => <h1 className="text-lg font-semibold mb-2 mt-4 text-foreground">{children}</h1>,
                                          h2: ({ children }) => <h2 className="text-base font-semibold mb-2 mt-3 text-foreground">{children}</h2>,
                                          h3: ({ children }) => <h3 className="text-sm font-semibold mb-2 mt-3 text-foreground">{children}</h3>,
                                          p: ({ children }) => <p className="mb-3 text-sm leading-relaxed">{children}</p>,
                                          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 ml-4">{children}</ul>,
                                          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1 ml-4">{children}</ol>,
                                          li: ({ children }) => <li className="text-sm">{children}</li>,
                                          strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                                          em: ({ children }) => <em className="italic">{children}</em>,
                                        }}
                                      >
                                        {article.content}
                                      </ReactMarkdown>
                                    </div>
                                  </div>
                                ))}
                            </CardContent>
                  </Card>
                )}

                {/* Videos Section */}
                {task.videos && task.videos.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Play className="h-5 w-5 text-primary" />
                        Videos
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {task.videos
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((video) => {
                          const videoId = getYouTubeVideoId(video.youtube_url);
                          return (
                            <div key={video.id} className="space-y-2">
                              <h4 className="font-semibold">{video.title}</h4>
                              {videoId ? (
                                <div className="aspect-video w-full rounded-lg overflow-hidden">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                  />
                                </div>
                              ) : (
                                <div className="border rounded-lg p-4 bg-muted/50">
                                  <p className="text-sm text-muted-foreground">
                                    Invalid YouTube URL: {video.youtube_url}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </CardContent>
                  </Card>
                )}

                        {/* Resources Section */}
                        {task.resources && task.resources.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <LinkIcon className="h-5 w-5 text-primary" />
                                Resources
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {task.resources
                                  .sort((a, b) => a.order_index - b.order_index)
                                  .map((resource) => (
                                    <a
                                      key={resource.id}
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
                                    >
                                      <ExternalLink className="h-5 w-5 text-muted-foreground mt-0.5 group-hover:text-primary transition-colors" />
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                                          {resource.title}
                                        </h4>
                                        {resource.description && (
                                          <p className="text-sm text-muted-foreground mt-1">
                                            {resource.description}
                                          </p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-1 truncate">
                                          {resource.url}
                                        </p>
                                      </div>
                                    </a>
                                  ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Questions Section */}
                        {task.questions && task.questions.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-primary" />
                                Quiz
                              </CardTitle>
                              <CardDescription>
                                Answer all questions correctly to complete this task
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {task.questions
                                .sort((a, b) => a.order_index - b.order_index)
                                .map((question, qIndex) => {
                                  const isSubmitted = submittedQuestions[question.id];
                                  const result = questionResults[question.id];
                                  const selectedOption = selectedAnswers[question.id];
                                  
                                  return (
                                    <div
                                      key={question.id}
                                      className={`border rounded-lg p-5 transition-all ${
                                        isSubmitted
                                          ? result?.isCorrect
                                            ? 'border-green-500/50 bg-green-50/30 dark:bg-green-950/10'
                                            : 'border-red-500/50 bg-red-50/30 dark:bg-red-950/10'
                                          : 'border-border hover:border-primary/50'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between mb-4">
                                        <h4 className="font-semibold text-base flex items-center gap-2">
                                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                            {qIndex + 1}
                                          </span>
                                          {question.question}
                                        </h4>
                                        {isSubmitted && (
                                          <div className="flex-shrink-0 ml-2">
                                            {result?.isCorrect ? (
                                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            ) : (
                                              <XCircle className="h-5 w-5 text-red-600" />
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="space-y-2 mb-4">
                                        {question.options.map((option) => {
                                          const isSelected = selectedOption === option.id;
                                          const showCorrect = isSubmitted && option.isCorrect;
                                          const showIncorrect = isSubmitted && isSelected && !option.isCorrect;
                                          
                                          return (
                                            <label
                                              key={option.id}
                                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                isSubmitted
                                                  ? option.isCorrect
                                                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                                                    : showIncorrect
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                    : 'border-border/50 bg-muted/30 cursor-not-allowed'
                                                  : isSelected
                                                  ? 'border-primary bg-primary/5'
                                                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
                                              }`}
                                            >
                                              <input
                                                type="radio"
                                                name={`question-${question.id}`}
                                                value={option.id}
                                                checked={isSelected}
                                                onChange={() => !isSubmitted && handleAnswerSelect(question.id, option.id)}
                                                disabled={isSubmitted}
                                                className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                                              />
                                              <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                  <span className="font-medium text-sm">{option.id.toUpperCase()}.</span>
                                                  <span className={`text-sm ${
                                                    showCorrect ? 'text-green-700 dark:text-green-400 font-semibold' :
                                                    showIncorrect ? 'text-red-700 dark:text-red-400' :
                                                    'text-foreground'
                                                  }`}>
                                                    {option.text}
                                                  </span>
                                                  {showCorrect && (
                                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                  )}
                                                  {showIncorrect && (
                                                    <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                                  )}
                                                </div>
                                              </div>
                                            </label>
                                          );
                                        })}
                                      </div>
                                      
                                      {isSubmitted && question.explanation && (
                                        <div className={`p-3 rounded-lg mb-4 ${
                                          result?.isCorrect
                                            ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                                            : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                                        }`}>
                                          <p className={`text-sm ${
                                            result?.isCorrect
                                              ? 'text-green-800 dark:text-green-300'
                                              : 'text-red-800 dark:text-red-300'
                                          }`}>
                                            <span className="font-semibold">
                                              {result?.isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}
                                            </span>
                                            {question.explanation}
                                          </p>
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center gap-2">
                                        {!isSubmitted ? (
                                          <Button
                                            onClick={() => handleSubmitAnswer(question.id)}
                                            disabled={!selectedOption}
                                            className="h-9"
                                          >
                                            Submit Answer
                                          </Button>
                                        ) : (
                                          <>
                                            {!result?.isCorrect && (
                                              <Button
                                                variant="outline"
                                                onClick={() => handleRetryQuestion(question.id)}
                                                className="h-9"
                                              >
                                                Try Again
                                              </Button>
                                            )}
                                            {result?.isCorrect && (
                                              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                                <CheckCircle2 className="h-4 w-4" />
                                                <span className="font-medium">Correct answer!</span>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              
                              {task.questions.every(q => submittedQuestions[q.id] && questionResults[q.id]?.isCorrect) && (
                                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                                  <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                                    <CheckCircle2 className="h-5 w-5" />
                                    <span className="font-semibold">All questions answered correctly! You can now complete this task.</span>
                                  </div>
                                </div>
                              )}

                              {/* Final Task Section */}
                              {task.final_task_requirement && (
                                <div className="mt-6 pt-6 border-t border-border">
                                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                                    <div className="flex items-start gap-3">
                                      <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-base mb-2 text-foreground">Final Task</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                          {task.final_task_requirement}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        )}

                {/* Help Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you need assistance with this task, reach out to your onboarding buddy or check the community guidelines.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/onboarding')}
                      >
                        View All Tasks
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/community')}
                      >
                        Ask Community
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default StartTask;

