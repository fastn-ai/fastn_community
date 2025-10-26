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
} from 'lucide-react';
import { ApiService, Topic, User, Category } from '@/services/api';
import { queryKeys } from '@/services/queryClient';
import { toast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth/AuthGuard';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
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
      console.log("Starting approve mutation for topic:", topicId);
      const result = await ApiService.updateTopicStatus(topicId, 'approved');
      console.log("Approve mutation result:", result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Topic approved successfully',
      });
    },
    onError: (error) => {
      console.error("Approve mutation error:", error);
      toast({
        title: 'Error',
        description: `Failed to approve topic: ${error.message}`,
        variant: 'destructive',
      });
    },
    onSettled: async () => {
      
      // Explicitly call getAllTopics to refresh the data
      try {
        console.log("Refreshing topics after approve mutation...");
        const freshTopics = await ApiService.getAllTopics(true); // forceRefresh: true
        queryClient.setQueryData(queryKeys.topics, freshTopics);
        console.log("Topics refreshed successfully:", freshTopics.length, "topics");
      } catch (error) {
        console.error("Failed to refresh topics after approve:", error);
      }
    },
  });

  const rejectTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      console.log("Starting reject mutation for topic:", topicId);
      const result = await ApiService.updateTopicStatus(topicId, 'rejected');
      console.log("Reject mutation result:", result);
      return result;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Topic rejected successfully',
      });
    },
    onError: (error) => {
      console.error("Reject mutation error:", error);
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
        console.log("Refreshing topics after reject mutation...");
        const freshTopics = await ApiService.getAllTopics(true); // forceRefresh: true
        queryClient.setQueryData(queryKeys.topics, freshTopics);
        console.log("Topics refreshed successfully:", freshTopics.length, "topics");
      } catch (error) {
        console.error("Failed to refresh topics after reject:", error);
      }
    },
  });

  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      // Note: Implement deleteTopicApi method in ApiService if needed
      console.log("Deleting topic", topicId);
      throw new Error("Delete functionality not yet implemented in API");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.topics });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
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
      console.log("Approve request already in progress, skipping");
      return;
    }
    console.log("Approving topic:", topicId);
    approveTopicMutation.mutate(topicId);
  };

  const handleReject = (topicId: string) => {
    if (rejectTopicMutation.isPending) {
      console.log("Reject request already in progress, skipping");
      return;
    }
    console.log("Rejecting topic:", topicId);
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
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (analyticsLoading || topicsLoading || usersLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true} requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your community platform</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Topic
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

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.activeUsers} active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalTopics}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.pendingTopics} pending approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Across all topics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.totalLikes}</div>
              <p className="text-xs text-muted-foreground">
                Community engagement
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Topics */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topics?.slice(0, 5).map((topic) => (
                      <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{topic.title}</h4>
                          <p className="text-xs text-gray-500">by {topic.author_username}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(topic.status || 'pending')}
                          <span className="text-xs text-gray-500">{topic.view_count} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Topic Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Approved</span>
                      </div>
                      <span className="font-medium">{analytics?.approvedTopics}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="font-medium">{analytics?.pendingTopics}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-sm">Rejected</span>
                      </div>
                      <span className="font-medium">{analytics?.rejectedTopics}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="topics" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                <SelectTrigger className="w-40">
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
                  console.log("Manual refresh clicked");
                  // Invalidate and refetch with force refresh
                  await queryClient.invalidateQueries({ queryKey: queryKeys.topics });
                  await queryClient.refetchQueries({ 
                    queryKey: queryKeys.topics,
                    type: 'active'
                  });
                  
                  console.log("Manual refresh completed");
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {/* Topics Table */}
            <Card>
              <CardHeader>
                <CardTitle>Topics Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTopics.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell className="font-medium">{topic.title}</TableCell>
                        <TableCell>{topic.author_username}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{topic.category_name}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(topic.status || 'pending')}</TableCell>
                        <TableCell>{topic.view_count}</TableCell>
                        <TableCell>
                          {new Date(topic.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {topic.status === 'pending' && (
                              <>
                                <Button
                                  key={`approve-${topic.id}`}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApprove(topic.id.toString())}
                                  disabled={approveTopicMutation.isPending}
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                                <Button
                                  key={`reject-${topic.id}`}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReject(topic.id.toString())}
                                  disabled={rejectTopicMutation.isPending}
                                >
                                  <XCircle className="w-3 h-3" />
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
                              >
                                <XCircle className="w-3 h-3" />
                              </Button>
                            )}
                            {topic.status === 'rejected' && (
                              <Button
                                key={`approve-${topic.id}`}
                                size="sm"
                                variant="outline"
                                onClick={() => handleApprove(topic.id.toString())}
                                disabled={approveTopicMutation.isPending}
                              >
                                <CheckCircle className="w-3 h-3" />
                              </Button>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="w-3 h-3" />
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reputation</TableHead>
                      <TableHead>Topics</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'secondary'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.reputation_score}</TableCell>
                        <TableCell>{user.topics_count}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              {user.is_active ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Users</span>
                      <span className="font-medium">{analytics?.totalUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-medium">{analytics?.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Topics</span>
                      <span className="font-medium">{analytics?.totalTopics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Replies</span>
                      <span className="font-medium">{analytics?.totalReplies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Views</span>
                      <span className="font-medium">{analytics?.totalViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Likes</span>
                      <span className="font-medium">{analytics?.totalLikes}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Topic Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Approved</span>
                      </div>
                      <span className="font-medium">{analytics?.approvedTopics}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>Pending</span>
                      </div>
                      <span className="font-medium">{analytics?.pendingTopics}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Rejected</span>
                      </div>
                      <span className="font-medium">{analytics?.rejectedTopics}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
