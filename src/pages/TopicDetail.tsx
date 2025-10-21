import { useState, useEffect } from "react";
import { Menu, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Reply,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "@/services/api";
// Removed auth context import
import type { Topic, Reply as ReplyType } from "@/services/api";
import { getTagColor } from "@/lib/utils";

interface TopicDetailResponse {
  data: {
    data: Topic;
    replies: ReplyType[];
  };
}

const TopicDetail = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<ReplyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [editingReplyData, setEditingReplyData] = useState<ReplyType | null>(
    null
  );
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getAllTopicById, createReply, editReply, deleteReply } = useApi();
  // Mock user data since we removed authentication
  const user = { id: 'user_1', username: 'admin', email: 'admin@fastn.ai' };
  const isAuthenticated = true;

  useEffect(() => {
    const fetchTopic = async () => {
      if (!id) {
        setError("No topic ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const response = await getAllTopicById(id);

        // Handle the response structure
        if (response) {
          setTopic(response);
          // For now, use mock replies since we don't have a replies API
          const mockReplies: ReplyType[] = [
            {
              id: "reply_1",
              topic_id: id || "1",
              author_id: "user_2",
              author_username: "john_doe",
              author_avatar: "",
              content: "Thanks for the warm welcome! I'm excited to be part of this community and learn more about fastn.",
              tutorial_id: "",
              parent_reply_id: "",
              is_accepted: false,
              is_helpful: true,
              like_count: 5,
              dislike_count: 0,
              reply_count: 0,
              created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            },
            {
              id: "reply_2",
              topic_id: id || "1",
              author_id: "user_1",
              author_username: "admin",
              author_avatar: "",
              content: "You're very welcome! Feel free to explore the different categories and don't hesitate to ask if you have any questions.",
              tutorial_id: "",
              parent_reply_id: "",
              is_accepted: true,
              is_helpful: true,
              like_count: 8,
              dislike_count: 0,
              reply_count: 0,
              created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            },
          ];
          setReplies(mockReplies);
        } else {
          throw new Error("Topic not found");
        }
      } catch (err) {
        console.error("Error fetching topic:", err);
        setError("Failed to load topic");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]);

  const submitReply = async () => {
    // Prevent multiple submissions
    if (submittingReply) {
      console.log("Submission already in progress");
      return;
    }

    // Set submitting state immediately to prevent multiple calls
    setSubmittingReply(true);

    if (!replyContent.trim() || !id) {
      setSubmittingReply(false);
      return;
    }

    try {
      setError(null); // Clear any previous errors
      console.log("Submitting reply..."); // Debug log
      const newReply = await createReply({
        topic_id: id,
        content: replyContent,
        author_id: user?.id || "id_1754164424_145800",
        author_username: user?.username || "current_user",
        tutorial_id: "",
        is_accepted: false,
        is_helpful: false,
        like_count: 0,
        dislike_count: 0,
        reply_count: 0,
      });

      console.log("Reply submitted successfully"); // Debug log
      // Clear the form after successful submission
      setReplyContent("");

      // Add the new reply to the local state instead of refetching
      if (newReply && typeof newReply === "object") {
        const replyData = newReply as ReplyType;
        setReplies((prevReplies) => [...prevReplies, replyData]);

        // Update topic reply count
        if (topic) {
          setTopic((prevTopic) =>
            prevTopic
              ? {
                  ...prevTopic,
                  reply_count: prevTopic.reply_count + 1,
                }
              : null
          );
        }
      }
    } catch (error) {
      console.error("Error submitting reply:", error);
      if (error instanceof Error) {
        setError(`Failed to submit reply: ${error.message}`);
      } else {
        setError("Failed to submit reply");
      }
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleSubmitReply = async () => {
    // Prevent default form submission behavior
    await submitReply();
  };

  const handleEditReply = (reply: ReplyType) => {
    setEditingReplyId(reply.id);
    setEditingContent(reply.content);
    // Store the reply data for editing
    setEditingReplyData(reply);
  };

  const handleCancelEdit = () => {
    setEditingReplyId(null);
    setEditingContent("");
    setEditingReplyData(null);
  };

  const handleSubmitEdit = async () => {
    if (!editingReplyId || !editingContent.trim() || !id) {
      return;
    }

    try {
      setError(null); // Clear any previous errors
      setSubmittingEdit(true);

      if (!editingReplyData) {
        throw new Error("No reply data found for editing");
      }

      const result = await editReply({
        id: editingReplyId,
        content: editingContent,
      });

      console.log("Edit reply result:", result); // Debug log

      // Clear editing state
      setEditingReplyId(null);
      setEditingContent("");
      setEditingReplyData(null);

      // Update the reply in local state instead of refetching
      setReplies((prevReplies) =>
        prevReplies.map((reply) =>
          reply.id === editingReplyId
            ? { ...reply, content: editingContent }
            : reply
        )
      );

      // Navigate to community page after successful edit
      navigate("/");
    } catch (error) {
      console.error("Error editing reply:", error);
      if (error instanceof Error) {
        setError(`Failed to edit reply: ${error.message}`);
      } else {
        setError("Failed to edit reply");
      }
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    if (!replyId) return;

    try {
      setError(null); // Clear any previous errors
      setDeletingReplyId(replyId);

      await deleteReply(replyId);

      // Remove the reply from local state instead of refetching
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.id !== replyId)
      );

      // Update topic reply count
      if (topic) {
        setTopic((prevTopic) =>
          prevTopic
            ? {
                ...prevTopic,
                reply_count: Math.max(0, prevTopic.reply_count - 1),
              }
            : null
        );
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
      if (error instanceof Error) {
        setError(`Failed to delete reply: ${error.message}`);
      } else {
        setError("Failed to delete reply");
      }
    } finally {
      setDeletingReplyId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
            <div className="p-6">
              <div className="max-w-4xl">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:ml-64">
            <div className="p-6">
              <div className="max-w-4xl">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground mb-4">
                    Error Loading Topic
                  </h1>
                  <p className="text-muted-foreground mb-4">
                    {error || "Topic not found"}
                  </p>
                  <Button onClick={() => navigate(-1)}>Go Back</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50">
              <Sidebar />
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 md:ml-64">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-subtle">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </Button>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Topic Details
              </h1>
              <p className="text-muted-foreground">
                View and discuss this topic
              </p>
            </div>
          </div>

          {/* Topic Header */}
          <div className="p-6 border-b border-border">
            <div className="max-w-4xl">
              <div className="flex items-start space-x-4 mb-4">
                {topic.is_featured && (
                  <Pin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-3">
                    {topic.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <Badge
                      variant="outline"
                      className={`text-${
                        topic.category_color || "blue"
                      }-400 border-current`}
                    >
                      {topic.category_name}
                    </Badge>
                    <span>by {topic.author_username}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(topic.created_at).toLocaleDateString()}
                      </span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{topic.view_count} views</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{topic.reply_count} replies</span>
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
                        {topic.author_username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">
                        {topic.author_username}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(topic.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-line text-foreground">
                      {topic.content || topic.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {topic.tags &&
                      topic.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`inline-block px-2 py-1 text-xs rounded-full border ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
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
                    <Card
                      key={reply.id}
                      className={
                        reply.is_accepted
                          ? "border-green-500/50 bg-green-500/5"
                          : ""
                      }
                      style={{
                        opacity: deletingReplyId === reply.id ? 0.5 : 1,
                        pointerEvents:
                          deletingReplyId === reply.id ? "none" : "auto",
                      }}
                    >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {reply.author_username
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-foreground">
                                {reply.author_username} 
                              </span>
                              {reply.is_accepted && (
                                <Badge
                                  variant="secondary"
                                  className="text-green-400 border-green-400"
                                >
                                  ✓ Answer
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(reply.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingReplyId === reply.id}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditReply(reply)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Reply
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this reply?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteReply(reply.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deletingReplyId === reply.id}
                                  >
                                    {deletingReplyId === reply.id
                                      ? "Deleting..."
                                      : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editingReplyId === reply.id ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                            className="min-h-[100px]"
                            placeholder="Edit your reply..."
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={handleSubmitEdit}
                              disabled={
                                submittingEdit || !editingContent.trim()
                              }
                              className="bg-gradient-primary"
                            >
                              {submittingEdit ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              disabled={submittingEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-foreground mb-4">
                            {reply.content}
                          </p>
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm">
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              {reply.like_count}
                            </Button>
                            {isAuthenticated && (
                              <Button variant="ghost" size="sm">
                                <Reply className="w-4 h-4 mr-2" />
                                Reply 
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Error Display */}
              {error && (
                <Card className="border-red-500 bg-red-50 dark:bg-red-950">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reply Form - Only show when authenticated */}
              {isAuthenticated ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {user?.username?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Add Your Reply
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Replying as {user?.username || "User"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Textarea
                        placeholder="Write your reply here..."
                        className="min-h-[120px]"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        disabled={submittingReply}
                      />
                      <div className="flex space-x-2 mt-4">
                        <Button
                          type="button"
                          className="bg-gradient-primary"
                          onClick={() => handleSubmitReply()}
                          disabled={submittingReply}
                        >
                          {submittingReply ? "Posting..." : "Post Reply"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={submittingReply}
                        >
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <p className="text-muted-foreground">
                        Please sign in to reply to this topic
                      </p>
                      <Button
                        onClick={() => navigate("/login")}
                        className="bg-gradient-primary"
                      >
                        Sign In to Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicDetail;
