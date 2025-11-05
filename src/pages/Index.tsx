import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import TopicList from "@/components/community/TopicList";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-[70]">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-[80]">
              <Sidebar isMobile />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          <TopicList sidebarOpen={sidebarOpen} />
        </div>
      </div>
    </div>
  );
};

export default Index;
