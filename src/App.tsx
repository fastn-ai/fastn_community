import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import Top from "./pages/Top";
import NewTopic from "./pages/NewTopic";
import TopicDetail from "./pages/TopicDetail";
import Tutorials from "./pages/Tutorials";
import Announcements from "./pages/Announcements";
import Questions from "./pages/Questions";
import BuiltWithFastn from "./pages/BuiltWithFastn";
import Community from "./pages/Community";
import WriteTutorial from "./pages/WriteTutorial";
import AllTutorials from "./pages/AllTutorials";
import AnswerEarn from "./pages/AnswerEarn";
import Leaderboard from "./pages/Leaderboard";
import OpenQuestions from "./pages/OpenQuestions";
import UnifiedForm from "./pages/UnifiedForm";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/top" element={<Top />} />
          <Route path="/new-topic" element={<NewTopic />} />
          <Route path="/topic/:id" element={<TopicDetail />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/built-with-fastn" element={<BuiltWithFastn />} />
          <Route path="/community" element={<Community />} />
          <Route path="/write-tutorial" element={<WriteTutorial />} />
          <Route path="/all-tutorials" element={<AllTutorials />} />
          <Route path="/answer-earn" element={<AnswerEarn />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/open-questions" element={<OpenQuestions />} />
          <Route path="/create" element={<UnifiedForm />} />
          <Route path="/user/:id" element={<UserProfile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
