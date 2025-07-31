import { MessageSquare, Eye, Clock, Pin, Star, Users, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const TopicList = () => {
  const topics = [
    {
      id: 1,
      title: "🚀 We Need Your Help! [Answer & Earn]",
      category: "Announcements",
      author: "fastn-team",
      replies: 155,
      views: "26.7k",
      lastActivity: "4d",
      isPinned: true,
      hasAnswers: true,
      categoryColor: "text-red-400",
      avatars: ["F", "T", "M", "S"],
      excerpt: "Our forum traffic is surging! You may have noticed on social media, YouTube and also here on the forum: fastn's popularity is booming! This is fantastic, but has also led to a huge influx of new questions here on the community..."
    },
    {
      id: 2,
      title: "Welcome to the fastn Community!",
      category: "Announcements", 
      author: "fastn-admin",
      replies: 1,
      views: "11.8k",
      lastActivity: "Sep 2019",
      isPinned: true,
      categoryColor: "text-red-400",
      avatars: ["A"],
      excerpt: "Welcome to the community! Here we talk about everything related to fastn. In case you are new to fastn here some links to get you started: Discord Channel Documentation GitHub Repository LinkedIn Profile Twitter Profile..."
    },
    {
      id: 3,
      title: "Best practices for API integration patterns",
      category: "Questions",
      author: "developer123",
      replies: 2,
      views: "3",
      lastActivity: "2m",
      categoryColor: "text-blue-400", 
      avatars: ["D", "M"],
      excerpt: "I'm working on a complex integration and wondering about the best patterns to follow..."
    },
    {
      id: 4,
      title: "How to handle rate limiting in fastn workflows?",
      category: "Questions",
      author: "apiuser",
      replies: 0,
      views: "1",
      lastActivity: "4m",
      categoryColor: "text-blue-400",
      avatars: ["A"],
      excerpt: "Having trouble with rate limiting when processing large volumes of data..."
    },
    {
      id: 5,
      title: "Building a custom connector tutorial",
      category: "Tutorials",
      author: "codemaster",
      replies: 8,
      views: "245",
      lastActivity: "1h",
      categoryColor: "text-green-400",
      avatars: ["C", "J", "K"],
      excerpt: "Step-by-step guide on creating your own connector for fastn..."
    },
    {
      id: 6,
      title: "Show off your fastn integration!",
      category: "Built with fastn",
      author: "showcase",
      replies: 23,
      views: "1.2k",
      lastActivity: "3h",
      categoryColor: "text-purple-400",
      avatars: ["S", "B", "N", "L"],
      excerpt: "Share your amazing integrations built with fastn and inspire others..."
    }
  ];

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-subtle">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to the fastn community
          </h1>
          <p className="text-muted-foreground">
            We're happy to have you here. If you need help, please search before you post.
          </p>
        </div>
      </div>

      {/* Topic Filters */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="default" size="sm" className="bg-gradient-primary">
              Latest
            </Button>
            <Button variant="ghost" size="sm">Categories</Button>
            <Button variant="ghost" size="sm">Top</Button>
          </div>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" asChild>
            <a href="/new-topic">+ New Topic</a>
          </Button>
        </div>

        {/* Topic Headers */}
        <div className="grid grid-cols-12 gap-4 text-sm text-muted-foreground font-medium border-b border-border pb-2">
          <div className="col-span-6">Topic</div>
          <div className="col-span-2 text-center">Replies</div>
          <div className="col-span-2 text-center">Views</div>
          <div className="col-span-2 text-center">Activity</div>
        </div>
      </div>

      {/* Topics */}
      <div className="p-6">
        <div className="space-y-4 max-w-5xl">
          {topics.map((topic) => (
            <a
              key={topic.id}
              href={`/topic/${topic.id}`}
              className="grid grid-cols-12 gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors group cursor-pointer"
            >
              {/* Topic Info */}
              <div className="col-span-6 space-y-2">
                <div className="flex items-start space-x-3">
                  {topic.isPinned && (
                    <Pin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-medium group-hover:text-primary transition-colors line-clamp-1">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {topic.excerpt}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge variant="outline" className={`text-xs ${topic.categoryColor} border-current`}>
                        {topic.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">by {topic.author}</span>
                      {topic.hasAnswers && (
                        <Badge variant="secondary" className="text-xs">
                          <Heart className="w-3 h-3 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Replies */}
              <div className="col-span-2 flex flex-col items-center justify-center space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="text-lg font-semibold text-foreground">{topic.replies}</span>
                </div>
                <div className="flex -space-x-1">
                  {topic.avatars.map((avatar, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-background">
                      <AvatarFallback className="text-xs bg-gradient-primary text-white">
                        {avatar}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>

              {/* Views */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{topic.views}</span>
                </div>
              </div>

              {/* Activity */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{topic.lastActivity}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicList;