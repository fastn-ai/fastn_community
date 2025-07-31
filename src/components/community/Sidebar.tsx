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
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { icon: Megaphone, name: "Announcements", count: 5, color: "text-red-400", path: "/announcements" },
    { icon: HelpCircle, name: "Questions", count: 142, color: "text-blue-400", path: "/questions" },
    { icon: BookOpen, name: "Tutorials", count: 28, color: "text-green-400", path: "/tutorials" },
    { icon: Code, name: "Built with fastn", count: 67, color: "text-purple-400", path: "/built-with-fastn" },
    { icon: Users, name: "Community", count: 89, color: "text-orange-400", path: "/community" },
  ];

  const tags = [
    "integration", "ai", "workflow", "api", "automation", "middleware"
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
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
        
        
        </div>

        {/* Resources Section */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto hover:bg-accent hover:text-accent-foreground">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Resources
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => navigate("/all-tutorials")}
            >
              <BookOpen className="w-4 h-4 mr-3" />
              All Tutorials
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => navigate("/write-tutorial")}
            >
              <Plus className="w-4 h-4 mr-3" />
              Write Tutorial
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => window.open("https://docs.fastn.com", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-3" />
              Documentation
            </Button>
          </CollapsibleContent>
        </Collapsible>

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
                onClick={() => navigate(category.path)}
              >
                <div className="flex items-center">
                  <category.icon className={`w-4 h-4 mr-3 ${category.color}`} />
                  <span>{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
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
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Answer & Earn */}
        <div className="bg-gradient-primary p-4 rounded-lg">
          <div className="text-white">
            <h3 className="font-semibold text-sm">Answer & Earn 🎉</h3>
            <p className="text-xs opacity-90 mt-1">Help others and earn community points!</p>
            <Button variant="secondary" size="sm" className="mt-2 text-xs">
              Learn more
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;