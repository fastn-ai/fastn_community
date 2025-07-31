import Header from "@/components/community/Header";
import Sidebar from "@/components/community/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

const NewTopic = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-background">
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-subtle">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create New Topic
              </h1>
              <p className="text-muted-foreground">
                Share your question, tutorial, or showcase your fastn project.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <div className="max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle>New Topic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="What's your topic about?"
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
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
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your topic content here... You can use markdown!"
                      className="min-h-[300px]"
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

                  <div className="flex space-x-4 pt-4">
                    <Button className="bg-gradient-primary">
                      Create Topic
                    </Button>
                    <Button variant="outline">
                      Save as Draft
                    </Button>
                    <Button variant="ghost">
                      Cancel
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

export default NewTopic;