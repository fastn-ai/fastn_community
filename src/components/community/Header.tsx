import { Search, Menu, Bell, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import fastnLogo from "@/assets/fastn-logo.png";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results or implement search functionality
      console.log("Searching for:", searchQuery);
      // You can implement actual search functionality here
    }
  };

  const handleNotificationClick = () => {
    // Implement notification functionality
    console.log("Notifications clicked");
    // You can show a notification dropdown or navigate to notifications page
  };

  return (
    <header className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-4 md:space-x-8">
          <div className="flex items-center space-x-2">
            <div className="text-xl md:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent cursor-pointer" onClick={() => navigate("/")}>
              fastn
            </div>
          </div>
          
         
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-4 md:mx-8 relative">
          <form onSubmit={handleSearch}>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search community..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary"
            />
          </form>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-foreground"
            onClick={handleNotificationClick}
          >
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate("/new-topic")}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Topic
            </Button>
            <Button variant="outline" className="border-border">Log in</Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Sign up
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;