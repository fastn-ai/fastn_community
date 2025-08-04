import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  ArrowLeft,
  Upload,
  X,
  Tag,
  Clock,
  Star,
  BookOpen,
  MessageSquare,
  Code,
  Megaphone,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { useApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const UnifiedForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createTopic } = useApi();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("topic");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSubmitted = useRef(false);

  // Form data that adapts based on category
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    difficulty: "",
    estimatedTime: "",
    prerequisites: "",
    relatedLinks: "",
    allowRating: true,
    featured: false,
    tags: [] as string[],
    mediaFiles: [] as File[],
  });

  const categoryOptions = [
    {
      value: "topic",
      label: "Topic",
      icon: MessageSquare,
      description: "Create a discussion topic",
    },
    {
      value: "tutorial",
      label: "Tutorial",
      icon: BookOpen,
      description: "Write a tutorial guide",
    },
  ];

  const topicCategories = ["Announcements", "Questions", "Built with fastn"];

  // Category ID mapping (you may need to adjust these based on your actual category IDs)
  const categoryIdMapping: { [key: string]: string } = {
    Announcements: "id_1754163675_740242", // Default category ID
    Questions: "id_1754163675_740242", // Default category ID
    "Built with fastn": "id_1754163675_740242", // Default category ID
  };

  const tutorialCategories = [
    "Getting Started",
    "Intermediate",
    "Advanced",
    "API Integration",
    "Database",
    "Authentication",
    "Deployment",
    "Testing",
    "Performance",
    "Security",
  ];

  const difficulties = [
    { value: "beginner", label: "Beginner", color: "text-green-500" },
    { value: "intermediate", label: "Intermediate", color: "text-orange-500" },
    { value: "advanced", label: "Advanced", color: "text-red-500" },
  ];

  const predefinedTags = [
    "fastn",
    "api",
    "integration",
    "workflow",
    "database",
    "authentication",
    "deployment",
    "testing",
    "performance",
    "security",
    "best-practices",
  ];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset form data when category changes
    setFormData({
      title: "",
      description: "",
      content: "",
      category: "",
      difficulty: "",
      estimatedTime: "",
      prerequisites: "",
      relatedLinks: "",
      allowRating: true,
      featured: false,
      tags: [],
      mediaFiles: [],
    });
    setTags([]);
    setUploadedFiles([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...files],
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      const newTag = customTag.trim();
      setTags((prev) => [...prev, newTag]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addPredefinedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting || hasSubmitted.current) {
      console.log(
        "Form submission already in progress, ignoring duplicate submission"
      );
      return;
    }

    hasSubmitted.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedCategory === "topic") {
        // Check if user is authenticated
        if (!user?.id) {
          setError(
            "You must be logged in to create a topic. Please log in and try again."
          );
          return;
        }

        // Create topic using the API
        const topicData = {
          title: formData.title,
          description: formData.description,
          content: formData.content,
          author_id: user.id, // Use actual user ID
          author_username: user.username || user.email?.split("@")[0] || "user", // Use actual username
          category_id:
            categoryIdMapping[formData.category] || "id_1754163675_740242", // Map category name to ID
          is_featured: formData.featured,
          is_hot: false,
          is_new: true,
          view_count: 0,
          reply_count: 0,
          like_count: 0,
          bookmark_count: 0,
          share_count: 0,
          tags: formData.tags, // Include tags array
        };

        console.log("Creating topic with data:", topicData);
        console.log("Tags being sent:", formData.tags);
        const createdTopic = await createTopic(topicData);
        console.log("Topic created successfully:", createdTopic);

        // Navigate to the community page after successful creation
        navigate("/");
      } else {
        // Handle tutorial creation (placeholder for now)
        console.log("Tutorial creation not implemented yet");
        navigate("/all-tutorials");
      }
    } catch (error) {
      console.error("Error creating topic:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create topic. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      hasSubmitted.current = false;
    }
  };

  const isTopic = selectedCategory === "topic";
  const isTutorial = selectedCategory === "tutorial";

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
          <div className="p-4 md:p-6 border-b border-border bg-gradient-subtle">
            <div className="max-w-4xl">
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </Button>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {isTopic ? "Create New Topic" : "Write Tutorial"}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                {isTopic
                  ? "Start a new discussion topic in the fastn community."
                  : "Share your knowledge by writing a tutorial for the community."}
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
              {error && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Category Selection */}
                {/*<Card>
                  <CardHeader>
                    <CardTitle>Select Type</CardTitle>
                    <CardDescription>
                      Choose whether you want to create a topic or write a tutorial
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedCategory === option.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleCategoryChange(option.value)}
                        >
                          <div className="flex items-center space-x-3">
                            <option.icon className="w-6 h-6 text-primary" />
                            <div>
                              <h3 className="font-semibold text-foreground">{option.label}</h3>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>*/}

                {/* Main Form */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Main Form Fields */}
                  <div className="xl:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            placeholder={
                              isTopic
                                ? "Enter your topic title..."
                                : "Enter tutorial title..."
                            }
                            value={formData.title}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            placeholder={
                              isTopic
                                ? "Brief description of your topic..."
                                : "Brief description of your tutorial..."
                            }
                            value={formData.description}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            rows={3}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) =>
                              setFormData((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {(isTopic
                                ? topicCategories
                                : tutorialCategories
                              ).map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {isTutorial && (
                          <>
                            <div>
                              <Label htmlFor="difficulty">
                                Difficulty Level
                              </Label>
                              <Select
                                value={formData.difficulty}
                                onValueChange={(value) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    difficulty: value,
                                  }))
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                  {difficulties.map((difficulty) => (
                                    <SelectItem
                                      key={difficulty.value}
                                      value={difficulty.value}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <span>{difficulty.label}</span>
                                        <div
                                          className={`w-2 h-2 rounded-full ${difficulty.color.replace(
                                            "text-",
                                            "bg-"
                                          )}`}
                                        />
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="estimatedTime">
                                Estimated Time
                              </Label>
                              <Input
                                id="estimatedTime"
                                placeholder="e.g., 15 minutes, 1 hour"
                                value={formData.estimatedTime}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    estimatedTime: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            <div>
                              <Label htmlFor="prerequisites">
                                Prerequisites
                              </Label>
                              <Textarea
                                id="prerequisites"
                                placeholder="What should readers know before starting this tutorial?"
                                value={formData.prerequisites}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    prerequisites: e.target.value,
                                  }))
                                }
                                rows={2}
                              />
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>

                    {/* Content */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Content</CardTitle>
                        <CardDescription>
                          {isTopic
                            ? "Write your topic content..."
                            : "Write your tutorial content..."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <Label htmlFor="content">Content *</Label>
                          <Textarea
                            id="content"
                            placeholder={
                              isTopic
                                ? "Write your topic content here..."
                                : "Write your tutorial content here..."
                            }
                            value={formData.content}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                content: e.target.value,
                              }))
                            }
                            rows={12}
                            required
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Media Files */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Media Files</CardTitle>
                        <CardDescription>
                          Upload images, videos, or other files to support your{" "}
                          {isTopic ? "topic" : "tutorial"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-border rounded-lg p-4 md:p-6 text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Drag and drop files here, or click to browse
                            </p>
                            <Input
                              type="file"
                              multiple
                              accept="image/*,video/*,.pdf,.doc,.docx"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="file-upload"
                            />
                            <Label
                              htmlFor="file-upload"
                              className="cursor-pointer"
                            >
                              <Button variant="outline" size="sm">
                                Choose Files
                              </Button>
                            </Label>
                          </div>

                          {uploadedFiles.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">
                                Uploaded Files:
                              </h4>
                              {uploadedFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-2 bg-muted rounded"
                                >
                                  <span className="text-sm truncate">
                                    {file.name}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar Settings */}
                  <div className="space-y-6">
                    {/* Tags */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Tags</CardTitle>
                        <CardDescription>
                          Add tags to help others find your{" "}
                          {isTopic ? "topic" : "tutorial"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Input
                            placeholder="Add custom tag..."
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              (e.preventDefault(), addCustomTag())
                            }
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={addCustomTag}
                            className="sm:w-auto"
                          >
                            Add
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Popular Tags:</h4>
                          <div className="flex flex-wrap gap-1">
                            {predefinedTags.map((tag) => (
                              <Badge
                                key={tag}
                                variant={
                                  tags.includes(tag) ? "default" : "outline"
                                }
                                className="cursor-pointer text-xs"
                                onClick={() =>
                                  tags.includes(tag)
                                    ? removeTag(tag)
                                    : addPredefinedTag(tag)
                                }
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {tags.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">
                              Selected Tags:
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="secondary"
                                  className="cursor-pointer text-xs"
                                  onClick={() => removeTag(tag)}
                                >
                                  {tag} <X className="w-3 h-3 ml-1" />
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Allow Rating</Label>
                            <p className="text-xs text-muted-foreground">
                              Allow users to rate this{" "}
                              {isTopic ? "topic" : "tutorial"}
                            </p>
                          </div>
                          <Switch
                            checked={formData.allowRating}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                allowRating: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Featured</Label>
                            <p className="text-xs text-muted-foreground">
                              Mark as featured {isTopic ? "topic" : "tutorial"}
                            </p>
                          </div>
                          <Switch
                            checked={formData.featured}
                            onCheckedChange={(checked) =>
                              setFormData((prev) => ({
                                ...prev,
                                featured: checked,
                              }))
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          type="submit"
                          className="w-full"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting
                            ? "Creating..."
                            : isTopic
                            ? "Create Topic"
                            : "Publish Tutorial"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                        >
                          Save Draft
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={() => navigate(-1)}
                        >
                          Cancel
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedForm;
