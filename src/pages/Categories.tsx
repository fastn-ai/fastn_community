import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiService, Category, Topic } from "@/services/api";
import { 
  Megaphone, 
  HelpCircle, 
  BookOpen, 
  Code, 
  Users,
  MessageSquare,
  Eye
} from "lucide-react";

const Categories = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to capitalize category names
  const capitalizeCategoryName = (name: string): string => {
    if (!name) return name;
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Category configuration with icons and styling - updated to match API categories
  const categoryConfig = {
    "request feature": {
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      path: "/request-feature",
      description: "Feature requests from users"
    },
    "question": {
      icon: HelpCircle,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      path: "/questions",
      description: "General questions and answers"
    },
    "bult with fastn": {
      icon: Code,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      path: "/built-with-fastn",
      description: "Showcase of projects built with fastn"
    },
    "feadback": {
      icon: Megaphone,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      path: "/feedback",
      description: "Product and community feedback"
    },
    // Static categories (not from API)
    "Tutorials": {
      icon: BookOpen,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      isComingSoon: true,
      description: "Step-by-step guides and learning resources"
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const [categoriesData, allTopics] = await Promise.all([
          ApiService.getAllCategories(),
          ApiService.getAllTopics()
        ]);

        // Calculate real statistics for each category
        const categoriesWithStats = categoriesData.map((category: Category) => {
          const config = categoryConfig[category.name as keyof typeof categoryConfig];
          if (!config) return null;

          // Count topics and posts for this category
          const categoryTopics = allTopics.filter((topic: Topic) => 
            topic.category_name === category.name
          );
          
          const topicsCount = categoryTopics.length;
          const postsCount = categoryTopics.reduce((total: number, topic: Topic) => 
            total + (topic.reply_count || 0), 0
          );

          return {
            ...category,
            ...config,
            topics: topicsCount,
            posts: postsCount,
            description: category.description || config.description || "Category description"
          };
        }).filter(Boolean);

        // Add static Tutorials category
        const tutorialsCategory = {
          icon: BookOpen,
          name: "Tutorials",
          description: "Step-by-step guides and learning resources",
          topics: 0,
          posts: 0,
          color: "text-green-400",
          bgColor: "bg-green-500/10",
          isComingSoon: true,
        };

        setCategories([...categoriesWithStats, tutorialsCategory]);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to default categories if API fails
        setCategories([
          {
            icon: MessageSquare,
            name: "request feature",
            description: "Feature requests from users",
            topics: 0,
            posts: 0,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            path: "/request-feature"
          },
          {
            icon: HelpCircle,
            name: "question",
            description: "General questions and answers",
            topics: 0,
            posts: 0,
            color: "text-green-400",
            bgColor: "bg-green-500/10",
            path: "/questions"
          },
          {
            icon: Code,
            name: "bult with fastn",
            description: "Showcase of projects built with fastn",
            topics: 0,
            posts: 0,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
            path: "/built-with-fastn"
          },
          {
            icon: Megaphone,
            name: "feadback",
            description: "Product and community feedback",
            topics: 0,
            posts: 0,
            color: "text-orange-400",
            bgColor: "bg-orange-500/10",
            path: "/feedback"
          },
          {
            icon: BookOpen,
            name: "Tutorials",
            description: "Step-by-step guides and learning resources",
            topics: 0,
            posts: 0,
            color: "text-green-400",
            bgColor: "bg-green-500/10",
            isComingSoon: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed top-20 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-card"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-subtle">
            <div className="max-w-4xl">
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
              <p className="text-muted-foreground">Browse topics by category</p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="p-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-full"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-4">
                          <div className="h-4 bg-muted rounded w-20"></div>
                          <div className="h-4 bg-muted rounded w-20"></div>
                        </div>
                        <div className="h-6 bg-muted rounded w-16"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
                {categories.map((category) => (
                <Card 
                  key={category.name} 
                  className={`hover:shadow-elegant transition-all border-border/50 hover:border-primary/50 ${
                    category.path ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  onClick={() => category.path && navigate(category.path)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${category.bgColor}`}>
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-foreground">{capitalizeCategoryName(category.name)}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground font-medium">
                            {category.topics} topics
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground font-medium">
                            {category.posts} posts
                          </span>
                        </div>
                      </div>
                      {category.isComingSoon ? (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                          Coming Soon
                        </Badge>
                      ) : (
                        <Badge variant="outline" className={`${category.color} border-current`}>
                          Browse
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;