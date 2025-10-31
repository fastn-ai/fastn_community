import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  ArrowLeft,
  Upload,
  X,
  Tag,
  Clock,
  Star,
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
import { useApi, type Category } from "@/services/api";
// Removed auth context import
import { useToast } from "@/hooks/use-toast";

const UnifiedForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createTopic, getAllCategories } = useApi();
  const { toast } = useToast();
  // Mock user data since we removed authentication
  const user = { id: 'user_1', username: 'admin', email: 'admin@fastn.ai' };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSubmitted = useRef(false);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    title?: string
    description?: string
    category?: string
    content?: string
    tags?: string
  }>({})
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

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


  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const fetchedCategories = await getAllCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please try again.");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [getAllCategories]);



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

  // Validation functions
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required'
        if (value.trim().length < 5) return 'Title must be at least 5 characters'
        if (value.trim().length > 200) return 'Title must be less than 200 characters'
        return undefined
      case 'description':
        if (!value.trim()) return 'Description is required'
        if (value.trim().length < 10) return 'Description must be at least 10 characters'
        if (value.trim().length > 500) return 'Description must be less than 500 characters'
        return undefined
      case 'category':
        if (!value.trim()) return 'Category is required'
        return undefined
      case 'content':
        if (!value.trim()) return 'Content is required'
        if (value.trim().length < 10) return 'Content must be at least 10 characters'
        if (value.trim().length > 10000) return 'Content must be less than 10,000 characters'
        return undefined
      case 'tags':
        if (tags.length === 0) return 'At least one tag is required'
        if (tags.length > 3) return 'Maximum 3 tags allowed'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {}
    
    errors.title = validateField('title', formData.title)
    errors.description = validateField('description', formData.description)
    errors.category = validateField('category', formData.category)
    errors.content = validateField('content', formData.content)
    errors.tags = validateField('tags', '') // Pass empty string since we check tags array
    
    setValidationErrors(errors)
    return !Object.values(errors).some(error => error !== undefined)
  }


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
      // Clear validation error when tags change
      if (validationErrors.tags) {
        setValidationErrors(prev => ({ ...prev, tags: undefined }))
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
    // Clear validation error when tags change
    if (validationErrors.tags) {
      setValidationErrors(prev => ({ ...prev, tags: undefined }))
    }
  };

  const addPredefinedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag]);
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      // Clear validation error when tags change
      if (validationErrors.tags) {
        setValidationErrors(prev => ({ ...prev, tags: undefined }))
      }
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

    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the validation errors below')
      return
    }

    hasSubmitted.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
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
        category_id: formData.category || "", // Use category ID directly
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

      // Inform user topic is under review
      toast({
        title: "Topic submitted",
        description: "Got it! Our team is reviewing your topic before it goes live",
        variant: "success",
      });

      // Navigate to the community page after successful creation
      navigate("/");
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
                Create New Topic
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Start a new discussion topic in the fastn community.
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
                            placeholder="Enter your topic title..."
                            value={formData.title}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                              // Clear validation error on change
                              if (validationErrors.title) {
                                setValidationErrors(prev => ({ ...prev, title: undefined }))
                              }
                            }}
                            onBlur={() => {
                              const error = validateField('title', formData.title)
                              setValidationErrors(prev => ({ ...prev, title: error }))
                            }}
                            className={`border-border focus:border-primary ${
                              validationErrors.title ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                            required
                          />
                          {validationErrors.title && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.title}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            placeholder="Brief description of your topic..."
                            value={formData.description}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                              // Clear validation error on change
                              if (validationErrors.description) {
                                setValidationErrors(prev => ({ ...prev, description: undefined }))
                              }
                            }}
                            onBlur={() => {
                              const error = validateField('description', formData.description)
                              setValidationErrors(prev => ({ ...prev, description: error }))
                            }}
                            rows={3}
                            className={`border-border focus:border-primary ${
                              validationErrors.description ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                            required
                          />
                          {validationErrors.description && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.description}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => {
                              setFormData((prev) => ({
                                ...prev,
                                category: value,
                              }))
                              // Clear validation error on change
                              if (validationErrors.category) {
                                setValidationErrors(prev => ({ ...prev, category: undefined }))
                              }
                            }}
                          >
                            <SelectTrigger className={`border-border focus:border-primary ${
                              validationErrors.category ? 'border-red-500 focus:border-red-500' : ''
                            }`}>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {isLoadingCategories ? (
                                <SelectItem value="" disabled>
                                  Loading categories...
                                </SelectItem>
                              ) : (
                                categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {validationErrors.category && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.category}</p>
                          )}
                        </div>

                      </CardContent>
                    </Card>

                    {/* Content */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Content</CardTitle>
                        <CardDescription>
                          Write your topic content...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <Label htmlFor="content">Content *</Label>
                          <Textarea
                            id="content"
                            placeholder="Write your topic content here..."
                            value={formData.content}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                content: e.target.value,
                              }))
                              // Clear validation error on change
                              if (validationErrors.content) {
                                setValidationErrors(prev => ({ ...prev, content: undefined }))
                              }
                            }}
                            onBlur={() => {
                              const error = validateField('content', formData.content)
                              setValidationErrors(prev => ({ ...prev, content: error }))
                            }}
                            rows={12}
                            className={`border-border focus:border-primary ${
                              validationErrors.content ? 'border-red-500 focus:border-red-500' : ''
                            }`}
                            required
                          />
                          {validationErrors.content && (
                            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{validationErrors.content}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Media Files */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Media Files</CardTitle>
                        <CardDescription>
                          Upload images, videos, or other files to support your topic
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
                          Add tags to help others find your topic
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

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Selected Tags: *</h4>
                          {tags.length > 0 ? (
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
                          ) : (
                            <p className="text-sm text-muted-foreground">Select at least one tag</p>
                          )}
                          {validationErrors.tags && (
                            <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.tags}</p>
                          )}
                        </div>
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
                              Allow users to rate this topic
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
                              Mark as featured topic
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
                          disabled={isSubmitting || Object.values(validationErrors).some(error => error !== undefined)}
                        >
                          {isSubmitting ? "Creating..." : "Create Topic"}
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
