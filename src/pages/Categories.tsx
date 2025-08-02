import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const categories = [
    {
      icon: Megaphone,
      name: "Announcements",
      description: "Official announcements and updates from the fastn team",
      topics: 5,
      posts: 12,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      path: "/announcements"
    },
    {
      icon: HelpCircle,
      name: "Questions",
      description: "Get help with fastn integration and troubleshooting",
      topics: 142,
      posts: 456,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      path: "/questions"
    },
    {
      icon: BookOpen,
      name: "Tutorials coming",
      description: "Step-by-step guides and learning resources",
      topics: 28,
      posts: 89,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      isComingSoon: true,
    //  path: "/tutorials"
    },
    {
      icon: Code,
      name: "Built with fastn",
      description: "Showcase your projects and integrations built with fastn",
      topics: 67,
      posts: 234,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      path: "/built-with-fastn"
    },
    {
      icon: Users,
      name: "Community",
      description: "General discussions and community conversations",
      topics: 89,
      posts: 312,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      path: "/community"
    },
  ];

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
              {categories.map((category) => (
                <Card 
                  key={category.name} 
                  className="hover:shadow-elegant transition-all cursor-pointer border-border/50 hover:border-primary/50"
                  onClick={() => navigate(category.path)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${category.bgColor}`}>
                        <category.icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-foreground">{category.name}</CardTitle>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;