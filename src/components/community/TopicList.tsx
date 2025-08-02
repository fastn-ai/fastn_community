import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Heart, Share2, Bookmark, MessageSquare, Eye, Clock, User, RefreshCw, AlertCircle, TrendingUp, Star, FolderOpen, Plus, Trophy, HelpCircle, Zap, Megaphone } from 'lucide-react';
import { ApiService, Topic, Category } from '@/services/api';

interface TopicListProps {
  sidebarOpen: boolean;
}

const TopicList: React.FC<TopicListProps> = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch topics and categories from API
  const fetchData = async (isRetry: boolean = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching data from API...');
      
      // Fetch both topics and categories in parallel
      const [fetchedTopics, fetchedCategories] = await Promise.all([
        ApiService.getAllTopics(),
        ApiService.getAllCategories()
      ]);
      
      console.log('Data fetched successfully:', {
        topics: fetchedTopics.length,
        categories: fetchedCategories.length
      });
      
      // Debug: Log sample data
      if (fetchedTopics.length > 0) {
        console.log('Sample topic:', {
          id: fetchedTopics[0].id,
          title: fetchedTopics[0].title,
          category: fetchedTopics[0].category
        });
      }
      
      if (fetchedCategories.length > 0) {
        console.log('Sample category:', {
          id: fetchedCategories[0].id,
          name: fetchedCategories[0].name
        });
      }
      
      setTopics(fetchedTopics);
      setCategories(fetchedCategories);
      setTotalPages(Math.ceil(fetchedTopics.length / itemsPerPage));
    } catch (err) {
      console.error('Error fetching data:', err);
      
      let errorMessage = 'Failed to load data. Please try again later.';
      
      if (err instanceof Error) {
        if (err.message.includes('429')) {
          errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (err.message.includes('Network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Authentication error. Please check your API credentials.';
        } else if (err.message.includes('403')) {
          errorMessage = 'Access denied. Please check your permissions.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter topics based on search and filter
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || topic.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Paginate topics
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTopics = filteredTopics.slice(startIndex, endIndex);

  // Handle topic interactions
  const handleLike = async (topicId: string) => {
    try {
      console.log('Liking topic:', topicId);
      setTopics(prev => prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, like_count: (topic.like_count || 0) + 1 }
          : topic
      ));
    } catch (error) {
      console.error('Error liking topic:', error);
    }
  };

  const handleShare = async (topic: Topic) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: topic.title,
          text: topic.description,
          url: `${window.location.origin}/topic/${topic.id}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/topic/${topic.id}`);
        console.log('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing topic:', error);
    }
  };

  const handleBookmark = async (topicId: string) => {
    try {
      console.log('Bookmarking topic:', topicId);
      setTopics(prev => prev.map(topic => 
        topic.id === topicId 
          ? { ...topic, bookmark_count: (topic.bookmark_count || 0) + 1 }
          : topic
      ));
    } catch (error) {
      console.error('Error bookmarking topic:', error);
    }
  };

  const getCategoryBadge = (categoryName: string | undefined) => {
    if (!categoryName) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    // Map category names to badge styles
    const categoryColors: { [key: string]: string } = {
      'Questions': 'bg-blue-100 text-blue-800 border-blue-200',
      'Announcements': 'bg-red-100 text-red-800 border-red-200',
      'Best Practices': 'bg-green-100 text-green-800 border-green-200',
      'Built with fastn': 'bg-purple-100 text-purple-800 border-purple-200',
      'Showcase': 'bg-orange-100 text-orange-800 border-orange-200',
      'Tutorials': 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return categoryColors[categoryName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryDisplayName = (categoryName: string | undefined) => {
    if (!categoryName) {
      console.log('Category name is undefined/null');
      return 'Uncategorized';
    }
    
    console.log(`Category name: ${categoryName}`);
    return categoryName;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case 'all': return <MessageSquare className="h-4 w-4" />;
      case 'top': return <Trophy className="h-4 w-4" />;
      case 'Questions': return <HelpCircle className="h-4 w-4" />;
      case 'Best Practices': return <Star className="h-4 w-4" />;
      case 'Announcements': return <Megaphone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading topics and categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Unable to Load Data</h3>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={() => fetchData(true)} 
                  disabled={retrying}
                  className="flex items-center gap-2"
                >
                  {retrying ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Topics</h1>
            <p className="text-muted-foreground">Latest discussions in the fastn community</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </Button>
            <Button onClick={() => navigate('/new-topic')} className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Topic
            </Button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <Button 
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            All Topics
          </Button>
          <Button 
            variant={selectedFilter === 'top' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('top')}
            className="flex items-center gap-2"
          >
            <Trophy className="h-4 w-4" />
            Top
          </Button>
          <Button 
            variant={selectedFilter === 'Questions' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('Questions')}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Questions
          </Button>
          <Button 
            variant={selectedFilter === 'Best Practices' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('Best Practices')}
            className="flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            Best Practices
          </Button>
          <Button 
            variant={selectedFilter === 'Announcements' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('Announcements')}
            className="flex items-center gap-2"
          >
            <Megaphone className="h-4 w-4" />
            Announcements
          </Button>
        </div>

        {/* Topics Table */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-semibold text-sm">
              <div className="col-span-6">Topic</div>
              <div className="col-span-2 text-right">Replies</div>
              <div className="col-span-2 text-right">Views</div>
              <div className="col-span-2 text-right">Activity</div>
            </div>

            {/* Topics List */}
            {paginatedTopics.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery || selectedFilter !== 'all' 
                    ? 'No topics match your search criteria.' 
                    : 'No topics found.'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {paginatedTopics.map((topic) => (
                  <div 
                    key={topic.id} 
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/topic/${topic.id}`)}
                  >
                    {/* Topic Content */}
                    <div className="col-span-6">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                          {getInitials(topic.author)}
                        </div>
                        
                        {/* Topic Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground truncate">
                              {topic.title}
                            </h3>
                            {topic.is_hot && (
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                                <Zap className="w-3 h-3 mr-1" />
                                Hot
                              </Badge>
                            )}
                            {topic.is_featured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {topic.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="font-medium">{topic.author}</span>
                            <span>•</span>
                            <span>{topic.created_at ? formatDate(topic.created_at) : 'Unknown'}</span>
                            <Badge className={`${getCategoryBadge(topic.category)} text-xs`}>
                              {getCategoryDisplayName(topic.category)}
                            </Badge>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex gap-1 mt-2">
                            {topic.category && (
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                {topic.category.toLowerCase()}
                              </span>
                            )}
                            {topic.category === 'Questions' && (
                              <>
                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  oauth
                                </span>
                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  authentication
                                </span>
                                <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                                  google-api
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    <div className="col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MessageSquare className="h-4 w-4" />
                        <span>{topic.reply_count || 0}</span>
                      </div>
                    </div>

                    {/* Views */}
                    <div className="col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye className="h-4 w-4" />
                        <span>{topic.view_count || 0}</span>
                      </div>
                    </div>

                    {/* Activity */}
                    <div className="col-span-2 flex items-center justify-end">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{topic.created_at ? formatDate(topic.created_at) : 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicList;