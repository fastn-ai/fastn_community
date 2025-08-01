import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Menu, 
  User, 
  Calendar, 
  MessageSquare, 
  Eye, 
  Star, 
  Trophy, 
  TrendingUp,
  Activity,
  BookOpen,
  Heart,
  Share2,
  Bookmark,
  Clock,
  Target,
  Award,
  Zap,
  Plus,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock dashboard data
  const dashboardData = {
    user: {
      name: "Sarah Chen",
      username: "sarahchen",
      avatar: "/avatars/sarah.jpg",
      reputation: 2847,
      level: "Expert",
      joinDate: "2023-03-15"
    },
    stats: {
      topics: 45,
      replies: 156,
      views: 12340,
      likes: 892,
      bookmarks: 67,
      thisWeek: {
        topics: 3,
        replies: 12,
        views: 234,
        likes: 45
      }
    },
    achievements: [
      { name: "First Topic", description: "Created your first topic", icon: MessageSquare, earned: true },
      { name: "Helpful", description: "Received 10 helpful votes", icon: Heart, earned: true },
      { name: "Active", description: "Posted for 7 consecutive days", icon: Activity, earned: true },
      { name: "Expert", description: "Reached 1000 reputation points", icon: Trophy, earned: true },
      { name: "Popular", description: "Topic reached 1000 views", icon: TrendingUp, earned: false },
      { name: "Mentor", description: "Helped 50 users", icon: User, earned: false }
    ],
    recentActivity: [
      {
        id: 1,
        type: "topic",
        title: "How to implement OAuth2 with fastn?",
        description: "Created a new topic",
        time: "2 hours ago",
        category: "Questions",
        replies: 12,
        views: 156
      },
      {
        id: 2,
        type: "reply",
        title: "Error handling patterns for API rate limiting",
        description: "Replied to a topic",
        time: "4 hours ago",
        likes: 8
      },
      {
        id: 3,
        type: "like",
        title: "Database connection pooling in fastn",
        description: "Received a like",
        time: "6 hours ago"
      },
      {
        id: 4,
        type: "bookmark",
        title: "Setting up webhook endpoints",
        description: "Bookmarked a topic",
        time: "1 day ago"
      }
    ],
    goals: [
      { name: "Reach 3000 reputation", current: 2847, target: 3000, progress: 95 },
      { name: "Create 50 topics", current: 45, target: 50, progress: 90 },
      { name: "Help 200 users", current: 156, target: 200, progress: 78 },
      { name: "Earn 10 badges", current: 4, target: 10, progress: 40 }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: "Fastn Community Meetup",
        date: "Dec 15, 2024",
        time: "2:00 PM UTC",
        type: "Virtual"
      },
      {
        id: 2,
        title: "API Integration Workshop",
        date: "Dec 20, 2024",
        time: "3:00 PM UTC",
        type: "Workshop"
      }
    ],
    recommendedTopics: [
      {
        id: 1,
        title: "Advanced error handling in fastn workflows",
        category: "Best Practices",
        replies: 8,
        views: 123,
        isHot: true
      },
      {
        id: 2,
        title: "Building real-time applications with fastn",
        category: "Tutorials",
        replies: 15,
        views: 456,
        isHot: false
      }
    ]
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      "Questions": "bg-blue-100 text-blue-800",
      "Best Practices": "bg-green-100 text-green-800",
      "Announcements": "bg-red-100 text-red-800",
      "Tutorials": "bg-purple-100 text-purple-800"
    };
    return (
      <Badge className={colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {category}
      </Badge>
    );
  };

  const getActivityIcon = (type: string) => {
    const icons = {
      "topic": MessageSquare,
      "reply": TrendingUp,
      "like": Heart,
      "bookmark": Bookmark
    };
    return icons[type as keyof typeof icons] || Activity;
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Your personal activity and progress overview</p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Welcome Section */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={dashboardData.user.avatar} alt={dashboardData.user.name} />
                      <AvatarFallback className="text-xl">{dashboardData.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground">Welcome back, {dashboardData.user.name}!</h2>
                      <p className="text-muted-foreground">Here's what's happening in your community</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={() => navigate("/create")}>
                        <Plus className="w-4 h-4 mr-2" />
                        New Topic
                      </Button>
                      <Button variant="outline" onClick={() => navigate("/settings")}>
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-2xl font-bold">{dashboardData.stats.topics}</p>
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
                        <p className="text-2xl font-bold">{dashboardData.stats.replies}</p>
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
                        <p className="text-2xl font-bold">{dashboardData.stats.views.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Views</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <div>
                        <p className="text-2xl font-bold">{dashboardData.user.reputation}</p>
                        <p className="text-sm text-muted-foreground">Reputation</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* This Week's Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>This Week's Activity</CardTitle>
                  <CardDescription>Your contributions and engagement this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-500">{dashboardData.stats.thisWeek.topics}</div>
                      <div className="text-sm text-muted-foreground">New Topics</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{dashboardData.stats.thisWeek.replies}</div>
                      <div className="text-sm text-muted-foreground">Replies</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-500">{dashboardData.stats.thisWeek.views}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{dashboardData.stats.thisWeek.likes}</div>
                      <div className="text-sm text-muted-foreground">Likes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="goals">Goals</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest contributions and interactions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dashboardData.recentActivity.map((activity) => {
                          const ActivityIcon = getActivityIcon(activity.type);
                          return (
                            <div key={activity.id} className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <ActivityIcon className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                                <p className="text-xs text-muted-foreground">{activity.description}</p>
                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>

                    {/* Upcoming Events */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>Community events you might be interested in</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {dashboardData.upcomingEvents.map((event) => (
                          <div key={event.id} className="border rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground">{event.title}</h4>
                                <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                                <Badge variant="outline" className="mt-1">{event.type}</Badge>
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommended Topics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recommended for You</CardTitle>
                      <CardDescription>Topics you might find interesting based on your activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.recommendedTopics.map((topic) => (
                          <div key={topic.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  {getCategoryBadge(topic.category)}
                                  {topic.isHot && (
                                    <Badge className="bg-orange-100 text-orange-800 text-xs">
                                      <Zap className="w-3 h-3 mr-1" />
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

                {/* Goals Tab */}
                <TabsContent value="goals" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Goals</CardTitle>
                      <CardDescription>Track your progress towards community goals</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {dashboardData.goals.map((goal, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground">{goal.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {goal.current} / {goal.target}
                              </p>
                            </div>
                            <Badge variant={goal.progress >= 100 ? "default" : "secondary"}>
                              {goal.progress}%
                            </Badge>
                          </div>
                          <Progress value={goal.progress} className="w-full" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Achievements</CardTitle>
                      <CardDescription>Badges and achievements you've earned</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dashboardData.achievements.map((achievement, index) => (
                          <div key={index} className={`border rounded-lg p-4 ${achievement.earned ? 'bg-muted/50' : 'opacity-50'}`}>
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-full ${achievement.earned ? 'bg-primary/10' : 'bg-muted'}`}>
                                <achievement.icon className={`w-5 h-5 ${achievement.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{achievement.name}</h4>
                                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Activity</CardTitle>
                      <CardDescription>Complete history of your community activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dashboardData.recentActivity.map((activity) => {
                          const ActivityIcon = getActivityIcon(activity.type);
                          return (
                            <div key={activity.id} className="border rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <ActivityIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground">{activity.title}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>{activity.time}</span>
                                    {activity.replies && (
                                      <span className="flex items-center">
                                        <MessageSquare className="w-3 h-3 mr-1" />
                                        {activity.replies} replies
                                      </span>
                                    )}
                                    {activity.views && (
                                      <span className="flex items-center">
                                        <Eye className="w-3 h-3 mr-1" />
                                        {activity.views} views
                                      </span>
                                    )}
                                    {activity.likes && (
                                      <span className="flex items-center">
                                        <Heart className="w-3 h-3 mr-1" />
                                        {activity.likes} likes
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
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

export default Dashboard; 