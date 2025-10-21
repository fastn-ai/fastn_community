import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  MessageSquare, 
  BookOpen, 
  Megaphone, 
  HelpCircle, 
  Code, 
  Users, 
  Tag,
  ChevronDown,
  Star,
  TrendingUp,
  Zap,
  ExternalLink,
  Plus,
  Trophy,
  Search,
  UserPlus,
  Loader2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { ApiService, Topic } from "@/services/api";
import { queryKeys } from "@/services/queryClient";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Use React Query to fetch topics (shared with TopicList)
  const { data: topics = [], isLoading: topicsLoading, error: topicsError } = useQuery({
    queryKey: queryKeys.topics,
    queryFn: ApiService.getAllTopics,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch tags from API
  const { data: tags = [], isLoading: tagsLoading, error: tagsError } = useQuery({
    queryKey: queryKeys.tags,
    queryFn: ApiService.getAllTags,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  // Calculate real counts for each category
  const getCategoryCount = (categoryName: string) => {
    return topics.filter(topic => topic.category_name === categoryName).length;
  };

  const loading = topicsLoading || tagsLoading;

  const categories = [
    { 
      icon: Megaphone, 
      name: "Announcements", 
      count: topicsLoading ? "..." : getCategoryCount("Announcements"), 
      color: "text-red-400", 
      path: "/announcements" 
    },
    { 
      icon: HelpCircle, 
      name: "Questions", 
      count: topicsLoading ? "..." : getCategoryCount("Questions"), 
      color: "text-blue-400", 
      path: "/questions" 
    },
    { 
      icon: Code, 
      name: "Built with fastn", 
      count: topicsLoading ? "..." : getCategoryCount("Built with fastn"), 
      color: "text-purple-400", 
      path: "/built-with-fastn" 
    },
    
  ];

  // Get popular tags from API
  const getPopularTags = () => {
    if (!tags || tags.length === 0) return [];
    
    // Sort tags by some criteria (you can modify this based on your API response)
    // For now, we'll take the first 9 tags or sort by name
    const sortedTags = [...tags]
      .sort((a, b) => {
        // You can sort by topics_count if available, or by name
        if (a.topics_count && b.topics_count) {
          return b.topics_count - a.topics_count;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 9);
    
    return sortedTags.map(tag => tag.name);
  };

  const popularTags = loading ? [] : getPopularTags();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    // Navigate to topics page with tag filter
    navigate(`/?tag=${encodeURIComponent(tag)}`);
  };

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <aside className="w-64 bg-card border-r border-border h-screen fixed top-16 left-0 z-30 hidden md:block">
      <div className="p-4 space-y-6 h-full overflow-y-auto">
        
        {/* Quick Navigation */}
        <div className="space-y-2">
          <Button 
            variant={isActive("/") ? "default" : "ghost"} 
            className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
            onClick={() => navigate("/")}
          >
            <Home className="w-4 h-4 mr-3" />
            Topics
          </Button>
       
          <Button 
            variant={isActive("/community") ? "default" : "ghost"} 
            className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
            onClick={() => navigate("/community")}
          >
            <Users className="w-4 h-4 mr-3" />
            Community
          </Button>
          
          <Button 
            variant={isActive("/my-topics") ? "default" : "ghost"} 
            className="w-full justify-start hover:bg-accent hover:text-accent-foreground"
            onClick={() => navigate("/my-topics")}
          >
            <User className="w-4 h-4 mr-3" />
            My Topics
          </Button>
        </div>

        {/* Answer & Earn Section */}
     

        {/* Categories */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-accent hover:text-accent-foreground">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Categories
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={isActive(category.path) ? "default" : "ghost"}
                className="w-full justify-between text-sm group hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleCategoryClick(category.path)}
              >
                <div className="flex items-center">
                  <category.icon className={`w-4 h-4 mr-3 ${category.color}`} />
                  <span>{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    category.count
                  )}
                </Badge>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Popular Tags */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-accent hover:text-accent-foreground">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Popular Tags
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            {loading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            ) : popularTags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className={`text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors ${
                      selectedTag === tag ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => handleTagClick(tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground py-2">
                No tags available
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Answer & Earn Promo */}
        <div className="bg-gradient-primary p-4 rounded-lg">
          <div className="text-white">
            <h3 className="font-semibold text-sm">Answer & Earn 🎉</h3>
            <p className="text-xs opacity-90 mt-1">Help others and earn community points!</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2 text-xs"
              onClick={() => navigate("/answer-earn")}
            >
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;