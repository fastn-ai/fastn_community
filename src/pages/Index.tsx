import React, { useState } from 'react';
import Header from '@/components/community/Header';
import Sidebar from '@/components/community/Sidebar';
import TopicList from '@/components/community/TopicList';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">
          <TopicList sidebarOpen={sidebarOpen} />
        </main>
      </div>
    </div>
  );
};

export default Index;
