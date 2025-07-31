import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import TopicList from "@/components/community/TopicList";

const Questions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <TopicList />
      </div>
    </div>
  );
};

export default Questions;