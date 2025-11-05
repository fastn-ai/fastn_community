import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "react-oidc-context";
import { queryClient } from "@/services/queryClient";
import { oidcSettings } from "@/services/users/user-manager";
import { OAuthRedirectApiInfoProvider } from "@/context/oauth-redirect-api-info";
import { PermissionsProvider } from "@/context/permissions-provider";
import { UserRoleProvider } from "@/context/UserRoleContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Categories from "./pages/Categories";
import Top from "./pages/Top";

import TopicDetail from "./pages/TopicDetail";
import Announcements from "./pages/Announcements";
import Questions from "./pages/Questions";
import BuiltWithFastn from "./pages/BuiltWithFastn";
import Community from "./pages/Community";
import AnswerEarn from "./pages/AnswerEarn";
import Leaderboard from "./pages/Leaderboard";
import UnifiedForm from "./pages/UnifiedForm";
import AdminDashboard from "./pages/AdminDashboard";
import UserTopics from "./pages/UserTopics";

import { LoginPage } from "./routes/login/login.page";
import { ConnectorActivateRedirectHandler } from "./routes/login/oauth";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider {...oidcSettings}>
      <OAuthRedirectApiInfoProvider>
        <PermissionsProvider>
          <UserRoleProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/top" element={<Top />} />
      
                <Route path="/topic/:id" element={<TopicDetail />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/questions" element={<Questions />} />
                <Route path="/built-with-fastn" element={<BuiltWithFastn />} />
                <Route path="/community" element={<Community />} />
                <Route path="/answer-earn" element={<AnswerEarn />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/create" element={<UnifiedForm />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/my-topics" element={<UserTopics />} />
                {/* Auth routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/oauth" element={<ConnectorActivateRedirectHandler />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
     
            </TooltipProvider>
          </UserRoleProvider>
        </PermissionsProvider>
      </OAuthRedirectApiInfoProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
