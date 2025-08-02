import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Heart, Share2, Bookmark, MessageSquare, Eye, Clock, User, RefreshCw, AlertCircle, TrendingUp, Star } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState('all');
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

  // Filter topics based on search and category
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Topics</h1>
          <p className="text-muted-foreground">Discover and engage with the fastn community</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Questions">Questions</SelectItem>
                <SelectItem value="Announcements">Announcements</SelectItem>
                <SelectItem value="Best Practices">Best Practices</SelectItem>
                <SelectItem value="Built with fastn">Built with fastn</SelectItem>
                <SelectItem value="Showcase">Showcase</SelectItem>
                <SelectItem value="Tutorials">Tutorials</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => navigate('/new-topic')} className="bg-purple-600 hover:bg-purple-700">
              New Topic
            </Button>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="space-y-4">
          {paginatedTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No topics match your search criteria.' 
                  : 'No topics found.'}
              </p>
            </div>
          ) : (
            paginatedTopics.map((topic) => (
              <Card 
                key={topic.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-purple-300 group"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${getCategoryBadge(topic.category)} border`}>
                          {getCategoryDisplayName(topic.category)}
                        </Badge>
                        {topic.is_featured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {topic.is_hot && (
                          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                        {topic.is_new && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-2 group-hover:text-purple-600 transition-colors">
                        {topic.title}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 leading-relaxed">
                        {topic.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>User</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{topic.reply_count || 0} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{topic.view_count || 0} views</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{topic.created_at ? formatDate(topic.created_at) : 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(topic.id);
                        }}
                        className="flex items-center gap-1 hover:bg-red-50 hover:text-red-600"
                      >
                        <Heart className="h-4 w-4" />
                        <span>{topic.like_count || 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(topic);
                        }}
                        className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Share2 className="h-4 w-4" />
                        <span>{topic.share_count || 0}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(topic.id);
                        }}
                        className="flex items-center gap-1 hover:bg-yellow-50 hover:text-yellow-600"
                      >
                        <Bookmark className="h-4 w-4" />
                        <span>{topic.bookmark_count || 0}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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