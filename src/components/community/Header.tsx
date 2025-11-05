import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, User, Menu, Plus, Settings, MessageSquare, LogOut, LogIn, Shield } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CreateTopicModal from "@/components/ui/create-topic-modal";
import { useAuth } from "react-oidc-context";
import { signOut } from "@/services/users/user-manager";
import { useUserRole } from "@/context/UserRoleContext";
// Notifications temporarily disabled
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { fetchNotifications, markAllNotificationsRead, markNotificationRead, NotificationItem } from "@/services/notifications";
// import { queryKeys } from "@/services/queryClient";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false);
  const auth = useAuth();
  const { isAdmin } = useUserRole();
  
  // Check if user is on topic pages
  const isOnTopicPage = location.pathname === '/' || location.pathname === '/top';
  
  // Get user data from authentication context
  const user = auth.user ? {
    id: auth.user.profile.sub,
    username: auth.user.profile.preferred_username || auth.user.profile.name || auth.user.profile.email?.split('@')[0] || 'user',
    email: auth.user.profile.email
  } : null;
  
  const isAuthenticated = auth.isAuthenticated && auth.user;
  
  const logout = async () => {
    try {
      await signOut();
      // signOut handles the redirect and session clearing
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: clear session and navigate manually
      localStorage.clear();
      sessionStorage.clear();
      navigate('/');
    }
  };

  // Provide token to service (temporary bridge without tight coupling)
  useEffect(() => {
    (window as any).authAccessToken = auth.user?.access_token;
  }, [auth.user?.access_token]);

  // Notifications temporarily disabled
  // const { data: notifications = [], refetch } = useQuery<NotificationItem[]>({
  //   queryKey: queryKeys.notifications,
  //   queryFn: fetchNotifications,
  //   enabled: Boolean(auth?.isAuthenticated),
  // });
  // const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadCount = 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
  };

  // Notifications temporarily disabled
  // const markReadMutation = useMutation({
  //   mutationFn: (id: string) => markNotificationRead(id),
  //   onSuccess: () => {
  //     refetch();
  //   }
  // });

  // const markAllReadMutation = useMutation({
  //   mutationFn: () => markAllNotificationsRead(),
  //   onSuccess: () => {
  //     refetch();
  //   }
  // });

  // const handleNotificationClick = (notificationId: string, link?: string) => {
  //   markReadMutation.mutate(notificationId);
  //   if (link) {
  //     navigate(link);
  //   }
  // };

  // const getNotificationIcon = (type: string) => {
  //   switch (type) {
  //     case "reply":
  //       return "💬";
  //     case "solved":
  //       return "✅";
  //     case "follow":
  //       return "👤";
  //     case "digest":
  //       return "📧";
  //     default:
  //       return "🔔";
  //   }
  // };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-2 sm:px-4 gap-2 w-full">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="854.667"
            height="524"
            version="1"
            viewBox="0 0 641 393"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14"
          >
            <path
              d="M481 2644c-37-26-54-77-39-114 7-17 236-270 508-561 272-292 495-537 495-543 0-7-229-239-510-516-280-277-515-513-522-525-36-60 15-145 87-145 25 0 499 189 588 234 439 223 669 722 562 1217-63 293-252 554-507 700-106 60-580 269-612 269-15 0-37-7-50-16zm436-307c68-31 155-77 194-103 170-113 303-288 368-484 24-74 42-162 32-158-6 2-675 718-745 796l-21 23 25-9c14-6 80-35 147-65zm578-1138c-58-222-212-431-407-553-71-44-345-162-355-153-2 3 171 176 384 385s389 380 390 378c1-1-4-27-12-57zM2283 2220c-56-12-96-33-139-77-61-61-85-128-98-271l-11-126-35-8c-19-5-52-14-72-19l-38-10v-129h150V850h190v730h280v170h-282l3 113c4 95 7 117 27 149 39 63 115 80 227 52l26-6-3 68-3 69-35 11c-52 18-139 24-187 14zM4528 1868l-3-122-62-18-63-19v-129h130v-237c0-321 14-396 87-465 58-55 155-72 270-48 74 16 74 16 54 89l-18 64-71-2c-68-2-74-1-102 28l-30 29v542h240v170h-240v240h-189l-3-122z"
              transform="matrix(.1 0 0 -.1 0 393)"
            ></path>
            <path
              d="M388 1823c-86-9-105-113-27-141 13-5 120-6 237-3 209 6 214 7 233 30 27 34 24 75-7 100-25 20-38 21-213 19-102-1-203-3-223-5zM2921 1754c-80-21-144-60-205-124-225-236-161-619 129-761 66-32 74-34 180-34 100 0 115 2 161 27 27 14 64 40 81 56l32 29 11-49 12-48h158v900h-156l-13-50-13-50-45 40c-81 71-212 96-332 64zm226-184c195-112 189-448-11-553-57-30-155-29-212 0-50 27-100 82-128 142-32 71-30 207 5 281 49 106 128 159 234 160 48 0 70-6 112-30zM5445 1757c-55-18-106-45-133-70l-22-21-17 42-16 42h-147V850h180v283c0 163 4 298 10 319 41 145 265 198 367 87 44-48 47-70 51-386l4-303h169l-3 333-3 332-26 55c-58 123-157 189-295 196-50 2-94-1-119-9zM3843 1746c-86-28-158-89-192-166-28-61-26-115 4-177 42-84 111-126 287-173 133-37 178-65 178-113 0-88-122-141-242-105-35 10-90 58-100 88-4 13-158-53-158-68 0-25 70-110 113-139 164-109 420-73 526 74 74 102 69 225-13 301-64 59-121 84-308 136-71 20-118 58-118 95 0 111 210 139 268 36 9-17 18-32 19-34 2-2 39 4 83 14 88 20 91 24 61 83-28 54-78 101-141 131-66 31-198 39-267 17zM297 1500l-249-5-24-28c-26-31-30-54-13-90 22-48 34-49 487-42l422 8 25 23c41 38 33 104-16 129-30 16-109 17-632 5zM432 1161c-72-5-86-9-103-30-22-27-23-41-8-74 20-44 45-48 272-41 195 6 214 8 235 27 32 29 30 79-4 106-24 19-39 21-168 19-77-1-179-4-224-7z"
              transform="matrix(.1 0 0 -.1 0 393)"
            ></path>
          </svg>
        </div>

        {/* Search - Hidden on mobile, shown on tablet and up */}
        <div className="hidden md:flex flex-1 max-w-md mx-2 lg:mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Search community..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary w-full"
            />
          </form>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {/* Mobile Search Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Search</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2">
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search community..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </form>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications - Temporarily disabled */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
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
                    onClick={() => handleNotificationClick(notification.id, notification.link)}
                  >
                    <div className="flex items-start space-x-3 w-full">
                      <div className="text-lg">{getNotificationIcon(notification.type || '')}</div>
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
                          {new Date(notification.createdAt).toLocaleString()}
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
              <DropdownMenuItem className="text-center cursor-pointer" onClick={() => markAllReadMutation.mutate()}>
                <span className="text-sm text-blue-600 hover:text-blue-700">
                  Mark all as read
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* User Menu / Auth Buttons */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 sm:gap-2">
                  <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
                    <AvatarFallback className="bg-gradient-primary text-white text-xs">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline text-sm font-medium">
                    {user?.username || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{user?.username || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => navigate("/my-topics")}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  My Topics
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/login')} 
                className="flex items-center gap-1 sm:gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
              <Button 
                size="sm"
                onClick={() => navigate('/login')} 
                className="flex items-center gap-1 sm:gap-2"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Button>
            </div>
          )}
          {/* Mobile menu (opens sidebar) */}
          {onMenuClick && (
            <Button variant="ghost" size="sm" className="md:hidden" onClick={onMenuClick} aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Create Topic Modal */}
      <CreateTopicModal 
        isOpen={isCreateTopicModalOpen}
        onClose={() => setIsCreateTopicModalOpen(false)}
        position="top"
      />
    </header>
  );
};

export default Header;