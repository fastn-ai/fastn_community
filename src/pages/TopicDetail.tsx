import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { getUser } from "@/services/users/user-manager";
import type { Topic, Reply as ReplyType } from "@/services/api";
import { getTagColor } from "@/lib/utils";

interface TopicDetailResponse {
  data: {
    data: Topic;
    replies: ReplyType[];
  };
}

// Reply Item Component - Extracted outside to prevent re-creation on every render
interface ReplyItemProps {
  reply: ReplyType & { children: ReplyType[] };
  depth?: number;
  user: any;
  isAuthenticated: boolean;
  editingReplyId: string | null;
  editingContent: string;
  setEditingContent: (content: string) => void;
  submittingEdit: boolean;
  deletingReplyId: string | null;
  replyingToId: string | null;
  subReplyContent: string;
  setSubReplyContent: (content: string) => void;
  submittingSubReply: boolean;
  handleEditReply: (reply: ReplyType) => void;
  handleSubmitEdit: () => void;
  handleCancelEdit: () => void;
  handleDeleteReply: (replyId: string) => void;
  handleReplyToReply: (replyId: string) => void;
  handleSubmitSubReply: () => void;
  handleCancelSubReply: () => void;
}

// Forward declare the comparison function
const arePropsEqual = (prevProps: ReplyItemProps, nextProps: ReplyItemProps) => {
  // Always re-render if the reply itself changed
  if (prevProps.reply.id !== nextProps.reply.id) return false;
  if (prevProps.reply.content !== nextProps.reply.content) return false;
  if (prevProps.reply.like_count !== nextProps.reply.like_count) return false;
  
  // Re-render if this reply is being edited
  if (prevProps.editingReplyId === prevProps.reply.id || nextProps.editingReplyId === nextProps.reply.id) {
    if (prevProps.editingReplyId !== nextProps.editingReplyId) return false;
    if (prevProps.editingContent !== nextProps.editingContent) return false;
  }
  
  // Re-render if this reply is being deleted
  if (prevProps.deletingReplyId === prevProps.reply.id || nextProps.deletingReplyId === nextProps.reply.id) {
    if (prevProps.deletingReplyId !== nextProps.deletingReplyId) return false;
  }
  
  // Re-render if someone is replying to this reply
  if (prevProps.replyingToId === prevProps.reply.id || nextProps.replyingToId === nextProps.reply.id) {
    if (prevProps.replyingToId !== nextProps.replyingToId) return false;
    if (prevProps.subReplyContent !== nextProps.subReplyContent) return false;
    if (prevProps.submittingSubReply !== nextProps.submittingSubReply) return false;
  }
  
  // Re-render if children changed
  if (prevProps.reply.children.length !== nextProps.reply.children.length) return false;
  
  // Don't re-render otherwise
  return true;
};

const ReplyItem = React.memo(({ 
  reply, 
  depth = 0,
  user,
  isAuthenticated,
  editingReplyId,
  editingContent,
  setEditingContent,
  submittingEdit,
  deletingReplyId,
  replyingToId,
  subReplyContent,
  setSubReplyContent,
  submittingSubReply,
  handleEditReply,
  handleSubmitEdit,
  handleCancelEdit,
  handleDeleteReply,
  handleReplyToReply,
  handleSubmitSubReply,
  handleCancelSubReply,
}: ReplyItemProps) => {
  const isSubReply = depth > 0;
  
  return (
    <div className={isSubReply ? "ml-6 border-l-2 border-border pl-4" : ""}>
      <Card
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleReplyToReply(reply.id)}
                  >
                    <Reply className="w-4 h-4 mr-2" />
                    Reply 
                  </Button>
                )}
              </div>
            </>
          )}
          
          {/* Sub-reply form */}
          {replyingToId === reply.id && (
            <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-primary text-white">
                    {(user?.profile?.preferred_username || user?.profile?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Reply to {reply.author_username}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Replying as {user?.profile?.preferred_username || user?.profile?.email?.split("@")[0] || "User"}
                  </p>
                </div>
              </div>
              <Textarea
                placeholder="Write your reply here..."
                className="min-h-[80px] mb-3"
                value={subReplyContent}
                onChange={(e) => setSubReplyContent(e.target.value)}
                disabled={submittingSubReply}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className="bg-gradient-primary"
                  onClick={handleSubmitSubReply}
                  disabled={submittingSubReply || !subReplyContent.trim()}
                >
                  {submittingSubReply ? "Posting..." : "Post Reply"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancelSubReply}
                  disabled={submittingSubReply}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Render children replies */}
      {reply.children.length > 0 && (
        <div className="mt-4 space-y-4">
          {reply.children.map((child) => (
            <ReplyItem 
              key={child.id} 
              reply={child as ReplyType & { children: ReplyType[] }} 
              depth={depth + 1}
              user={user}
              isAuthenticated={isAuthenticated}
              editingReplyId={editingReplyId}
              editingContent={editingContent}
              setEditingContent={setEditingContent}
              submittingEdit={submittingEdit}
              deletingReplyId={deletingReplyId}
              replyingToId={replyingToId}
              subReplyContent={subReplyContent}
              setSubReplyContent={setSubReplyContent}
              submittingSubReply={submittingSubReply}
              handleEditReply={handleEditReply}
              handleSubmitEdit={handleSubmitEdit}
              handleCancelEdit={handleCancelEdit}
              handleDeleteReply={handleDeleteReply}
              handleReplyToReply={handleReplyToReply}
              handleSubmitSubReply={handleSubmitSubReply}
              handleCancelSubReply={handleCancelSubReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}, arePropsEqual);

ReplyItem.displayName = 'ReplyItem';

// Session cache to track if user has been inserted to avoid duplicate calls
const userInsertedCache = new Map<string, boolean>();

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
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [subReplyContent, setSubReplyContent] = useState("");
  const [submittingSubReply, setSubmittingSubReply] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getAllTopicById, createReply, editReply, deleteReply } = useApi();
  // Get the actual authenticated user
  const user = getUser();
  const isAuthenticated = !!(user && user.access_token && user.profile);
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  
  // Check if user has already liked this topic on mount
  useEffect(() => {
    if (isAuthenticated && user && id) {
      const userId = user.profile?.sub || user.profile?.sid || user.profile?.email;
      if (userId) {
        const likedTopics = JSON.parse(localStorage.getItem('likedTopics') || '{}');
        const likeKey = `${userId}-${id}`;
        if (likedTopics[likeKey]) {
          setLiked(true);
        }
      }
    }
  }, [isAuthenticated, user, id]);
  
  // Function to ensure user exists in database (only once per session)
  const ensureUserExists = useCallback(async () => {
    if (!user?.access_token || !user?.profile) {
      return;
    }

    const userId = user.profile.sub || user.profile.sid || user.profile.email;
    
    // Check if user has already been inserted in this session
    if (userInsertedCache.has(userId)) {
      return; // User already inserted, skip
    }

    try {
      const { insertUser } = await import("@/services/api");
      const authToken = user.access_token;
      
      const userPayload = {
        action: "insertUser" as const,
        data: {
          id: userId,
          username: user.profile.preferred_username || user.profile.email?.split("@")[0] || "user",
          email: user.profile.email || "",
          avatar: user.profile.picture || "",
          bio: "",
          location: user.profile.locale || "",
          website: "",
          twitter: "",
          github: "",
          linkedin: "",
          role_id: 2,
          is_verified: true,
          is_active: true,
          last_login: new Date().toISOString(),
          created_at: undefined,
          updated_at: new Date().toISOString(),
        },
      };
      
      await insertUser(userPayload, authToken);
      
      // Mark user as inserted in cache
      userInsertedCache.set(userId, true);
    } catch (error) {
      // User creation/update failed, but don't block the reply
      console.warn("Failed to ensure user exists:", error);
    }
  }, [user]);

  // Function to refresh replies (for future use if needed)
  const refreshReplies = async () => {
    try {
      const { ApiService } = await import("@/services/api");
      const topicReplies = await ApiService.getRepliesByTopicId(id || "");
      setReplies(topicReplies);
    } catch (error) {
      // Failed to refresh replies
    }
  };

  // Function to organize replies hierarchically
  const organizeReplies = useMemo(() => (replies: ReplyType[]) => {
    const replyMap = new Map<string, ReplyType & { children: ReplyType[] }>();
    const rootReplies: (ReplyType & { children: ReplyType[] })[] = [];

    // First pass: create map with children arrays
    replies.forEach(reply => {
      replyMap.set(reply.id, { ...reply, children: [] });
    });

    // Second pass: organize hierarchy
    replies.forEach(reply => {
      const replyWithChildren = replyMap.get(reply.id)!;
      if (reply.parent_reply_id && replyMap.has(reply.parent_reply_id)) {
        replyMap.get(reply.parent_reply_id)!.children.push(replyWithChildren);
      } else {
        rootReplies.push(replyWithChildren);
      }
    });

    return rootReplies;
  }, []);

  useEffect(() => {
    const fetchTopic = async () => {
      if (!id) {
        setError("No topic ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Ensure user exists on first page load (first action in session)
        if (isAuthenticated) {
          ensureUserExists().catch(() => {
            // Silently fail, don't block page load
          });
        }
        
        const response = await getAllTopicById(id);

        // Handle the response structure
        if (response) {
          setTopic(response);
          // Load replies for this topic
          try {
            const { ApiService } = await import("@/services/api");
            // Convert topic ID to number if it's a string
            const topicId = id ? (isNaN(Number(id)) ? id : Number(id)) : "";
            const topicReplies = await ApiService.getRepliesByTopicId(topicId.toString());
            setReplies(topicReplies);
          } catch (replyError) {
            setReplies([]);
          }
        } else {
          throw new Error("Topic not found");
        }
      } catch (err) {
        setError("Failed to load topic");
      } finally {
        setLoading(false);
      }
    };

    fetchTopic();
  }, [id]); // Only depend on id, not on authentication state

  const submitReply = async () => {
    // Prevent multiple submissions
    if (submittingReply) {
      return;
    }

    // Set submitting state immediately to prevent multiple calls
    setSubmittingReply(true);

    if (!replyContent.trim() || !id) {
      setSubmittingReply(false);
      return;
    }

    // Check if user is authenticated
    if (!user || !user.access_token || !user.profile) {
      setError("You must be logged in to create a reply");
      setSubmittingReply(false);
      return;
    }

    try {
      setError(null); // Clear any previous errors
      
      // Ensure user exists in database (only once per session)
      await ensureUserExists();
      
      const replyData = {
        topic_id: id,
        content: replyContent,
        // Use the same ID format as insertUser function
        author_id: user?.profile?.sub || user?.profile?.sid || user?.profile?.email,
        author_username: user?.profile?.preferred_username || user?.profile?.email?.split("@")[0] || "anonymous",
        like_count: 0,
      };
      
      const newReply = await createReply(replyData);

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

  const handleReplyToReply = useCallback((replyId: string) => {
    setReplyingToId(replyId);
    setSubReplyContent("");
  }, []);

  const handleCancelSubReply = useCallback(() => {
    setReplyingToId(null);
    setSubReplyContent("");
  }, []);

  const handleSubmitSubReply = async () => {
    if (!replyingToId || !subReplyContent.trim() || !id) {
      return;
    }

    // Prevent multiple submissions
    if (submittingSubReply) {
      return;
    }

    setSubmittingSubReply(true);

    // Check if user is authenticated
    if (!user || !user.access_token || !user.profile) {
      setError("You must be logged in to create a reply");
      setSubmittingSubReply(false);
      return;
    }

    try {
      setError(null);

      // Ensure user exists in database (only once per session)
      await ensureUserExists();
      
      const subReplyData = {
        topic_id: id,
        content: subReplyContent,
        parent_reply_id: replyingToId,
        author_id: user?.profile?.sub || user?.profile?.sid || user?.profile?.email,
        author_username: user?.profile?.preferred_username || user?.profile?.email?.split("@")[0] || "anonymous",
        like_count: 0,
      };
      
      const newSubReply = await createReply(subReplyData);

      // Clear the form after successful submission
      setSubReplyContent("");
      setReplyingToId(null);

      // Add the new sub-reply to the local state
      if (newSubReply && typeof newSubReply === "object") {
        const replyData = newSubReply as ReplyType;
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
      if (error instanceof Error) {
        setError(`Failed to submit reply: ${error.message}`);
      } else {
        setError("Failed to submit reply");
      }
    } finally {
      setSubmittingSubReply(false);
    }
  };

  const handleEditReply = useCallback((reply: ReplyType) => {
    setEditingReplyId(reply.id);
    setEditingContent(reply.content);
    // Store the reply data for editing
    setEditingReplyData(reply);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingReplyId(null);
    setEditingContent("");
    setEditingReplyData(null);
  }, []);

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
    } catch (error) {
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
      if (error instanceof Error) {
        setError(`Failed to delete reply: ${error.message}`);
      } else {
        setError("Failed to delete reply");
      }
    } finally {
      setDeletingReplyId(null);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !user || !id) {
      console.log("User not authenticated or topic ID not found");
      return;
    }

    // Prevent duplicate likes
    if (liked) {
      console.log("Topic already liked by user");
      return;
    }

    const userId = user.profile?.sub || user.profile?.sid || user.profile?.email;
    
    if (!userId) {
      console.log("User ID not found");
      return;
    }

    try {
      setIsLiking(true);

      const payload = {
        data: {
          userId: userId,
          topicId: parseInt(id)
        }
      };

      const { submitLikesApi } = await import("@/services/api");
      const { FASTN_API_KEY } = await import("@/constants");
      
      await submitLikesApi(payload, user.access_token, FASTN_API_KEY);
      
      console.log("Like submitted successfully");
      
      // Save to localStorage
      const likedTopics = JSON.parse(localStorage.getItem('likedTopics') || '{}');
      const likeKey = `${userId}-${id}`;
      likedTopics[likeKey] = true;
      localStorage.setItem('likedTopics', JSON.stringify(likedTopics));
      
      // Update local state
      setLiked(true);
      if (topic) {
        setTopic({
          ...topic,
          like_count: topic.like_count + 1
        });
      }
      
    } catch (error) {
      console.error("Error submitting like:", error);
      
      // Handle duplicate like error gracefully
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("duplicate key") || 
          errorMessage.includes("already exists") || 
          errorMessage.includes("likes_unique_topic")) {
        console.log("Topic already liked");
        
        // Save to localStorage even if duplicate
        const likedTopics = JSON.parse(localStorage.getItem('likedTopics') || '{}');
        const likeKey = `${userId}-${id}`;
        likedTopics[likeKey] = true;
        localStorage.setItem('likedTopics', JSON.stringify(likedTopics));
        
        setLiked(true);
        // Don't show error message for duplicate likes
      } else {
        setError(`Failed to like topic: ${errorMessage}`);
      }
    } finally {
      setIsLiking(false);
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLike}
                  disabled={!isAuthenticated || isLiking}
                  className={liked ? "border-primary text-primary" : ""}
                >
                  <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                  {isLiking ? "Liking..." : "Like"}
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
                    {(topic.content || topic.description) ? (
                      <p className="whitespace-pre-line text-foreground">
                        {topic.content || topic.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        No content provided for this topic.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {topic.tags && (() => {
                      const parseTags = (tags?: string[] | string | any): string[] => {
                        if (!tags) return [];
                        
                        // If tags is already an array of objects with name property
                        if (Array.isArray(tags)) {
                          const result = tags.map((tag: any) => {
                            if (typeof tag === 'object' && tag.name) {
                              return tag.name;
                            }
                            return tag;
                          }).filter((tag: string) => tag && tag.length > 0);
                          return result;
                        }
                        
                        // Handle the new API structure where tags is an object with value property
                        if (tags && typeof tags === 'object' && tags.value) {
                          try {
                            const parsedTags = JSON.parse(tags.value);
                            if (Array.isArray(parsedTags)) {
                              const result = parsedTags.map((tag: any) => tag.name || tag).filter((tag: string) => tag && tag.length > 0);
                              return result;
                            }
                          } catch (error) {
                            return [];
                          }
                        }
                        
                        // If tags is a string, parse it
                        if (typeof tags === 'string') {
                          try {
                            const cleanTags = tags.replace(/[{}]/g, "");
                            return cleanTags
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag.length > 0);
                          } catch (error) {
                            return [];
                          }
                        }
                        
                        return [];
                      };
                      
                      const parsedTags = parseTags(topic.tags);
                      return parsedTags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-block px-2 py-1 text-xs rounded-full border ${getTagColor(tag)}`}
                        >
                          {tag}
                        </span>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Replies */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {replies.length} Replies
                </h2>

                {organizeReplies(replies).map((reply) => (
                  <ReplyItem 
                    key={reply.id} 
                    reply={reply}
                    user={user}
                    isAuthenticated={isAuthenticated}
                    editingReplyId={editingReplyId}
                    editingContent={editingContent}
                    setEditingContent={setEditingContent}
                    submittingEdit={submittingEdit}
                    deletingReplyId={deletingReplyId}
                    replyingToId={replyingToId}
                    subReplyContent={subReplyContent}
                    setSubReplyContent={setSubReplyContent}
                    submittingSubReply={submittingSubReply}
                    handleEditReply={handleEditReply}
                    handleSubmitEdit={handleSubmitEdit}
                    handleCancelEdit={handleCancelEdit}
                    handleDeleteReply={handleDeleteReply}
                    handleReplyToReply={handleReplyToReply}
                    handleSubmitSubReply={handleSubmitSubReply}
                    handleCancelSubReply={handleCancelSubReply}
                  />
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
              {isAuthenticated && user?.access_token && user?.profile ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {(user?.profile?.preferred_username || user?.profile?.email?.split("@")[0] || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Add Your Reply
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Replying as {user?.profile?.preferred_username || user?.profile?.email?.split("@")[0] || "User"}
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
                          onClick={() => {
                            handleSubmitReply();
                          }}
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
