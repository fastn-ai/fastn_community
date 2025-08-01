import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, User, Menu, Plus, Settings, MessageSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "New reply to your topic",
      message: "Sarah Chen replied to 'How to implement OAuth2 with fastn?'",
      time: "2 minutes ago",
      isRead: false,
      type: "reply"
    },
    {
      id: 2,
      title: "Topic marked as solved",
      message: "Your topic 'Database connection pooling' was marked as solved",
      time: "1 hour ago",
      isRead: false,
      type: "solved"
    },
    {
      id: 3,
      title: "New follower",
      message: "Alex Rodriguez started following you",
      time: "3 hours ago",
      isRead: true,
      type: "follow"
    },
    {
      id: 4,
      title: "Weekly digest",
      message: "Here's what happened in the fastn community this week",
      time: "1 day ago",
      isRead: true,
      type: "digest"
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  const handleNotificationClick = (notificationId: number) => {
    console.log("Notification clicked:", notificationId);
    // Handle notification click
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reply":
        return "💬";
      case "solved":
        return "✅";
      case "follow":
        return "👤";
      case "digest":
        return "📧";
      default:
        return "🔔";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">f</span>
          </div>
          <span className="font-bold text-xl text-foreground">fastn</span>
        </div>

        {/* Navigation */}
      

        {/* Search */}
        <div className="flex-1 max-w-md mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
            />
          </form>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* New Topic Button */}
          <Button 
            onClick={() => navigate("/create")}
            className="hidden sm:flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Topic</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} new
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className={`cursor-pointer ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  <p className="text-sm text-muted-foreground">No notifications</p>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center cursor-pointer">
                <span className="text-sm text-blue-600 hover:text-blue-700">
                  View all notifications
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/user/1")}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="w-4 h-4 mr-2" />
                My Topics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;