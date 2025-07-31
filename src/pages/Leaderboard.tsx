import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Trophy, Star, TrendingUp, Calendar, Award, Crown, Medal, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("all-time");

  const leaderboardData = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "SC",
      points: 2847,
      answers: 156,
      badges: ["Gold", "Helper", "Expert"],
      rank: 1,
      streak: 45,
      level: "Master",
      joinDate: "2023-01-15",
      thisMonth: 234,
      lastMonth: 189
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      avatar: "AR",
      points: 2156,
      answers: 134,
      badges: ["Silver", "Helper"],
      rank: 2,
      streak: 32,
      level: "Expert",
      joinDate: "2023-02-20",
      thisMonth: 198,
      lastMonth: 156
    },
    {
      id: 3,
      name: "Michael Park",
      avatar: "MP",
      points: 1892,
      answers: 98,
      badges: ["Bronze", "Helper"],
      rank: 3,
      streak: 28,
      level: "Advanced",
      joinDate: "2023-03-10",
      thisMonth: 167,
      lastMonth: 134
    },
    {
      id: 4,
      name: "Emma Thompson",
      avatar: "ET",
      points: 1654,
      answers: 87,
      badges: ["Helper"],
      rank: 4,
      streak: 21,
      level: "Intermediate",
      joinDate: "2023-04-05",
      thisMonth: 145,
      lastMonth: 123
    },
    {
      id: 5,
      name: "David Kim",
      avatar: "DK",
      points: 1432,
      answers: 76,
      badges: ["Helper"],
      rank: 5,
      streak: 18,
      level: "Intermediate",
      joinDate: "2023-05-12",
      thisMonth: 123,
      lastMonth: 98
    },
    {
      id: 6,
      name: "Lisa Wang",
      avatar: "LW",
      points: 1287,
      answers: 65,
      badges: ["Helper"],
      rank: 6,
      streak: 15,
      level: "Intermediate",
      joinDate: "2023-06-08",
      thisMonth: 112,
      lastMonth: 87
    },
    {
      id: 7,
      name: "James Wilson",
      avatar: "JW",
      points: 1156,
      answers: 58,
      badges: ["Helper"],
      rank: 7,
      streak: 12,
      level: "Beginner",
      joinDate: "2023-07-15",
      thisMonth: 98,
      lastMonth: 76
    },
    {
      id: 8,
      name: "Maria Garcia",
      avatar: "MG",
      points: 1043,
      answers: 52,
      badges: ["Helper"],
      rank: 8,
      streak: 10,
      level: "Beginner",
      joinDate: "2023-08-22",
      thisMonth: 87,
      lastMonth: 65
    },
    {
      id: 9,
      name: "John Smith",
      avatar: "JS",
      points: 987,
      answers: 48,
      badges: ["Helper"],
      rank: 9,
      streak: 8,
      level: "Beginner",
      joinDate: "2023-09-30",
      thisMonth: 76,
      lastMonth: 54
    },
    {
      id: 10,
      name: "Anna Johnson",
      avatar: "AJ",
      points: 876,
      answers: 42,
      badges: ["Helper"],
      rank: 10,
      streak: 6,
      level: "Beginner",
      joinDate: "2023-10-12",
      thisMonth: 65,
      lastMonth: 43
    }
  ];

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

  const stats = [
    {
      title: "Total Participants",
      value: "1,247",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Total Points Awarded",
      value: "45,892",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      title: "Active This Month",
      value: "234",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      title: "Average Streak",
      value: "18.5 days",
      icon: Calendar,
      color: "text-purple-500"
    }
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
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-foreground">{user.name}</h3>
                              <Badge className={getLevelColor(user.level)}>
                                {user.level}
                              </Badge>
                              <div className="flex space-x-1">
                                {user.badges.map((badge, badgeIndex) => (
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
                              <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
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
                      onClick={() => navigate("/open-questions")}
                    >
                      Find Questions to Answer
                    </Button>
                    {/*<Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-primary"
                      onClick={() => navigate("/answer-earn")}
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

export default Leaderboard; 