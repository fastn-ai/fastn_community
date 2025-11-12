// Admin Dashboard - Comprehensive management interface
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Users,
  MessageSquare,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  Sparkles,
  Target,
  UserCircle,
} from 'lucide-react';
import { ApiService, Topic, User, Category } from '@/services/api';
import { queryKeys } from '@/services/queryClient';
import { toast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth/AuthGuard';
import Header from '@/components/community/Header';
import Sidebar from '@/components/community/Sidebar';
import { 
  getAllUsersOnboardingProgress, 
  getOnboardingStats,
  getOnboardingTasks,
  OnboardingProgress 
} from '@/services/onboarding';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    title: '',
    description: '',
    content: '',
    category_name: 'Questions',
    author_username: 'admin',
    tags: [] as string[],
  });

  // Fetch data with optimized caching
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: queryKeys.analytics,
    queryFn: ApiService.getAnalytics,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: topics, isLoading: topicsLoading, refetch: refetchTopics } = useQuery({
    queryKey: queryKeys.topics,
    queryFn: () => ApiService.getTopicsOptimized({ 
      forceRefresh: false, 
      includePending: true // Get all topics including pending
    }),
    staleTime: 1 * 60 * 1000, // 1 minute - shorter for admin dashboard
    gcTime: 3 * 60 * 1000, // 3 minutes
    refetchOnWindowFocus: false, // Disable to prevent duplicate calls
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: ApiService.getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: ApiService.getAllCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Mutations for topic management with optimistic updates
  const approveTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const result = await ApiService.updateTopicStatus(topicId, 'approved');
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Topic approved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to approve topic: ${error.message}`,
        variant: 'destructive',
      });
    },
    onSettled: async () => {
      // Explicitly call getAllTopics to refresh the data
      try {
        const freshTopics = await ApiService.getAllTopics(true); // forceRefresh: true
        queryClient.setQueryData(queryKeys.topics, freshTopics);
      } catch (error) {
        // Failed to refresh topics
      }
    },
  });

  const rejectTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const result = await ApiService.updateTopicStatus(topicId, 'rejected');
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Topic rejected successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to reject topic: ${error.message}`,
        variant: 'destructive',
      });
    },
    onSettled: async () => {
      // Always refetch after error or success to ensure consistency
      // Explicitly call getAllTopics to refresh the data
      try {
        const freshTopics = await ApiService.getAllTopics(true); // forceRefresh: true
        queryClient.setQueryData(queryKeys.topics, freshTopics);
      } catch (error) {
        // Failed to refresh topics
      }
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      const result = await ApiService.deleteTopic(topicId);
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Topic deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete topic: ${error.message}`,
        variant: 'destructive',
      });
    },
    onSettled: async () => {
      // Always refetch after error or success to ensure consistency
      // Explicitly call getAllTopics to refresh the data
      try {
        const freshTopics = await ApiService.getAllTopics(true); // forceRefresh: true
        queryClient.setQueryData(queryKeys.topics, freshTopics);
        queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
      } catch (error) {
        // Failed to refresh topics
      }
    },
  });

  const createTopicMutation = useMutation({
    mutationFn: ApiService.createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
      setIsCreateDialogOpen(false);
      setNewTopic({
        title: '',
        description: '',
        content: '',
        category_name: 'Questions',
        author_username: 'admin',
        tags: [],
      });
      toast({
        title: 'Success',
        description: 'Topic created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create topic: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Filter topics
  const filteredTopics = topics?.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.author_username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || topic.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Handle actions with debouncing to prevent double requests
  const handleApprove = (topicId: string) => {
    if (approveTopicMutation.isPending) {
      return;
    }
    approveTopicMutation.mutate(topicId);
  };

  const handleReject = (topicId: string) => {
    if (rejectTopicMutation.isPending) {
      return;
    }
    rejectTopicMutation.mutate(topicId);
  };

  const handleDelete = (topicId: string) => {
    deleteTopicMutation.mutate(topicId);
  };

  const handleCreateTopic = () => {
    createTopicMutation.mutate(newTopic);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (analyticsLoading || topicsLoading || usersLoading || categoriesLoading) {
    return (
      <AuthGuard requireAuth={true} requireAdmin={true}>
        <div className="min-h-screen bg-background">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <div className="flex">
            <Sidebar />
            <div className="flex-1 md:ml-64">
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  // Main component render
  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
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
          
          {/* Main Content */}
          <div className="flex-1 md:ml-64">
            {/* Header */}
            <div className="p-6 border-b border-border bg-gradient-subtle">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage your community platform</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 h-9 hover:bg-accent transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Export Data</span>
                    </Button>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2 h-9 bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-sm">
                          <Plus className="w-4 h-4" />
                          <span className="hidden sm:inline">Create Topic</span>
                          <span className="sm:hidden">Create</span>
                        </Button>
                      </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                  <DialogDescription>
                    Create a new topic for the community
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTopic.title}
                      onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                      placeholder="Enter topic title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newTopic.description}
                      onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                      placeholder="Enter topic description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newTopic.content}
                      onChange={(e) => setNewTopic({ ...newTopic, content: e.target.value })}
                      placeholder="Enter topic content"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTopic.category_name}
                      onValueChange={(value) => setNewTopic({ ...newTopic, category_name: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTopic} disabled={createTopicMutation.isPending}>
                    {createTopicMutation.isPending ? 'Creating...' : 'Create Topic'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
            </div>

            <div className="p-6">
              <div className="max-w-7xl mx-auto space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground">{analytics?.totalUsers || 0}</p>
                      <p className="text-sm text-muted-foreground">
                        {analytics?.activeUsers || 0} active users
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground">{analytics?.totalTopics || 0}</p>
                      <p className="text-sm text-muted-foreground">
                        {analytics?.pendingTopics || 0} pending approval
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground">{analytics?.approvedTopics || 0}</p>
                      <p className="text-sm text-muted-foreground">
                        Approved topics
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-5">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-red-500/10">
                      <Heart className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-foreground">{analytics?.totalLikes || 0}</p>
                      <p className="text-sm text-muted-foreground">
                        Community engagement
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 max-w-2xl">
                <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="topics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Topics
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Users
                </TabsTrigger>
                <TabsTrigger value="onboarding" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Onboarding
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Topics */}
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border">
                      <CardTitle className="text-lg">Recent Topics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        {topics?.slice(0, 5).map((topic) => (
                          <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-foreground">{topic.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">by {topic.author_username}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Status Overview */}
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border">
                      <CardTitle className="text-lg">Topic Status</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-green-500/10">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-muted-foreground">Approved</span>
                          </div>
                          <span className="font-semibold text-foreground">{analytics?.approvedTopics || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-yellow-500/10">
                              <Clock className="w-4 h-4 text-yellow-600" />
                            </div>
                            <span className="text-sm text-muted-foreground">Pending</span>
                          </div>
                          <span className="font-semibold text-foreground">{analytics?.pendingTopics || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-red-500/10">
                              <XCircle className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-sm text-muted-foreground">Rejected</span>
                          </div>
                          <span className="font-semibold text-foreground">{analytics?.rejectedTopics || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="topics" className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
                      <Input
                        placeholder="Search topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9 bg-muted/50 hover:bg-muted/70 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger className="w-full sm:w-40 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      try {
                        // Explicitly call getAllTopics with force refresh
                        const freshTopics = await ApiService.getAllTopics(true); // forceRefresh: true
                        queryClient.setQueryData(queryKeys.topics, freshTopics);
                        queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
                        
                        toast({
                          title: 'Refreshed',
                          description: 'Topics refreshed successfully',
                        });
                      } catch (error) {
                        toast({
                          title: 'Error',
                          description: 'Failed to refresh topics',
                          variant: 'destructive',
                        });
                      }
                    }}
                    className="flex items-center gap-2 h-9 hover:bg-accent transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                </div>

                {/* Topics Table */}
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg">Topics Management</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold">Title</TableHead>
                            <TableHead className="font-semibold">Author</TableHead>
                            <TableHead className="font-semibold">Category</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Likes</TableHead>
                            <TableHead className="font-semibold">Created</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredTopics.map((topic) => (
                            <TableRow key={topic.id} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-semibold text-foreground">{topic.title}</TableCell>
                              <TableCell className="text-muted-foreground">{topic.author_username}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">{topic.category_name}</Badge>
                              </TableCell>
                              <TableCell>{getStatusBadge(topic.status || 'pending')}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Heart className="w-4 h-4" />
                                  <span>{topic.like_count}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(topic.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                  {topic.status === 'pending' && (
                                    <>
                                      <Button
                                        key={`approve-${topic.id}`}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleApprove(topic.id.toString())}
                                        disabled={approveTopicMutation.isPending}
                                        className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 dark:hover:border-green-800 transition-colors"
                                        title="Approve"
                                      >
                                        <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                      </Button>
                                      <Button
                                        key={`reject-${topic.id}`}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleReject(topic.id.toString())}
                                        disabled={rejectTopicMutation.isPending}
                                        className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                                        title="Reject"
                                      >
                                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                                      </Button>
                                    </>
                                  )}
                                  {topic.status === 'approved' && (
                                    <Button
                                      key={`reject-${topic.id}`}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleReject(topic.id.toString())}
                                      disabled={rejectTopicMutation.isPending}
                                      className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                                      title="Reject"
                                    >
                                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                                    </Button>
                                  )}
                                  {topic.status === 'rejected' && (
                                    <Button
                                      key={`approve-${topic.id}`}
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleApprove(topic.id.toString())}
                                      disabled={approveTopicMutation.isPending}
                                      className="h-8 w-8 p-0 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-200 dark:hover:border-green-800 transition-colors"
                                      title="Approve"
                                    >
                                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                                        title="Delete"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Topic</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this topic? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDelete(topic.id.toString())}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card className="shadow-sm">
                  <CardHeader className="border-b border-border">
                    <CardTitle className="text-lg">Users Management</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold">Username</TableHead>
                            <TableHead className="font-semibold">Email</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Reputation</TableHead>
                            <TableHead className="font-semibold">Topics</TableHead>
                            <TableHead className="font-semibold">Joined</TableHead>
                            <TableHead className="font-semibold text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users?.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                              <TableCell className="font-semibold text-foreground">{user.username}</TableCell>
                              <TableCell className="text-muted-foreground">{user.email}</TableCell>
                              <TableCell>
                                <Badge 
                                  variant={user.is_active ? 'default' : 'secondary'}
                                  className={user.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                                >
                                  {user.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{user.reputation_score || 0}</TableCell>
                              <TableCell className="text-muted-foreground">{user.topics_count || 0}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="w-3.5 h-3.5 text-blue-600" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:border-primary/50 transition-colors"
                                    title={user.is_active ? 'Deactivate' : 'Activate'}
                                  >
                                    {user.is_active ? (
                                      <UserX className="w-3.5 h-3.5 text-muted-foreground" />
                                    ) : (
                                      <UserCheck className="w-3.5 h-3.5 text-green-600" />
                                    )}
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="onboarding" className="space-y-6">
                <OnboardingTrackingTab users={users || []} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border">
                      <CardTitle className="text-lg">Platform Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm text-muted-foreground">Total Users</span>
                          <span className="font-semibold text-foreground">{analytics?.totalUsers || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm text-muted-foreground">Active Users</span>
                          <span className="font-semibold text-foreground">{analytics?.activeUsers || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm text-muted-foreground">Total Topics</span>
                          <span className="font-semibold text-foreground">{analytics?.totalTopics || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <span className="text-sm text-muted-foreground">Total Replies</span>
                          <span className="font-semibold text-foreground">{analytics?.totalReplies || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-muted-foreground">Total Likes</span>
                          <span className="font-semibold text-foreground">{analytics?.totalLikes || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader className="border-b border-border">
                      <CardTitle className="text-lg">Topic Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Approved</span>
                          </div>
                          <span className="font-semibold text-foreground">{analytics?.approvedTopics || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Pending</span>
                          </div>
                          <span className="font-semibold text-foreground">{analytics?.pendingTopics || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Rejected</span>
                          </div>
                          <span className="font-semibold text-foreground">{analytics?.rejectedTopics || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

// Onboarding Tracking Component
const OnboardingTrackingTab: React.FC<{ users: User[] }> = ({ users }) => {
  const [onboardingStats, setOnboardingStats] = React.useState(getOnboardingStats());
  const [allProgress, setAllProgress] = React.useState<Record<string, OnboardingProgress[]>>({});
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      const progress = getAllUsersOnboardingProgress();
      const tasksData = await getOnboardingTasks(1);
      setAllProgress(progress);
      setTasks(tasksData);
      setOnboardingStats(getOnboardingStats());
    };
    loadData();
    
    // Refresh stats periodically
    const interval = setInterval(() => {
      const progress = getAllUsersOnboardingProgress();
      setAllProgress(progress);
      setOnboardingStats(getOnboardingStats());
    }, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const getUserProgress = (userId: string) => {
    return allProgress[userId] || [];
  };

  const getUserCompletionRate = (userId: string) => {
    const userProgress = getUserProgress(userId);
    const completed = userProgress.filter(p => p.status === 'completed').length;
    return tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
  };

  const getUserStatus = (userId: string) => {
    const userProgress = getUserProgress(userId);
    const completed = userProgress.filter(p => p.status === 'completed').length;
    const requiredTasks = tasks.filter(t => t.is_required).length;
    
    if (completed >= requiredTasks && requiredTasks > 0) {
      return { label: 'Completed', variant: 'default' as const, color: 'text-green-600' };
    } else if (completed > 0) {
      return { label: 'In Progress', variant: 'secondary' as const, color: 'text-blue-600' };
    }
    return { label: 'Not Started', variant: 'outline' as const, color: 'text-gray-600' };
  };

  const selectedUserProgress = selectedUserId ? getUserProgress(selectedUserId) : [];
  const selectedUser = users.find(u => u.id === selectedUserId);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboardingStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Users with onboarding data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onboardingStats.usersCompleted}</div>
            <p className="text-xs text-muted-foreground">Finished required tasks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{onboardingStats.usersInProgress}</div>
            <p className="text-xs text-muted-foreground">Currently onboarding</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboardingStats.averageCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              User Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
              ) : (
                users.map((user) => {
                  const status = getUserStatus(user.id);
                  const completionRate = getUserCompletionRate(user.id);
                  const userProgress = getUserProgress(user.id);
                  
                  return (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUserId === user.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{user.username || user.email}</p>
                            <Badge variant={status.variant} className="text-xs">
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${completionRate}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{completionRate}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {userProgress.filter(p => p.status === 'completed').length} of {tasks.length} tasks
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        {/* Selected User Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {selectedUser ? `${selectedUser.username || selectedUser.email}'s Tasks` : 'Select a User'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUserId && selectedUser ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {tasks.map((task) => {
                  const progress = selectedUserProgress.find(p => p.task_id === task.id);
                  const isCompleted = progress?.status === 'completed';
                  const isInProgress = progress?.status === 'in_progress';
                  
                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border ${
                        isCompleted 
                          ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20' 
                          : isInProgress
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium text-sm">{task.title}</p>
                            {task.is_required && (
                              <Badge variant="outline" className="text-xs">Required</Badge>
                            )}
                            {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {isInProgress && <Clock className="h-4 w-4 text-blue-600" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                          {progress?.completed_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Completed: {new Date(progress.completed_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant={
                            isCompleted ? 'default' : 
                            isInProgress ? 'secondary' : 
                            'outline'
                          }
                          className="text-xs"
                        >
                          {isCompleted ? 'Done' : isInProgress ? 'In Progress' : 'Pending'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <UserCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Select a user from the list to view their onboarding progress</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
