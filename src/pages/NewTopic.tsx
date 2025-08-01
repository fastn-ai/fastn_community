import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Upload, X, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const NewTopic = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    difficulty: "",
    isPublic: true,
    allowComments: true,
    allowRating: true,
    featured: false,
    description: "",
    estimatedTime: "",
    relatedLinks: ""
  });

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput.trim());
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { ...formData, tags, uploadedFiles });
    // Handle form submission here
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", { ...formData, tags, uploadedFiles });
    // Handle draft saving here
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Create New Topic</h1>
              <p className="text-muted-foreground">Start a new discussion in the community</p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="max-w-4xl">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Form */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Topic Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title *</Label>
                          <Input
                            id="title"
                            placeholder="What's your topic about?"
                            className="text-lg"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Short Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Brief description of your topic..."
                            className="min-h-[80px]"
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="announcements">Announcements</SelectItem>
                                <SelectItem value="questions">Questions</SelectItem>
                                <SelectItem value="tutorials">Tutorials</SelectItem>
                                <SelectItem value="built-with-fastn">Built with fastn</SelectItem>
                                <SelectItem value="community">Community</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty Level</Label>
                            <Select value={formData.difficulty} onValueChange={(value) => handleInputChange("difficulty", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="estimatedTime">Estimated Time</Label>
                            <Input
                              id="estimatedTime"
                              placeholder="e.g., 5 minutes, 1 hour"
                              value={formData.estimatedTime}
                              onChange={(e) => handleInputChange("estimatedTime", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="relatedLinks">Related Links</Label>
                            <Input
                              id="relatedLinks"
                              placeholder="e.g., GitHub repo, documentation"
                              value={formData.relatedLinks}
                              onChange={(e) => handleInputChange("relatedLinks", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content">Content *</Label>
                          <Textarea
                            id="content"
                            placeholder="Write your topic content here... You can use markdown!"
                            className="min-h-[300px]"
                            value={formData.content}
                            onChange={(e) => handleInputChange("content", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags</Label>
                          <div className="space-y-2">
                            <Input
                              id="tags"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyPress}
                              placeholder="Add tags (press Enter or comma to add)"
                            />
                            {tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <X 
                                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                                      onClick={() => removeTag(tag)}
                                    />
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-2">
                          <Label>Media Files (Images/Videos)</Label>
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
                  </div>

                  {/* Sidebar Settings */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Public Topic</Label>
                            <p className="text-xs text-muted-foreground">
                              Make this topic visible to everyone
                            </p>
                          </div>
                          <Switch
                            checked={formData.isPublic}
                            onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                          />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Allow Comments</Label>
                            <p className="text-xs text-muted-foreground">
                              Let others comment on your topic
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
                            <Label>Allow Rating</Label>
                            <p className="text-xs text-muted-foreground">
                              Let others rate your topic
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
                            <Label>Featured Topic</Label>
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

                    {/* Action Buttons */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => setPreviewMode(!previewMode)}
                        >
                          {previewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                          {previewMode ? "Hide Preview" : "Preview"}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full"
                          onClick={handleSaveDraft}
                        >
                          Save as Draft
                        </Button>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-primary"
                        >
                          Create Topic
                        </Button>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          className="w-full"
                          onClick={() => navigate("/")}
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

export default NewTopic;