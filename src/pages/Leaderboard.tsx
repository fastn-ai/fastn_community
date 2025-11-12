import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Trophy, Star, TrendingUp, Calendar, Award, Crown, Medal, Users, ArrowLeft, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { ApiService, User, Topic } from "@/services/api";

// Helper function to get display name from user (same logic as Header component lines 42-47)
const getUserDisplayName = (user: User): string => {
  // Use the exact same logic as Header component: name || preferred_username || email?.split('@')[0] || 'user'
  const name = (user as any).name;
  const preferredUsername = (user as any).preferred_username;
  
  // Priority: name > preferred_username > username (if not email) > email prefix > username > 'user'
  if (name) return name;
  if (preferredUsername) return preferredUsername;
  
  // If username is not an email, use it directly
  if (user.username && !user.username.includes('@')) {
    return user.username;
  }
  
  // If username is an email, extract the name part
  if (user.username && user.username.includes('@')) {
    return user.username.split('@')[0];
  }
  
  // Extract from email (same as Header component)
  if (user.email && user.email.includes('@')) {
    return user.email.split('@')[0];
  }
  
  // Fallback
  return user.username || user.email || 'user';
};

const Leaderboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all-time");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  
  // Data states
  const [users, setUsers] = useState<User[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  // Fetch leaderboard data from API
  const fetchLeaderboardData = async (isRetry: boolean = false) => {
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

      // Calculate user statistics and create leaderboard data
      const userStats = fetchedUsers.map(user => {
        // Count topics by this user
        const userTopics = fetchedTopics.filter(topic => topic.author_id === user.id);
        const userReplies = user.replies_count || 0;
        const totalPoints = user.reputation_score || 0;
        
        // Calculate level based on reputation score
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
        if (userTopics.length >= 5) badges.push("Creator");

        // Calculate streak (mock data for now)
        const streak = Math.floor(Math.random() * 30) + 1;

        return {
          id: user.id,
          name: getUserDisplayName(user),
          avatar: user.avatar,
          points: totalPoints,
          answers: userReplies,
          badges,
          rank: 0, // Will be set after sorting
          streak,
          level,
          joinDate: user.created_at,
          thisMonth: Math.floor(totalPoints * 0.1), // Mock monthly activity
          lastMonth: Math.floor(totalPoints * 0.08), // Mock last month activity
          topicsCount: userTopics.length,
          repliesCount: userReplies,
          likesReceived: user.likes_received || 0
        };
      });

      // Sort by points and assign ranks
      const sortedUsers = userStats
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({
          ...user,
          rank: index + 1
        }));

      setLeaderboardData(sortedUsers);

      // Calculate overall statistics
      const totalParticipants = fetchedUsers.length;
      const totalPointsAwarded = fetchedUsers.reduce((sum, user) => sum + (user.reputation_score || 0), 0);
      const activeThisMonth = fetchedUsers.filter(user => user.is_active).length;
      const averageStreak = Math.floor(userStats.reduce((sum, user) => sum + user.streak, 0) / userStats.length);

      setStats([
        {
          title: "Total Participants",
          value: totalParticipants.toLocaleString(),
          icon: Users,
          color: "text-blue-500"
        },
        {
          title: "Total Points Awarded",
          value: totalPointsAwarded.toLocaleString(),
          icon: Trophy,
          color: "text-yellow-500"
        },
        {
          title: "Active This Month",
          value: activeThisMonth.toLocaleString(),
          icon: TrendingUp,
          color: "text-green-500"
        },
        {
          title: "Average Streak",
          value: `${averageStreak} days`,
          icon: Calendar,
          color: "text-purple-500"
        }
      ]);

    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
      setError("Failed to load leaderboard data. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, [toast]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Master":
        return "text-purple-500 bg-purple-500/10";
      case "Expert":
        return "text-red-500 bg-red-500/10";
      case "Advanced":
        return "text-orange-500 bg-orange-500/10";
      case "Intermediate":
        return "text-blue-500 bg-blue-500/10";
      case "Beginner":
        return "text-green-500 bg-green-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const getInitials = (username: string) => {
    return username
      .split("_")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
                  Supporters Leaderboard 🏆
                </h1>
                <p className="text-muted-foreground">
                  Top contributors helping the fastn community grow and thrive.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Loading leaderboard data...</span>
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
                  Supporters Leaderboard 🏆
                </h1>
                <p className="text-muted-foreground">
                  Top contributors helping the fastn community grow and thrive.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error loading leaderboard data</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => fetchLeaderboardData(true)}
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
                Supporters Leaderboard 🏆
              </h1>
              <p className="text-muted-foreground">
                Top contributors helping the fastn community grow and thrive.
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Filter Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-time">All Time</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="this-year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/answer-earn")}
                >
                  Back to Answer & Earn
                </Button>
              </div>

              {/* Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <span>Top Supporters</span>
                  </CardTitle>
                  <CardDescription>
                    Ranked by total points earned through helpful contributions
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {leaderboardData.map((user, index) => (
                      <div key={user.id} className="flex items-center space-x-4 p-6 hover:bg-accent transition-colors">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-12 h-12">
                          {getRankIcon(user.rank)}
                        </div>

                        {/* Avatar and Name */}
                        <div className="flex items-center space-x-4 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-foreground">{user.name}</h3>
                              <Badge className={getLevelColor(user.level)}>
                                {user.level}
                              </Badge>
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
                              <span>•</span>
                              <span>Joined {formatDate(user.joinDate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Points and Stats */}
                        <div className="text-right space-y-1">
                          <div className="text-2xl font-bold text-primary">{user.points}</div>
                          <div className="text-sm text-muted-foreground">points</div>
                          <div className="text-xs text-muted-foreground">
                            +{user.thisMonth} this month
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rewards Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span>Rewards & Prizes</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Gold Level (Top 3)</span>
                        <Badge variant="secondary">$500 Prize Pool</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Silver Level (Top 10)</span>
                        <Badge variant="secondary">Exclusive Badges</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bronze Level (Top 25)</span>
                        <Badge variant="secondary">Community Recognition</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Monthly Streaks</span>
                        <Badge variant="secondary">Bonus Points</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-blue-500" />
                      <span>How Points Work</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Helpful Answer</span>
                        <Badge variant="secondary">+10 points</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Accepted Answer</span>
                        <Badge variant="secondary">+25 points</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Daily Streak Bonus</span>
                        <Badge variant="secondary">+5 points</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Community Recognition</span>
                        <Badge variant="secondary">+15 points</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <Card className="bg-gradient-primary text-white">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Want to Join the Leaderboard?</h2>
                  <p className="text-lg opacity-90 mb-6">
                    Start answering questions and earn points to climb the ranks!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="secondary" 
                      size="lg"
                      onClick={() => navigate("/questions")}
                    >
                      Find Questions to Answer
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

export default Leaderboard; 