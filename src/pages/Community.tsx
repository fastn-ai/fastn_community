import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Users, MessageSquare, Calendar, TrendingUp, Star, Award, ExternalLink, ArrowRight, ArrowLeft, Loader2, AlertCircle, RefreshCw, Eye, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { ApiService, Topic, User } from "@/services/api";

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [communityStats, setCommunityStats] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [topContributors, setTopContributors] = useState<User[]>([]);

  const socialPlatforms = [
    {
      name: "Slack",
      description: "Join our Slack workspace for real-time discussions",
      icon: "💬",
      color: "bg-blue-500",
      url: "https://slack.fastn.ai",
      members: "2,847"
    },
    {
      name: "Discord",
      description: "Connect with developers in our Discord server",
      icon: "🎮",
      color: "bg-purple-500",
      url: "https://discord.gg/fastn",
      members: "1,234"
    },
    {
      name: "LinkedIn",
      description: "Follow us for professional updates and networking",
      icon: "💼",
      color: "bg-indigo-500",
      url: "https://linkedin.com/company/fastn",
      members: "5,678"
    },
    {
      name: "Instagram",
      description: "Stay updated with visual content and stories",
      icon: "📸",
      color: "bg-pink-500",
      url: "https://instagram.com/fastn_ai",
      members: "3,456"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Fastn Community Meetup",
      date: "Dec 15, 2024",
      time: "2:00 PM UTC",
      type: "Virtual",
      attendees: 156
    },
    {
      id: 2,
      title: "API Integration Workshop",
      date: "Dec 20, 2024",
      time: "3:00 PM UTC",
      type: "Workshop",
      attendees: 89
    },
    {
      id: 3,
      title: "Q&A Session with Core Team",
      date: "Dec 25, 2024",
      time: "1:00 PM UTC",
      type: "Q&A",
      attendees: 234
    }
  ];

  // Fetch community data from API
  const fetchCommunityData = async (isRetry: boolean = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch users and topics in parallel
      const [fetchedUsers, fetchedTopics] = await Promise.all([
        ApiService.getAllUsers(),
        ApiService.getAllTopics(),
      ]);

      setUsers(fetchedUsers);
      setTopics(fetchedTopics);

      // Calculate community statistics
      const totalMembers = fetchedUsers.length;
      const activeDiscussions = fetchedTopics.length;
      const totalReplies = fetchedTopics.reduce((sum, topic) => sum + topic.reply_count, 0);
      const totalLikes = fetchedTopics.reduce((sum, topic) => sum + topic.like_count, 0);
      const totalViews = fetchedTopics.reduce((sum, topic) => sum + topic.view_count, 0);

      // Calculate weekly changes (mock data for now)
      const weeklyMemberChange = Math.floor(totalMembers * 0.05); // 5% growth
      const dailyDiscussionChange = Math.floor(activeDiscussions * 0.1); // 10% daily growth

      setCommunityStats([
        {
          title: "Total Members",
          value: totalMembers.toLocaleString(),
          icon: Users,
          color: "text-blue-500",
          change: `+${weeklyMemberChange} this week`
        },
        {
          title: "Active Discussions",
          value: activeDiscussions.toLocaleString(),
          icon: MessageSquare,
          color: "text-purple-500",
          change: `+${dailyDiscussionChange} today`
        },
        {
          title: "Total Replies",
          value: totalReplies.toLocaleString(),
          icon: TrendingUp,
          color: "text-indigo-500",
          change: `${Math.floor(totalReplies / activeDiscussions)} avg per topic`
        },
        {
          title: "Community Engagement",
          value: (totalLikes + totalViews).toLocaleString(),
          icon: Star,
          color: "text-pink-500",
          change: `${Math.floor((totalLikes + totalViews) / activeDiscussions)} avg per topic`
        }
      ]);

      // Generate recent activities from topics
      const recentTopics = fetchedTopics
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);

      const activities = recentTopics.map((topic, index) => ({
        id: topic.id,
        type: "topic",
        title: "New topic created",
        description: `${topic.author_username} created '${topic.title}'`,
        time: formatTimeAgo(topic.created_at),
        avatar: topic.author_username,
        category: topic.category_name
      }));

      setRecentActivities(activities);

      // Get top contributors (users with highest reputation scores)
      const sortedUsers = fetchedUsers
        .sort((a, b) => b.reputation_score - a.reputation_score)
        .slice(0, 5);

      setTopContributors(sortedUsers);

    } catch (err) {
      console.error("Error fetching community data:", err);
      setError("Failed to load community data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load community data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [toast]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      "Questions": "bg-blue-100 text-blue-800",
      "Best Practices": "bg-green-100 text-green-800",
      "Announcements": "bg-red-100 text-red-800",
      "Built with fastn": "bg-orange-100 text-orange-800",
      "Showcase": "bg-pink-100 text-pink-800"
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
      "announcement": Award
    };
    return icons[type as keyof typeof icons] || MessageSquare;
  };

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
            <div className="p-6 border-b border-border bg-gradient-subtle">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
                <p className="text-muted-foreground">
                  Connect with fellow fastn developers, share knowledge, and grow together.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading community data...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
            <div className="p-6 border-b border-border bg-gradient-subtle">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
                <p className="text-muted-foreground">
                  Connect with fellow fastn developers, share knowledge, and grow together.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error loading community data</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => fetchCommunityData(true)}
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
                  <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
             
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Community
              </h1>
              <p className="text-muted-foreground">
                Connect with fellow fastn developers, share knowledge, and grow together.
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {communityStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        <div>
                          <p className="text-2xl font-bold">
                            {stat.value}
                          </p>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-xs text-muted-foreground">{stat.change}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Social Platforms */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Connect With Us</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {socialPlatforms.map((platform, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="text-center space-y-4">
                          <div className={`w-16 h-16 ${platform.color} rounded-full flex items-center justify-center mx-auto text-2xl`}>
                            {platform.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">{platform.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{platform.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{platform.members} members</span>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(platform.url, "_blank")}
                              >
                                Join
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Recent Activity */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {recentActivities.map((activity) => {
                          const ActivityIcon = getActivityIcon(activity.type);
                          return (
                            <div key={activity.id} className="flex items-start space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">{getInitials(activity.avatar)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <ActivityIcon className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-medium text-foreground">{activity.title}</span>
                                  {getCategoryBadge(activity.category)}
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">{activity.description}</p>
                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Contributors */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Top Contributors</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {topContributors.map((contributor, index) => (
                          <div key={contributor.id} className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={contributor.avatar} alt={contributor.username} />
                                <AvatarFallback className="text-xs">{getInitials(contributor.username)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-foreground">{contributor.username}</span>
                                  {index < 3 && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      #{index + 1}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>{contributor.reputation_score} points</span>
                                  <span>{contributor.topics_count} topics</span>
                                  <span>{contributor.replies_count} replies</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Upcoming Events */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{event.type}</Badge>
                            <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                          </div>
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <TrendingUp className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <Card className="bg-muted/50">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">Join the Fastn Community</h2>
                  <p className="text-muted-foreground mb-6">
                    Connect with developers, share your knowledge, and help build the future of AI-powered applications.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => navigate("/create")}>
                      Start a Discussion
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/answer-earn")}>
                      Answer & Earn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community; 