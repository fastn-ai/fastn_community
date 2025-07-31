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
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

const Sidebar = () => {
  const categories = [
    { icon: Megaphone, name: "Announcements", count: 5, color: "text-red-400" },
    { icon: HelpCircle, name: "Questions", count: 142, color: "text-blue-400" },
    { icon: BookOpen, name: "Tutorials", count: 28, color: "text-green-400" },
    { icon: Code, name: "Built with fastn", count: 67, color: "text-purple-400" },
    { icon: Users, name: "Community", count: 89, color: "text-orange-400" },
  ];

  const tags = [
    "integration", "ai", "workflow", "api", "automation", "middleware"
  ];

  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-6">
        
        {/* Quick Navigation */}
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-primary bg-accent">
            <Home className="w-4 h-4 mr-3" />
            Latest Topics
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <TrendingUp className="w-4 h-4 mr-3" />
            Top
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Star className="w-4 h-4 mr-3" />
            README
          </Button>
        </div>

        {/* Resources Section */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Resources
              </span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 mt-2">
            <Button variant="ghost" className="w-full justify-start text-sm">
              <BookOpen className="w-4 h-4 mr-3" />
              Documentation
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              <Zap className="w-4 h-4 mr-3" />
              Quickstart
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sm">
              <Code className="w-4 h-4 mr-3" />
              Examples
            </Button>
          </CollapsibleContent>
        </Collapsible>

        {/* Categories */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
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
                variant="ghost"
                className="w-full justify-between text-sm group hover:bg-accent"
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
            <Button variant="ghost" className="w-full justify-between p-2 h-auto">
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
                  className="text-xs cursor-pointer hover:bg-accent transition-colors"
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