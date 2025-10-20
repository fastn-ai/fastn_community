import { useState, useEffect } from "react";
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

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch topics to calculate real counts
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedTopics = await ApiService.getAllTopics();
        setTopics(fetchedTopics);
      } catch (err) {
        console.error("Error fetching topics for sidebar:", err);
        setError("Failed to load category counts");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Calculate real counts for each category
  const getCategoryCount = (categoryName: string) => {
    return topics.filter(topic => topic.category_name === categoryName).length;
  };

  const categories = [
    { 
      icon: Megaphone, 
      name: "Announcements", 
      count: loading ? "..." : getCategoryCount("Announcements"), 
      color: "text-red-400", 
      path: "/announcements" 
    },
    { 
      icon: HelpCircle, 
      name: "Questions", 
      count: loading ? "..." : getCategoryCount("Questions"), 
      color: "text-blue-400", 
      path: "/questions" 
    },
    { 
      icon: Code, 
      name: "Built with fastn", 
      count: loading ? "..." : getCategoryCount("Built with fastn"), 
      color: "text-purple-400", 
      path: "/built-with-fastn" 
    },
    
  ];

  // Get popular tags from actual topics
  const getPopularTags = () => {
    const allTags: string[] = [];
    topics.forEach(topic => {
      if (topic.tags && Array.isArray(topic.tags)) {
        allTags.push(...topic.tags);
      }
    });
    
    // Count tag occurrences
    const tagCounts: { [key: string]: number } = {};
    allTags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    // Add specific tags we want to always show
    const specificTags = ["fastn", "best-practices", "deployment"];
    specificTags.forEach(tag => {
      if (!tagCounts[tag]) {
        tagCounts[tag] = 0; // Add with 0 count if not in database
      }
    });
    
    // Return specific tags first, then top popular tags
    const specificTagsList = specificTags.filter(tag => tagCounts[tag] !== undefined);
    const popularTags = Object.entries(tagCounts)
      .filter(([tag]) => !specificTags.includes(tag)) // Exclude specific tags from popular list
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([tag]) => tag);
    
    // Combine specific tags with popular tags, ensuring no duplicates
    const combinedTags = [...specificTagsList, ...popularTags];
    return combinedTags.slice(0, 9); // Show up to 9 tags total
  };

  const tags = loading ? [] : getPopularTags();

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
            ) : tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
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