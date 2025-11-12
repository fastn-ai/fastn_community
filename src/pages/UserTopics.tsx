import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  MessageSquare,
  Eye,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Menu,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { ApiService, Topic, Category } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { getUser } from '@/services/users/user-manager';
import Header from '@/components/community/Header';
import Sidebar from '@/components/community/Sidebar';
import CreateTopicModal from '@/components/ui/create-topic-modal';

const UserTopics = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('my-topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    content: '',
    status: 'approved' as 'approved' | 'pending' | 'rejected',
  });

  // Get current user
  const currentUser = getUser();
  const userId = currentUser?.profile?.sub || '';

  // Fetch user's topics with optimized caching
  const { data: userTopics, isLoading: topicsLoading, error: topicsError, refetch: refetchTopics } = useQuery({
    queryKey: ['userTopics', userId],
    queryFn: () => ApiService.getTopicByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refresh when user returns to tab
  });

  // Fetch categories for edit form
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: ApiService.getAllCategories,
  });

  // Update topic mutation
  const updateTopicMutation = useMutation({
    mutationFn: async ({ topicId, data }: { topicId: string; data: any }) => {
      return ApiService.updateTopic(topicId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTopics', userId] });
      setIsEditDialogOpen(false);
      setEditingTopic(null);
      toast({
        title: 'Success',
        description: 'Topic updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update topic',
        variant: 'destructive',
      });
    },
  });

  // Delete topic mutation
  const deleteTopicMutation = useMutation({
    mutationFn: async (topicId: string) => {
      return ApiService.deleteTopic(topicId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userTopics', userId] });
      toast({
        title: 'Success',
        description: 'Topic deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete topic',
        variant: 'destructive',
      });
    },
  });

  // Filter topics
  const filteredTopics = userTopics?.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || topic.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Handle edit
  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setEditForm({
      title: topic.title,
      description: topic.description,
      content: topic.content || '',
      status: (topic.status || 'pending') as 'approved' | 'pending' | 'rejected',
    });
    setIsEditDialogOpen(true);
  };

  // Handle update
  const handleUpdate = () => {
    if (!editingTopic) return;
    
    updateTopicMutation.mutate({
      topicId: editingTopic.id.toString(),
      data: editForm
    });
  };

  // Handle delete
  const handleDelete = (topicId: string) => {
    deleteTopicMutation.mutate(topicId);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status || 'pending'}</Badge>;
    }
  };

  // Loading state
  if (topicsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading your topics...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (topicsError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Failed to load topics</h2>
            <p className="text-gray-600 mb-4">There was an error loading your topics.</p>
            <Button onClick={() => refetchTopics()} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
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
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center space-x-4 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Topics</h1>
                    <p className="text-muted-foreground">Manage your topics and discussions</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => refetchTopics()}
                      className="flex items-center gap-2 h-9 hover:bg-accent transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span className="hidden sm:inline">Refresh</span>
                    </Button>
                    <Button
                      onClick={() => setIsCreateTopicModalOpen(true)}
                      className="flex items-center gap-2 h-9 bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">New Topic</span>
                      <span className="sm:hidden">New</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="max-w-6xl mx-auto space-y-6">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-5">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-foreground">{userTopics?.length || 0}</p>
                          <p className="text-sm text-muted-foreground">All your topics</p>
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
                          <p className="text-2xl font-bold text-foreground">
                            {userTopics?.filter(t => t.status === 'approved').length || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Approved topics</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardContent className="p-5">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-2xl font-bold text-foreground">
                            {userTopics?.reduce((sum, topic) => sum + topic.view_count, 0) || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Across all topics</p>
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
                          <p className="text-2xl font-bold text-foreground">
                            {userTopics?.reduce((sum, topic) => sum + topic.like_count, 0) || 0}
                          </p>
                          <p className="text-sm text-muted-foreground">Community engagement</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Main Content */}
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="my-topics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      My Topics
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                      Analytics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="my-topics" className="space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <div className="relative group">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 transition-colors group-focus-within:text-primary" />
                          <Input
                            placeholder="Search your topics..."
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
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Topics Table */}
                    <Card className="shadow-sm">
                      <CardHeader className="border-b border-border">
                        <CardTitle className="text-lg">Your Topics</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        {filteredTopics.length === 0 ? (
                          <div className="text-center py-12 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                              <MessageSquare className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">No topics found</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                              {searchQuery || statusFilter !== 'all' 
                                ? 'Try adjusting your search or filter criteria.'
                                : 'You haven\'t created any topics yet.'}
                            </p>
                            {!searchQuery && statusFilter === 'all' && (
                              <Button 
                                onClick={() => setIsCreateTopicModalOpen(true)}
                                className="bg-gradient-primary hover:opacity-90 transition-all duration-200 shadow-sm"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Your First Topic
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                  <TableHead className="font-semibold">Title</TableHead>
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
                                    <TableCell className="font-medium">
                                      <div>
                                        <div className="font-semibold text-foreground">{topic.title}</div>
                                        <div className="text-sm text-muted-foreground truncate max-w-xs mt-1">
                                          {topic.description}
                                        </div>
                                      </div>
                                    </TableCell>
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
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <Button 
                                              size="sm" 
                                              variant="outline"
                                              className="h-8 w-8 p-0 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                                            >
                                              <Trash2 className="w-3.5 h-3.5 text-red-600" />
                                            </Button>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>Delete Topic</AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Are you sure you want to delete "{topic.title}"? This action cannot be undone.
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
                        )}
                      </CardContent>
                    </Card>
                </TabsContent>

                  <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card className="shadow-sm">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="text-lg">Topic Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                              <span className="text-muted-foreground">Total Topics</span>
                              <span className="font-semibold text-foreground">{userTopics?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                              <span className="text-muted-foreground">Approved Topics</span>
                              <span className="font-semibold text-green-600">
                                {userTopics?.filter(t => t.status === 'approved').length || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                              <span className="text-muted-foreground">Pending Topics</span>
                              <span className="font-semibold text-yellow-600">
                                {userTopics?.filter(t => t.status === 'pending').length || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-muted-foreground">Rejected Topics</span>
                              <span className="font-semibold text-red-600">
                                {userTopics?.filter(t => t.status === 'rejected').length || 0}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="shadow-sm">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="text-lg">Engagement Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                              <span className="text-muted-foreground">Total Likes</span>
                              <span className="font-semibold text-foreground">
                                {userTopics?.reduce((sum, topic) => sum + topic.like_count, 0) || 0}
                              </span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span className="text-muted-foreground">Total Replies</span>
                              <span className="font-semibold text-foreground">
                                {userTopics?.reduce((sum, topic) => sum + topic.reply_count, 0) || 0}
                              </span>
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

        {/* Edit Topic Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Topic</DialogTitle>
              <DialogDescription>
                Update your topic information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Enter topic title"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Enter topic description"
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Enter topic content"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editForm.status}
                  onValueChange={(value: any) => setEditForm({ ...editForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate} 
                disabled={updateTopicMutation.isPending}
              >
                {updateTopicMutation.isPending ? 'Updating...' : 'Update Topic'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Create Topic Modal */}
        <CreateTopicModal 
          isOpen={isCreateTopicModalOpen}
          onClose={() => setIsCreateTopicModalOpen(false)}
          onSuccess={() => {
            // Refresh the topics list when a new topic is created
            refetchTopics();
          }}
          position="bottom"
        />
      </div>
    </AuthGuard>
  );
};

export default UserTopics;
