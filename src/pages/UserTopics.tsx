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
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Topics</h1>
                    <p className="text-gray-600">Manage your topics and discussions</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => refetchTopics()}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                  <Button
                    onClick={() => setIsCreateTopicModalOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Topic
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Topics</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userTopics?.length || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      All your topics
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userTopics?.filter(t => t.status === 'approved').length || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Approved topics
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {userTopics?.reduce((sum, topic) => sum + topic.view_count, 0) || 0}
                    </div>
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
                    <div className="text-2xl font-bold">
                      {userTopics?.reduce((sum, topic) => sum + topic.like_count, 0) || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Community engagement
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="my-topics">My Topics</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="my-topics" className="space-y-6">
                  {/* Filters */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search your topics..."
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
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topics Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {filteredTopics.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No topics found</h3>
                          <p className="text-gray-600 mb-4">
                            {searchQuery || statusFilter !== 'all' 
                              ? 'Try adjusting your search or filter criteria.'
                              : 'You haven\'t created any topics yet.'}
                          </p>
                          {!searchQuery && statusFilter === 'all' && (
                            <Button onClick={() => setIsCreateTopicModalOpen(true)}>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Your First Topic
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Title</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Status</TableHead>
                              {/*<TableHead>Views</TableHead>*/}
                              <TableHead>Likes</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredTopics.map((topic) => (
                              <TableRow key={topic.id}>
                                <TableCell className="font-medium">
                                  <div>
                                    <div className="font-medium">{topic.title}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {topic.description}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{topic.category_name} </Badge>
                                </TableCell>
                                <TableCell>{getStatusBadge(topic.status || 'pending')}</TableCell>
                                <TableCell>{topic.view_count}</TableCell>
                                <TableCell>{topic.like_count}</TableCell>
                                <TableCell>
                                  {new Date(topic.created_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {/* <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(topic)}
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button> */}
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
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Topic Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span>Total Topics</span>
                            <span className="font-medium">{userTopics?.length || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Approved Topics</span>
                            <span className="font-medium">
                              {userTopics?.filter(t => t.status === 'approved').length || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pending Topics</span>
                            <span className="font-medium">
                              {userTopics?.filter(t => t.status === 'pending').length || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rejected Topics</span>
                            <span className="font-medium">
                              {userTopics?.filter(t => t.status === 'rejected').length || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Engagement Stats</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/*<div className="flex justify-between">
                            <span>Total Views</span>
                            <span className="font-medium">
                              {userTopics?.reduce((sum, topic) => sum + topic.view_count, 0) || 0}
                            </span>
                          </div>*/}
                          <div className="flex justify-between">
                            <span>Total Likes</span>
                            <span className="font-medium">
                              {userTopics?.reduce((sum, topic) => sum + topic.like_count, 0) || 0}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Replies</span>
                            <span className="font-medium">
                              {userTopics?.reduce((sum, topic) => sum + topic.reply_count, 0) || 0}
                            </span>
                          </div>
                          {/*<div className="flex justify-between">
                            <span>Average Views per Topic</span>
                            <span className="font-medium">
                              {userTopics?.length ? 
                                Math.round(userTopics.reduce((sum, topic) => sum + topic.view_count, 0) / userTopics.length) : 0}
                            </span>
                          </div>*/}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

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
            </div>
          </div>
        </div>
        
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
