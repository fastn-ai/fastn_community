import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, UserPlus, MessageSquare, Heart, Share2, Bookmark, MoreHorizontal, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const communityMembers = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Core Contributor",
      avatar: "/avatars/sarah.jpg",
      bio: "Full-stack developer passionate about fastn and open source",
      posts: 45,
      followers: 234,
      following: 89,
      isOnline: true,
      badges: ["Fastn Expert", "Community Leader"]
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      role: "Developer Advocate",
      avatar: "/avatars/alex.jpg",
      bio: "Helping developers build amazing things with fastn",
      posts: 32,
      followers: 189,
      following: 156,
      isOnline: true,
      badges: ["Fastn Expert", "Speaker"]
    },
    {
      id: 3,
      name: "Emma Thompson",
      role: "Community Member",
      avatar: "/avatars/emma.jpg",
      bio: "Learning fastn and sharing my journey",
      posts: 12,
      followers: 67,
      following: 45,
      isOnline: false,
      badges: ["Fastn Learner"]
    },
    {
      id: 4,
      name: "Michael Park",
      role: "Core Contributor",
      avatar: "/avatars/michael.jpg",
      bio: "Building scalable applications with fastn",
      posts: 78,
      followers: 456,
      following: 123,
      isOnline: true,
      badges: ["Fastn Expert", "Core Team"]
    },
    {
      id: 5,
      name: "Lisa Wang",
      role: "Community Member",
      avatar: "/avatars/lisa.jpg",
      bio: "Exploring the possibilities of fastn development",
      posts: 8,
      followers: 34,
      following: 67,
      isOnline: false,
      badges: ["Fastn Learner"]
    },
    {
      id: 6,
      name: "David Kim",
      role: "Developer Advocate",
      avatar: "/avatars/david.jpg",
      bio: "Creating tutorials and helping newcomers",
      posts: 56,
      followers: 298,
      following: 134,
      isOnline: true,
      badges: ["Fastn Expert", "Tutorial Creator"]
    }
  ];

  const filteredMembers = communityMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || 
                         (filterType === "online" && member.isOnline) ||
                         (filterType === "contributors" && member.role.includes("Contributor")) ||
                         (filterType === "advocates" && member.role.includes("Advocate"));
    return matchesSearch && matchesFilter;
  });

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
          <div className="container mx-auto px-4 py-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
              <p className="text-muted-foreground">Connect with fastn developers</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{communityMembers.length}</p>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {communityMembers.filter(m => m.isOnline).length}
                      </p>
                      <p className="text-sm text-muted-foreground">Online Now</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {communityMembers.reduce((sum, m) => sum + m.posts, 0)}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">New This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="online">Online Now</SelectItem>
                  <SelectItem value="contributors">Core Contributors</SelectItem>
                  <SelectItem value="advocates">Developer Advocates</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          {member.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{member.name}</CardTitle>
                          <CardDescription className="text-sm">{member.role}</CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {member.badges.map((badge, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{member.posts} posts</span>
                      <span>{member.followers} followers</span>
                      <span>{member.following} following</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No members found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community; 