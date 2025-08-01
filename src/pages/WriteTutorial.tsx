import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Save, Eye, EyeOff, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";

const WriteTutorial = () => {
  const navigate = useNavigate();
  const [isPreview, setIsPreview] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    level: "",
    category: "",
    tags: [] as string[],
    isPublished: false,
    allowComments: true,
    allowRating: true,
    featured: false,
    estimatedTime: "",
    prerequisites: ""
  });

  const levels = [
    { value: "beginner", label: "Beginner", color: "bg-green-100 text-green-800" },
    { value: "intermediate", label: "Intermediate", color: "bg-yellow-100 text-yellow-800" },
    { value: "advanced", label: "Advanced", color: "bg-red-100 text-red-800" }
  ];

  const categories = [
    "Getting Started",
    "Database",
    "Authentication",
    "Deployment",
    "API Development",
    "UI/UX",
    "Testing",
    "Performance",
    "Security",
    "Best Practices"
  ];

  const popularTags = [
    "fastn", "tutorial", "guide", "database", "api", "authentication", 
    "deployment", "react", "typescript", "javascript", "web-development"
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addCustomTag = () => {
    if (customTag && !formData.tags.includes(customTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag]
      }));
      setCustomTag("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidImage = file.type.startsWith('image/');
      const isValidVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return (isValidImage || isValidVideo) && isValidSize;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    console.log("Saving tutorial:", { ...formData, uploadedFiles });
  };

  const handlePublish = () => {
    console.log("Publishing tutorial:", { ...formData, uploadedFiles });
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Write Tutorial</h1>
              <p className="text-muted-foreground">Share your knowledge with the community</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="max-w-4xl">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tutorial Details</CardTitle>
                      <CardDescription>Provide the essential details for your tutorial</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                          id="title"
                          placeholder="Enter tutorial title..."
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          placeholder="Brief description of what this tutorial covers..."
                          rows={3}
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="level">Difficulty Level *</Label>
                          <Select value={formData.level} onValueChange={(value) => handleInputChange("level", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category *</Label>
                          <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="estimatedTime">Estimated Time</Label>
                          <Input
                            id="estimatedTime"
                            placeholder="e.g., 30 minutes, 2 hours"
                            value={formData.estimatedTime}
                            onChange={(e) => handleInputChange("estimatedTime", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="prerequisites">Prerequisites</Label>
                          <Input
                            id="prerequisites"
                            placeholder="e.g., Basic JavaScript knowledge"
                            value={formData.prerequisites}
                            onChange={(e) => handleInputChange("prerequisites", e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Content</CardTitle>
                      <CardDescription>Write your tutorial content using Markdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor="content">Tutorial Content *</Label>
                        <Textarea
                          id="content"
                          placeholder="Write your tutorial content here... You can use Markdown formatting."
                          rows={20}
                          value={formData.content}
                          onChange={(e) => handleInputChange("content", e.target.value)}
                          className="font-mono"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Media Upload */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Media Files</CardTitle>
                      <CardDescription>Add images and videos to enhance your tutorial</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Images & Videos</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop files here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground mb-4">
                            Supports: JPG, PNG, GIF, MP4, MOV (Max 10MB each)
                          </p>
                          <Input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Choose Files
                          </Button>
                        </div>
                        
                        {/* Uploaded Files Preview */}
                        {uploadedFiles.length > 0 && (
                          <div className="space-y-2">
                            <Label>Uploaded Files:</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {uploadedFiles.map((file, index) => (
                                <div key={index} className="relative group">
                                  {file.type.startsWith('image/') ? (
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-full h-20 object-cover rounded border"
                                    />
                                  ) : (
                                    <video
                                      src={URL.createObjectURL(file)}
                                      className="w-full h-20 object-cover rounded border"
                                      muted
                                    />
                                  )}
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeFile(index)}
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                  <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {file.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preview */}
                  {isPreview && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Preview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose max-w-none">
                          <h1>{formData.title || "Untitled Tutorial"}</h1>
                          <p className="text-muted-foreground">{formData.description || "No description provided"}</p>
                          <div className="flex items-center space-x-2 mb-4">
                            {formData.level && (
                              <Badge className={levels.find(l => l.value === formData.level)?.color}>
                                {levels.find(l => l.value === formData.level)?.label}
                              </Badge>
                            )}
                            {formData.category && (
                              <Badge variant="outline">{formData.category}</Badge>
                            )}
                          </div>
                          <div className="border-t pt-4">
                            <pre className="whitespace-pre-wrap">{formData.content || "No content yet..."}</pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Action Buttons */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsPreview(!isPreview)}
                        className="w-full"
                      >
                        {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                        {isPreview ? "Hide Preview" : "Preview"}
                      </Button>
                      <Button variant="outline" onClick={handleSave} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button onClick={handlePublish} className="w-full bg-gradient-primary">
                        Publish Tutorial
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                      <CardDescription>Add relevant tags to help others find your tutorial</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Popular Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {popularTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={formData.tags.includes(tag) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handleTagToggle(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label>Custom Tags</Label>
                        <div className="flex space-x-2">
                          <Input 
                            placeholder="Add custom tag..." 
                            value={customTag}
                            onChange={(e) => setCustomTag(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                          />
                          <Button size="sm" onClick={addCustomTag}>Add</Button>
                        </div>
                      </div>
                      {formData.tags.length > 0 && (
                        <div>
                          <Label>Selected Tags</Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {formData.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="default"
                                className="cursor-pointer"
                                onClick={() => handleTagToggle(tag)}
                              >
                                {tag} ×
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
                          <Label>Publish immediately</Label>
                          <p className="text-xs text-muted-foreground">
                            Make tutorial visible to everyone
                          </p>
                        </div>
                        <Switch
                          checked={formData.isPublished}
                          onCheckedChange={(checked) => handleInputChange("isPublished", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Allow comments</Label>
                          <p className="text-xs text-muted-foreground">
                            Let others comment on your tutorial
                          </p>
                        </div>
                        <Switch
                          checked={formData.allowComments}
                          onCheckedChange={(checked) => handleInputChange("allowComments", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Allow rating</Label>
                          <p className="text-xs text-muted-foreground">
                            Let others rate your tutorial
                          </p>
                        </div>
                        <Switch
                          checked={formData.allowRating}
                          onCheckedChange={(checked) => handleInputChange("allowRating", checked)}
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Featured tutorial</Label>
                          <p className="text-xs text-muted-foreground">
                            Mark as featured (admin approval required)
                          </p>
                        </div>
                        <Switch
                          checked={formData.featured}
                          onCheckedChange={(checked) => handleInputChange("featured", checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Writing Tips */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Writing Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>Start with a clear introduction explaining what readers will learn</span>
                        </p>
                        <p className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>Include code examples and screenshots where helpful</span>
                        </p>
                        <p className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>Break down complex concepts into smaller steps</span>
                        </p>
                        <p className="flex items-start space-x-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                          <span>End with a summary and next steps</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteTutorial; 