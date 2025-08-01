import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Users, MessageSquare, Calendar, TrendingUp, Star, Award, ExternalLink, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const Community = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const communityStats = [
    {
      title: "Total Members",
      value: "12,847",
      icon: Users,
      color: "text-blue-500",
      change: "+234 this week"
    },
    {
      title: "Active Discussions",
      value: "1,234",
      icon: MessageSquare,
      color: "text-purple-500",
      change: "+45 today"
    },
    {
      title: "Events This Month",
      value: "8",
      icon: Calendar,
      color: "text-indigo-500",
      change: "2 upcoming"
    },
    {
      title: "Top Contributors",
      value: "156",
      icon: Star,
      color: "text-pink-500",
      change: "+12 new"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "topic",
      title: "New topic created",
      description: "Sarah Chen created 'How to implement OAuth2 with fastn?'",
      time: "2 hours ago",
      avatar: "SC",
      category: "Questions"
    },
    {
      id: 2,
      type: "reply",
      title: "Topic replied to",
      description: "Alex Rodriguez replied to 'Best practices for handling large datasets'",
      time: "4 hours ago",
      avatar: "AR",
      category: "Best Practices"
    },
    {
      id: 3,
      type: "tutorial",
      title: "New tutorial published",
      description: "Michael Park published 'Setting up webhook endpoints'",
      time: "6 hours ago",
      avatar: "MP",
      category: "Tutorials"
    },
    {
      id: 4,
      type: "announcement",
      title: "Community announcement",
      description: "New Answer & Earn program launched",
      time: "1 day ago",
      avatar: "FA",
      category: "Announcements"
    }
  ];

  const topContributors = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "SC",
      points: 2847,
      topics: 45,
      replies: 156,
      rank: 1
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      avatar: "AR",
      points: 2156,
      topics: 32,
      replies: 134,
      rank: 2
    },
    {
      id: 3,
      name: "Michael Park",
      avatar: "MP",
      points: 1892,
      topics: 28,
      replies: 98,
      rank: 3
    },
    {
      id: 4,
      name: "Emma Thompson",
      avatar: "ET",
      points: 1654,
      topics: 25,
      replies: 87,
      rank: 4
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "DK",
      points: 1432,
      topics: 22,
      replies: 76,
      rank: 5
    }
  ];

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

  const getCategoryBadge = (category: string) => {
    const colors = {
      "Questions": "bg-blue-100 text-blue-800",
      "Best Practices": "bg-green-100 text-green-800",
      "Tutorials": "bg-purple-100 text-purple-800",
      "Announcements": "bg-red-100 text-red-800"
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
      "tutorial": Star,
      "announcement": Award
    };
    return icons[type as keyof typeof icons] || MessageSquare;
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
                                <AvatarFallback className="text-xs">{activity.avatar}</AvatarFallback>
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
                        {topContributors.map((contributor) => (
                          <div key={contributor.id} className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">{contributor.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-foreground">{contributor.name}</span>
                                  {contributor.rank <= 3 && (
                                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                                      #{contributor.rank}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>{contributor.points} points</span>
                                  <span>{contributor.topics} topics</span>
                                  <span>{contributor.replies} replies</span>
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