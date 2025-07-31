import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Clock, 
  Eye, 
  Star,
  User,
  Calendar
} from "lucide-react";

const Tutorials = () => {
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-background">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-subtle">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Tutorials
              </h1>
              <p className="text-muted-foreground">
                Learn fastn with our comprehensive tutorials and guides.
              </p>
              <div className="flex space-x-4 mt-4">
                <Button variant="default" size="sm" className="bg-gradient-primary">
                  All Tutorials
                </Button>
                <Button variant="ghost" size="sm">Beginner</Button>
                <Button variant="ghost" size="sm">Intermediate</Button>
                <Button variant="ghost" size="sm">Advanced</Button>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  + Write Tutorial
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Tutorials */}
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Featured Tutorials</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tutorials.filter(t => t.featured).map((tutorial) => (
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

          {/* All Tutorials */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">All Tutorials</h2>
            <div className="space-y-4">
              {tutorials.map((tutorial) => (
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