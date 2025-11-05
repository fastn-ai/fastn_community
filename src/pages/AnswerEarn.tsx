import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Trophy, Star, Users, Target, Gift, TrendingUp, CheckCircle, Clock, MessageSquare, Search, ArrowLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { useAllTopics } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/services/api";

// Static open questions data
const staticOpenQuestions = [
  {
    id: 1,
    title: "How to implement OAuth2 with fastn?",
    category: "Authentication",
    difficulty: "Intermediate",
    bounty: 50,
    timeAgo: "2 hours ago",
    views: 23,
    tags: ["oauth", "authentication", "security"]
  },
  {
    id: 2,
    title: "Best practices for handling large datasets in fastn workflows",
    category: "Performance",
    difficulty: "Advanced",
    bounty: 75,
    timeAgo: "4 hours ago",
    views: 15,
    tags: ["performance", "data", "workflows"]
  },
  {
    id: 3,
    title: "Setting up webhook endpoints for real-time notifications",
    category: "Integration",
    difficulty: "Intermediate",
    bounty: 40,
    timeAgo: "6 hours ago",
    views: 31,
    tags: ["webhooks", "notifications", "integration"]
  },
  {
    id: 4,
    title: "Error handling patterns for API rate limiting",
    category: "Best Practices",
    difficulty: "Intermediate",
    bounty: 35,
    timeAgo: "8 hours ago",
    views: 19,
    tags: ["error-handling", "rate-limiting", "api"]
  },
  {
    id: 5,
    title: "Creating custom connectors for third-party services",
    category: "Development",
    difficulty: "Advanced",
    bounty: 60,
    timeAgo: "1 day ago",
    views: 42,
    tags: ["connectors", "third-party", "development"]
  }
];

const AnswerEarn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Fetch all topics using React Query hook
  const { data: topics = [], isLoading: topicsLoading, error: topicsError, refetch: refetchTopics } = useAllTopics();
  
  // Fetch all replies to count answers per user
  const { data: allReplies = [], isLoading: repliesLoading } = useQuery({
    queryKey: ['replies', 'all'],
    queryFn: ApiService.getAllReplies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Data states
  const [openQuestions] = useState<any[]>(staticOpenQuestions);

  // Fallback sample data for when API fails
  const fallbackLeaderboardData = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "SC",
      points: 2847,
      answers: 156,
      badges: ["Gold", "Helper", "Expert"],
      rank: 1,
      streak: 45
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      avatar: "AR",
      points: 2156,
      answers: 134,
      badges: ["Silver", "Helper"],
      rank: 2,
      streak: 32
    },
    {
      id: 3,
      name: "Michael Park",
      avatar: "MP",
      points: 1892,
      answers: 98,
      badges: ["Bronze", "Helper"],
      rank: 3,
      streak: 28
    },
    {
      id: 4,
      name: "Emma Thompson",
      avatar: "ET",
      points: 1654,
      answers: 87,
      badges: ["Helper"],
      rank: 4,
      streak: 21
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "DK",
      points: 1432,
      answers: 76,
      badges: ["Helper"],
      rank: 5,
      streak: 18
    }
  ];

  // Extract unique users from topics and count their activity
  const userStatsFromTopics = useMemo(() => {
    const userMap: Record<string, {
      id: string;
      username: string;
      avatar?: string;
      topicsCreated: number;
      repliesCount: number;
      totalLikes: number;
    }> = {};

    // Count topics created by each user
    topics.forEach((topic) => {
      if (topic.author_id) {
        if (!userMap[topic.author_id]) {
          userMap[topic.author_id] = {
            id: topic.author_id,
            username: topic.author_username || topic.author_name || 'anonymous',
            avatar: topic.author_avatar,
            topicsCreated: 0,
            repliesCount: 0,
            totalLikes: topic.like_count || 0,
          };
        }
        userMap[topic.author_id].topicsCreated += 1;
        userMap[topic.author_id].totalLikes += topic.like_count || 0;
      }
    });

    // Count replies per user
    allReplies.forEach((reply) => {
      if (reply.author_id) {
        if (!userMap[reply.author_id]) {
          userMap[reply.author_id] = {
            id: reply.author_id,
            username: reply.author_username || 'anonymous',
            avatar: reply.author_avatar,
            topicsCreated: 0,
            repliesCount: 0,
            totalLikes: reply.like_count || 0,
          };
        }
        userMap[reply.author_id].repliesCount += 1;
        userMap[reply.author_id].totalLikes += reply.like_count || 0;
      }
    });

    return Object.values(userMap);
  }, [topics, allReplies]);

  // Transform users into leaderboard data using useMemo
  const leaderboardData = useMemo(() => {
    if (!userStatsFromTopics || userStatsFromTopics.length === 0) {
      return fallbackLeaderboardData;
    }

    const userStats = userStatsFromTopics.map(user => {
      const userReplies = user.repliesCount;
      // Calculate points: topics created (10 points each) + replies (5 points each) + likes received (1 point each)
      const totalPoints = (user.topicsCreated * 10) + (userReplies * 5) + (user.totalLikes || 0);
      
      // Calculate level based on total points
      let level = "Beginner";
      if (totalPoints >= 2000) level = "Master";
      else if (totalPoints >= 1500) level = "Expert";
      else if (totalPoints >= 1000) level = "Advanced";
      else if (totalPoints >= 500) level = "Intermediate";

      // Generate badges based on activity
      const badges = [];
      if (totalPoints >= 1000) badges.push("Gold");
      else if (totalPoints >= 500) badges.push("Silver");
      else if (totalPoints >= 100) badges.push("Bronze");
      if (userReplies >= 10) badges.push("Helper");
      if (user.topicsCreated >= 5) badges.push("Contributor");

      // Calculate streak (mock data for now)
      const streak = Math.floor(Math.random() * 30) + 1;

      return {
        id: user.id,
        name: user.username,
        avatar: user.avatar,
        points: totalPoints,
        answers: userReplies,
        badges,
        rank: 0, // Will be set after sorting
        streak,
        level
      };
    });

    // Sort by points and assign ranks
    return userStats
      .sort((a, b) => b.points - a.points)
      .slice(0, 5) // Only show top 5 for the preview
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));
  }, [userStatsFromTopics]);

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "text-red-500 bg-red-500/10";
      case "Intermediate":
        return "text-orange-500 bg-orange-500/10";
      case "Beginner":
        return "text-green-500 bg-green-500/10";
      default:
        return "text-blue-500 bg-blue-500/10";
    }
  };

  const benefits = [
    {
      icon: Trophy,
      title: "Earn Points",
      description: "Get points for every helpful answer you provide",
      color: "text-yellow-500"
    },
    {
      icon: Star,
      title: "Build Reputation",
      description: "Gain recognition as a community expert",
      color: "text-blue-500"
    },
    {
      icon: Gift,
      title: "Win Prizes",
      description: "Monthly rewards for top contributors",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with other fastn developers",
      color: "text-green-500"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your account and complete your profile",
      icon: CheckCircle
    },
    {
      number: 2,
      title: "Browse Questions",
      description: "Find questions you can help with",
      icon: Search
    },
    {
      number: 3,
      title: "Provide Answers",
      description: "Share your knowledge and experience",
      icon: MessageSquare
    },
    {
      number: 4,
      title: "Earn Rewards",
      description: "Get points and climb the leaderboard",
      icon: Trophy
    }
  ];

  // Combine loading states
  const isLoading = topicsLoading || repliesLoading;
  
  // Use topicsError for error handling
  const error = topicsError ? "Failed to load leaderboard data. Please try again later." : null;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
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
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Answer & Earn 🎉
                </h1>
                <p className="text-muted-foreground">
                  Help others, build your reputation, and earn rewards in the fastn community.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading data...</span>
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
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Answer & Earn 🎉
                </h1>
                <p className="text-muted-foreground">
                  Help others, build your reputation, and earn rewards in the fastn community.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error loading data</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => refetchTopics()}
                    disabled={topicsLoading}
                    className="flex items-center gap-2"
                  >
                    {topicsLoading ? (
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
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Answer & Earn 🎉
              </h1>
              <p className="text-muted-foreground">
                Help others, build your reputation, and earn rewards in the fastn community.
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              
              {/* Benefits Section */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Why Join Answer & Earn?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {benefits.map((benefit, index) => (
                    <Card key={index} className="text-center">
                      <CardContent className="p-6">
                        <benefit.icon className={`w-12 h-12 mx-auto mb-4 ${benefit.color}`} />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* How to Join Section */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">How to Join</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {steps.map((step, index) => (
                    <Card key={index} className="relative">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white font-bold text-lg">{step.number}</span>
                        </div>
                        <step.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Supporters Leaderboard */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Supporters Leaderboard</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/leaderboard")}
                  >
                    View Full Leaderboard
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {leaderboardData.map((user, index) => (
                        <div key={user.id} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-accent transition-colors">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarFallback className="bg-gradient-primary text-white">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              {index < 3 && (
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">{index + 1}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-foreground">{user.name}</h3>
                                <div className="flex space-x-1">
                                  {user.badges.map((badge: string, badgeIndex: number) => (
                                    <Badge key={badgeIndex} variant="secondary" className="text-xs">
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                                <span>{user.answers} answers</span>
                                <span>•</span>
                                <span>{user.streak} day streak</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{user.points}</div>
                            <div className="text-sm text-muted-foreground">points</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Find Open Questions */}
              {/*<div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Find Open Questions</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/open-questions")}
                  >
                    View All Questions
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {openQuestions.map((question) => (
                    <Card key={question.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                              {question.title}
                            </h3>
                            <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-3">
                              <span>{question.category}</span>
                              <span>•</span>
                              <Badge variant="outline" className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                                {question.difficulty}
                              </Badge>
                              <span>•</span>
                              <span>{question.timeAgo}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-500">{question.bounty}</div>
                            <div className="text-xs text-muted-foreground">points</div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {question.tags.map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                            <MessageSquare className="w-4 h-4" />
                            <span>{question.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>*/}

              {/* Call to Action */}
              <Card className="bg-gradient-primary text-white">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Ready to Start Earning?</h2>
                  <p className="text-lg opacity-90 mb-6">
                    Join the Answer & Earn program and start helping others while building your reputation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => navigate("/open-questions")}
                    >
                      Find Questions to Answer
                    </Button>
                    {/*<Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-primary"
                    >
                      Learn More
                    </Button>*/}
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

export default AnswerEarn; 