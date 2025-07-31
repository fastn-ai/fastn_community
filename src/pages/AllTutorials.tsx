import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, User, Star, Filter, Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const AllTutorials = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with fastn",
      description: "Learn the basics of fastn development and build your first application",
      author: "Sarah Chen",
      authorAvatar: "/avatars/sarah.jpg",
      level: "beginner",
      category: "Getting Started",
      duration: "15 min",
      rating: 4.8,
      views: 1247,
      likes: 89,
      tags: ["fastn", "tutorial", "beginner"],
      publishedAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Database Integration with fastn",
      description: "Connect your fastn app to various databases and handle data operations",
      author: "Alex Rodriguez",
      authorAvatar: "/avatars/alex.jpg",
      level: "intermediate",
      category: "Database",
      duration: "25 min",
      rating: 4.6,
      views: 892,
      likes: 67,
      tags: ["database", "fastn", "intermediate"],
      publishedAt: "2024-01-10"
    },
    {
      id: 3,
      title: "Advanced Authentication Patterns",
      description: "Implement secure authentication and authorization in your fastn applications",
      author: "Michael Park",
      authorAvatar: "/avatars/michael.jpg",
      level: "advanced",
      category: "Authentication",
      duration: "35 min",
      rating: 4.9,
      views: 567,
      likes: 45,
      tags: ["authentication", "security", "advanced"],
      publishedAt: "2024-01-08"
    },
    {
      id: 4,
      title: "Building REST APIs with fastn",
      description: "Create robust REST APIs using fastn's powerful framework",
      author: "Emma Thompson",
      authorAvatar: "/avatars/emma.jpg",
      level: "intermediate",
      category: "API Development",
      duration: "30 min",
      rating: 4.7,
      views: 734,
      likes: 52,
      tags: ["api", "rest", "intermediate"],
      publishedAt: "2024-01-05"
    },
    {
      id: 5,
      title: "Deploying fastn Applications",
      description: "Learn how to deploy your fastn apps to production environments",
      author: "David Kim",
      authorAvatar: "/avatars/david.jpg",
      level: "intermediate",
      category: "Deployment",
      duration: "20 min",
      rating: 4.5,
      views: 456,
      likes: 38,
      tags: ["deployment", "production", "intermediate"],
      publishedAt: "2024-01-03"
    },
    {
      id: 6,
      title: "Testing Strategies for fastn",
      description: "Comprehensive guide to testing your fastn applications",
      author: "Lisa Wang",
      authorAvatar: "/avatars/lisa.jpg",
      level: "advanced",
      category: "Testing",
      duration: "40 min",
      rating: 4.8,
      views: 389,
      likes: 29,
      tags: ["testing", "quality", "advanced"],
      publishedAt: "2024-01-01"
    },
    {
      id: 7,
      title: "UI/UX Best Practices",
      description: "Design beautiful and user-friendly interfaces with fastn",
      author: "Sarah Chen",
      authorAvatar: "/avatars/sarah.jpg",
      level: "beginner",
      category: "UI/UX",
      duration: "18 min",
      rating: 4.6,
      views: 678,
      likes: 41,
      tags: ["ui", "ux", "design", "beginner"],
      publishedAt: "2023-12-28"
    },
    {
      id: 8,
      title: "Performance Optimization",
      description: "Optimize your fastn applications for better performance",
      author: "Alex Rodriguez",
      authorAvatar: "/avatars/alex.jpg",
      level: "advanced",
      category: "Performance",
      duration: "45 min",
      rating: 4.9,
      views: 234,
      likes: 18,
      tags: ["performance", "optimization", "advanced"],
      publishedAt: "2023-12-25"
    }
  ];

  const categories = [
    "Getting Started",
    "Database",
    "Authentication",
    "API Development",
    "Deployment",
    "UI/UX",
    "Testing",
    "Performance",
    "Security",
    "Best Practices"
  ];

  const levels = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner", color: "bg-green-100 text-green-800" },
    { value: "intermediate", label: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { value: "advanced", label: "Advanced", color: "bg-red-100 text-red-800" }
  ];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = selectedLevel === "all" || tutorial.level === selectedLevel;
    const matchesCategory = selectedCategory === "all" || tutorial.category === selectedCategory;
    return matchesSearch && matchesLevel && matchesCategory;
  });

  const getLevelBadge = (level: string) => {
    const levelInfo = levels.find(l => l.value === level);
    return levelInfo ? (
      <Badge className={levelInfo.color || "bg-gray-100 text-gray-800"}>
        {levelInfo.label}
      </Badge>
    ) : null;
  };

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
          <div className="container mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">All Tutorials</h1>
              <p className="text-muted-foreground">Learn fastn with our comprehensive tutorials</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{tutorials.length}</p>
                      <p className="text-sm text-muted-foreground">Total Tutorials</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {tutorials.filter(t => t.level === "beginner").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Beginner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {tutorials.filter(t => t.level === "intermediate").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Intermediate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {tutorials.filter(t => t.level === "advanced").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Advanced</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tutorials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-2">{tutorial.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                          {tutorial.description}
                        </CardDescription>
                      </div>
                      {getLevelBadge(tutorial.level)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{tutorial.duration}</span>
                      <span>•</span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{tutorial.rating}</span>
                      <span>•</span>
                      <span>{tutorial.views} views</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={tutorial.authorAvatar} alt={tutorial.author} />
                        <AvatarFallback>{tutorial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{tutorial.author}</p>
                        <p className="text-xs text-muted-foreground">{tutorial.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {tutorial.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {tutorial.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{tutorial.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <BookOpen className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTutorials.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tutorials found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllTutorials; 