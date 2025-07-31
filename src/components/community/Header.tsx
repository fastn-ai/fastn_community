import { Search, Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import fastnLogo from "@/assets/fastn-logo.png";

const Header = () => {
  return (
    <header className="border-b border-border bg-gradient-subtle backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              fastn
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-foreground hover:text-primary transition-colors">Community</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Product</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Docs</a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Integrations</a>
          </nav>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search community..." 
            className="pl-10 bg-muted border-border focus:ring-primary focus:border-primary"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="w-5 h-5" />
          </Button>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" className="border-border">Log in</Button>
            <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300">
              Sign up
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;