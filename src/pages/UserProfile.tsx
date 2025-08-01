import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Menu, 
  User, 
  Calendar, 
  MessageSquare, 
  Eye, 
  Star, 
  Trophy, 
  Award, 
  Edit, 
  Settings,
  Mail,
  Globe,
  MapPin,
  Briefcase,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const UserProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data - in real app this would come from API
  const user = {
    id: id || "1",
    name: "Sarah Chen",
    username: "sarahchen",
    email: "sarah.chen@example.com",
    avatar: "/avatars/sarah.jpg",
    bio: "Full-stack developer passionate about fastn and building scalable applications. Love helping others learn and grow in the community.",
    location: "San Francisco, CA",
    company: "TechCorp",
    website: "https://sarahchen.dev",
    joinedDate: "2023-03-15",
    reputation: 2847,
    topics: 45,
    replies: 156,
    views: 12340,
    badges: [
      { name: "Top Contributor", icon: Trophy, color: "bg-yellow-100 text-yellow-800" },
      { name: "Helpful", icon: Heart, color: "bg-green-100 text-green-800" },
      { name: "Active", icon: Star, color: "bg-blue-100 text-blue-800" }
    ],
    recentTopics: [
      {
        id: 1,
        title: "How to implement OAuth2 with fastn?",
        category: "Questions",
        replies: 12,
        views: 156,
        publishedAt: "2024-01-15",
        isHot: true
      },
      {
        id: 2,
        title: "Best practices for handling large datasets",
        category: "Best Practices",
        replies: 8,
        views: 89,
        publishedAt: "2024-01-14",
        isHot: false
      },
      {
        id: 3,
        title: "Setting up webhook endpoints",
        category: "Questions",
        replies: 5,
        views: 67,
        publishedAt: "2024-01-12",
        isHot: false
      }
    ],
    recentReplies: [
      {
        id: 1,
        topicTitle: "Error handling patterns for API rate limiting",
        content: "Great question! Here's how I handle rate limiting in my applications...",
        publishedAt: "2024-01-16",
        likes: 8
      },
      {
        id: 2,
        topicTitle: "Database connection pooling in fastn",
        content: "I've found that using connection pooling significantly improves performance...",
        publishedAt: "2024-01-15",
        likes: 12
      }
    ]
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      "Questions": "bg-blue-100 text-blue-800",
      "Best Practices": "bg-green-100 text-green-800",
      "Announcements": "bg-red-100 text-red-800",
      "Built with fastn": "bg-purple-100 text-purple-800"
    };
    return (
      <Badge className={colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {category}
      </Badge>
    );
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
              <h1 className="text-3xl font-bold text-foreground mb-2">User Profile</h1>
              <p className="text-muted-foreground">View user information and activity</p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
                          <p className="text-muted-foreground">@{user.username}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground">{user.bio}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{user.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <a href={user.website} className="text-primary hover:underline">{user.website}</a>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">{user.reputation}</p>
                        <p className="text-sm text-muted-foreground">Reputation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{user.topics}</p>
                        <p className="text-sm text-muted-foreground">Topics</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{user.replies}</p>
                        <p className="text-sm text-muted-foreground">Replies</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-2xl font-bold">{user.views.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Profile Views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Badges & Achievements</CardTitle>
                  <CardDescription>Recognition for contributions to the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge, index) => (
                      <Badge key={index} className={`${badge.color} flex items-center space-x-1`}>
                        <badge.icon className="w-3 h-3" />
                        <span>{badge.name}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="replies">Replies</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Topics</CardTitle>
                        <CardDescription>Latest topics created by {user.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {user.recentTopics.map((topic) => (
                          <div key={topic.id} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getCategoryBadge(topic.category)}
                                  {topic.isHot && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                      Hot
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">{topic.title}</h4>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>{topic.replies} replies</span>
                                  <span>{topic.views} views</span>
                                  <span>{topic.publishedAt}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Replies</CardTitle>
                        <CardDescription>Latest replies by {user.name}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {user.recentReplies.map((reply) => (
                          <div key={reply.id} className="border-b border-border pb-4 last:border-b-0">
                            <h4 className="font-semibold text-foreground mb-2">{reply.topicTitle}</h4>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{reply.content}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{reply.publishedAt}</span>
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {reply.likes}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="topics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Topics by {user.name}</CardTitle>
                      <CardDescription>Complete list of topics created</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.recentTopics.map((topic) => (
                          <div key={topic.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getCategoryBadge(topic.category)}
                                  {topic.isHot && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                      Hot
                                    </Badge>
                                  )}
                                </div>
                                <h4 className="font-semibold text-foreground mb-1">{topic.title}</h4>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center">
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    {topic.replies} replies
                                  </span>
                                  <span className="flex items-center">
                                    <Eye className="w-4 h-4 mr-1" />
                                    {topic.views} views
                                  </span>
                                  <span>{topic.publishedAt}</span>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="replies" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Replies by {user.name}</CardTitle>
                      <CardDescription>Complete list of replies and comments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.recentReplies.map((reply) => (
                          <div key={reply.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <h4 className="font-semibold text-foreground mb-2">{reply.topicTitle}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{reply.content}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{reply.publishedAt}</span>
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center">
                                  <Heart className="w-3 h-3 mr-1" />
                                  {reply.likes}
                                </span>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 