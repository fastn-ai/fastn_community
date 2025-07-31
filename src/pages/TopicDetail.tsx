import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Eye, 
  Clock, 
  Pin, 
  Heart, 
  Share, 
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Reply
} from "lucide-react";

const TopicDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const topic = {
    id: 1,
    title: "🚀 We Need Your Help! [Answer & Earn]",
    category: "Announcements",
    author: "fastn-team",
    replies: 155,
    views: "26.7k",
    createdAt: "Sep 2024",
    isPinned: true,
    hasAnswers: true,
    categoryColor: "text-red-400",
    content: `Our forum traffic is surging! You may have noticed on social media, YouTube and also here on the forum: fastn's popularity is booming! 🎉

This is fantastic, but has also led to a huge influx of new questions here on the community forum. We're working hard to answer them all, but we could really use your help!

## How You Can Help

If you're an experienced fastn user, please consider:

- **Answering questions** in the Questions category
- **Sharing tutorials** and best practices
- **Reviewing code** in Built with fastn showcases
- **Providing feedback** on new features

## Answer & Earn Program

We're launching our Answer & Earn program where community members can earn points for:

- ✅ Answering questions (10 points)
- 🏆 Getting your answer marked as solution (50 points)
- 📚 Creating helpful tutorials (100 points)
- 🎯 Moderating discussions (25 points)

Thank you for being part of our amazing community! 🙏`,
    tags: ["announcement", "community", "help-wanted"]
  };

  const replies = [
    {
      id: 1,
      author: "developer123",
      avatar: "D",
      content: "This is great! I've been using fastn for 6 months now and would love to help answer questions. How do I get started with the Answer & Earn program?",
      createdAt: "4d ago",
      likes: 12,
      isAnswer: false
    },
    {
      id: 2,
      author: "codemaster",
      avatar: "C",
      content: "Count me in! I'll start by answering some integration questions. The community has helped me so much, time to give back! 💪",
      createdAt: "3d ago",
      likes: 8,
      isAnswer: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed top-20 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-card"
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Topic Header */}
          <div className="p-6 border-b border-border">
            <div className="max-w-4xl">
              <div className="flex items-start space-x-4 mb-4">
                {topic.isPinned && (
                  <Pin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-3">
                    {topic.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Badge variant="outline" className={`${topic.categoryColor} border-current`}>
                      {topic.category}
                    </Badge>
                    <span>by {topic.author}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{topic.createdAt}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{topic.views} views</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.replies} replies</span>
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Bookmark
                </Button>
              </div>
            </div>
          </div>

          {/* Topic Content */}
          <div className="p-6">
            <div className="max-w-4xl space-y-6">
              {/* Original Post */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-primary text-white">
                        F
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{topic.author}</div>
                      <div className="text-sm text-muted-foreground">{topic.createdAt}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-foreground">{topic.content}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {topic.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Replies */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {replies.length} Replies
                </h2>
                
                {replies.map((reply) => (
                  <Card key={reply.id} className={reply.isAnswer ? "border-green-500/50 bg-green-500/5" : ""}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {reply.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-foreground">{reply.author}</span>
                              {reply.isAnswer && (
                                <Badge variant="secondary" className="text-green-400 border-green-400">
                                  ✓ Answer
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{reply.createdAt}</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4">{reply.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          {reply.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Reply Form */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Add Your Reply</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Write your reply here..."
                    className="min-h-[120px]"
                  />
                  <div className="flex space-x-2">
                    <Button className="bg-gradient-primary">
                      Post Reply
                    </Button>
                    <Button variant="outline">
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;