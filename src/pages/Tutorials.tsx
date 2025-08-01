import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Clock, User, Star, Filter, Search, Plus, Menu, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { 
  Calendar
} from "lucide-react";

const Tutorials = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const tutorials = [
    {
      id: 1,
      title: "Getting Started with fastn: Complete Beginner's Guide",
      description: "Learn the fundamentals of fastn from installation to your first integration",
      author: "fastn-team",
      avatar: "F",
      difficulty: "Beginner",
      readTime: "15 min",
      views: "12.3k",
      rating: 4.8,
      createdAt: "2 weeks ago",
      tags: ["beginner", "setup", "basics"],
      featured: true
    },
    {
      id: 2,
      title: "Building Custom Connectors: Advanced Patterns",
      description: "Deep dive into creating reusable connectors for complex API integrations",
      author: "codemaster",
      avatar: "C",
      difficulty: "Advanced",
      readTime: "25 min",
      views: "5.7k",
      rating: 4.9,
      createdAt: "1 week ago",
      tags: ["advanced", "connectors", "api"],
      featured: false
    },
    {
      id: 3,
      title: "Handling Authentication in fastn Workflows",
      description: "Best practices for OAuth, API keys, and secure authentication patterns",
      author: "security_guru",
      avatar: "S",
      difficulty: "Intermediate",
      readTime: "20 min",
      views: "8.1k",
      rating: 4.7,
      createdAt: "3 days ago",
      tags: ["security", "auth", "oauth"],
      featured: true
    },
    {
      id: 4,
      title: "Error Handling and Debugging Strategies",
      description: "Learn how to gracefully handle errors and debug your integrations",
      author: "debugger_pro",
      avatar: "D",
      difficulty: "Intermediate",
      readTime: "18 min",
      views: "4.2k",
      rating: 4.6,
      createdAt: "5 days ago",
      tags: ["debugging", "errors", "best-practices"],
      featured: false
    },
    {
      id: 5,
      title: "Performance Optimization for Large Datasets",
      description: "Techniques for handling large volumes of data efficiently in fastn",
      author: "performance_expert",
      avatar: "P",
      difficulty: "Advanced",
      readTime: "30 min",
      views: "3.8k",
      rating: 4.8,
      createdAt: "1 week ago",
      tags: ["performance", "optimization", "data"],
      featured: false
    },
    {
      id: 6,
      title: "Real-time Data Processing with Webhooks",
      description: "Set up real-time integrations using webhooks and event-driven architecture",
      author: "realtime_dev",
      avatar: "R",
      difficulty: "Intermediate",
      readTime: "22 min",
      views: "6.5k",
      rating: 4.7,
      createdAt: "4 days ago",
      tags: ["webhooks", "realtime", "events"],
      featured: true
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-400 bg-green-500/10";
      case "Intermediate": return "text-orange-400 bg-orange-500/10";
      case "Advanced": return "text-red-400 bg-red-500/10";
      default: return "text-gray-400 bg-gray-500/10";
    }
  };

  const filteredTutorials = tutorials.filter(tutorial => {
    if (selectedFilter === "all") return true;
    return tutorial.difficulty.toLowerCase() === selectedFilter.toLowerCase();
  });

  const featuredTutorials = filteredTutorials.filter(t => t.featured);

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
              <h1 className="text-3xl font-bold text-foreground mb-2">Tutorials</h1>
              <p className="text-muted-foreground">Learn fastn with our comprehensive tutorials and guides</p>
              <div className="flex space-x-4 mt-4">
                <Button 
                  variant={selectedFilter === "all" ? "default" : "ghost"} 
                  size="sm" 
                  className={selectedFilter === "all" ? "bg-gradient-primary" : ""}
                  onClick={() => setSelectedFilter("all")}
                >
                  All Tutorials
                </Button>
                <Button 
                  variant={selectedFilter === "beginner" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setSelectedFilter("beginner")}
                >
                  Beginner
                </Button>
                <Button 
                  variant={selectedFilter === "intermediate" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setSelectedFilter("intermediate")}
                >
                  Intermediate
                </Button>
                <Button 
                  variant={selectedFilter === "advanced" ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setSelectedFilter("advanced")}
                >
                  Advanced
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => navigate("/write-tutorial")}
                >
                  + Write Tutorial
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Tutorials */}
          {featuredTutorials.length > 0 && (
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Featured Tutorials</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {featuredTutorials.map((tutorial) => (
                  <Card key={tutorial.id} className="hover:shadow-elegant transition-all cursor-pointer border-border/50 hover:border-primary/50">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {tutorial.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{tutorial.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-foreground line-clamp-2">
                        {tutorial.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {tutorial.description}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs bg-gradient-primary text-white">
                              {tutorial.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{tutorial.author}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{tutorial.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{tutorial.views}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {tutorial.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Tutorials */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">All Tutorials</h2>
            <div className="space-y-4">
              {filteredTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-elegant transition-all cursor-pointer border-border/50 hover:border-primary/50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                          {tutorial.featured && (
                            <Badge variant="secondary" className="text-primary">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {tutorial.title}
                        </h3>
                        <p className="text-muted-foreground mb-3">
                          {tutorial.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{tutorial.author}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{tutorial.readTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{tutorial.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{tutorial.createdAt}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{tutorial.rating}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {tutorial.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <BookOpen className="w-8 h-8 text-primary flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorials;