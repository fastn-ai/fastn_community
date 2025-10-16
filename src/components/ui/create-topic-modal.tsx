import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Maximize2, Minimize2, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Alert, AlertDescription } from './alert'
import { Textarea } from './textarea'
import { useApi } from '@/services/api'
import { useAuth } from 'react-oidc-context'
import { AuthGuard } from '@/components/auth/AuthGuard'

interface CreateTopicModalProps {
  isOpen: boolean
  onClose: () => void
  position?: 'top' | 'bottom'
}

const CreateTopicModal = ({ isOpen, onClose, position = 'bottom' }: CreateTopicModalProps) => {
  const navigate = useNavigate()
  const { createTopic } = useApi()
  const modalRef = useRef<HTMLDivElement>(null)
  const auth = useAuth()
  
  // Get user data from authentication context
  const user = auth.user ? {
    id: auth.user.profile.sub,
    username: auth.user.profile.preferred_username || auth.user.profile.name || auth.user.profile.email?.split('@')[0] || 'user',
    email: auth.user.profile.email
  } : null
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [tagSearchQuery, setTagSearchQuery] = useState('')
  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  const [templateApplied, setTemplateApplied] = useState(false)

  // Static tags - no backend needed
  const availableTags = [
    { id: 'tag_1', name: 'fastn', color: '#8B5CF6' },
    { id: 'tag_2', name: 'development', color: '#06B6D4' },
    { id: 'tag_3', name: 'api', color: '#10B981' },
    { id: 'tag_4', name: 'integration', color: '#F59E0B' },
    { id: 'tag_5', name: 'workflow', color: '#EF4444' },
    { id: 'tag_6', name: 'database', color: '#8B5CF6' },
    { id: 'tag_7', name: 'authentication', color: '#06B6D4' },
    { id: 'tag_8', name: 'deployment', color: '#10B981' },
    { id: 'tag_9', name: 'testing', color: '#F59E0B' },
    { id: 'tag_10', name: 'performance', color: '#EF4444' },
    { id: 'tag_11', name: 'security', color: '#8B5CF6' },
    { id: 'tag_12', name: 'best-practices', color: '#06B6D4' },
  ]
  
  const [formData, setFormData] = useState({
    topicName: '',
    title: '',
    category: '',
    content: '',
    description: '',
    featured: false,
    allowRating: true,
  })

  const topicCategories = [
    { id: 'cat_1', name: 'Questions', color: '#3B82F6' },
    { id: 'cat_2', name: 'Built with fastn', color: '#8B5CF6' },
    { id: 'cat_3', name: 'Feature Request', color: '#10B981' },
    { id: 'cat_4', name: 'Feedback', color: '#F59E0B' }
  ]

  const categoryTemplates = {
    'Questions': `<!-- Thank you for opening a feature request. If this is for a node, please add the node subcategory. Otherwise, follow the below template. -->

**The idea is:**

<!-- Describe the idea in detail -->

**My use case:**

<!-- Share use cases to help us understand better. -->

**I think it would be beneficial to add this because:**

<!-- What problem will this new feature solve? -->

**Any resources to support this?**

<!-- Link to external documentation, etc. -->

**Are you willing to work on this?**

<!-- Don't forget to upvote this request. The more votes this Feature Request gets, the higher the priority. -->`,
    
    'Built with fastn': `<!-- Thank you for sharing your fastn project! Please provide details about your implementation. -->

**Project Overview:**

<!-- Brief description of what you built -->

**Key Features:**

<!-- List the main features of your project -->

**Technical Implementation:**

<!-- Share technical details, architecture, or interesting challenges -->

**Live Demo:**

<!-- Link to your live project or screenshots -->

**Code Repository:**

<!-- Link to your GitHub repo or code -->

**Lessons Learned:**

<!-- What did you learn while building this? -->

**Challenges Overcome:**

<!-- What challenges did you face and how did you solve them? -->`,
    
    'Feature Request': `<!-- Thank you for opening a feature request. If this is for a node, please add the node subcategory. Otherwise, follow the below template. -->

**The idea is:**

<!-- Describe the idea in detail -->

**My use case:**

<!-- Share use cases to help us understand better. -->

**I think it would be beneficial to add this because:**

<!-- What problem will this new feature solve? -->

**Any resources to support this?**

<!-- Link to external documentation, etc. -->

**Are you willing to work on this?**

<!-- Don't forget to upvote this request. The more votes this Feature Request gets, the higher the priority. -->`,
    
    'Feedback': `<!-- Thank you for providing feedback! Your input helps us improve fastn. -->

**Type of Feedback:**

<!-- Bug report, suggestion, general feedback, etc. -->

**Description:**

<!-- Describe your feedback in detail -->

**Impact:**

<!-- How does this affect your experience with fastn? -->

**Suggestions:**

<!-- Any suggestions for improvement? -->

**Additional Context:**

<!-- Any other relevant information -->`
  }
  
  const categoryIdMapping: { [key: string]: string } = {
    Questions: 'id_1754163675_740242',
    'Built with fastn': 'id_1754163675_740242',
    'Feature Request': 'id_1754163675_740242',
    Feedback: 'id_1754163675_740242',
  }

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        topicName: '',
        title: '',
        category: '',
        content: '',
        description: '',
        featured: false,
        allowRating: true,
      })
      setSelectedTags([])
      setTagSearchQuery('')
      setCategorySearchQuery('')
      setTemplateApplied(false)
      setError(null)
      setIsMinimized(false)
    }
  }, [isOpen])

  // Handle escape key only
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    const handleGlobalClick = (e: MouseEvent) => {
      // Only prevent clicks outside the modal
      const target = e.target as Element
      const modal = modalRef.current
      if (modal && !modal.contains(target)) {
        e.stopPropagation()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('click', handleGlobalClick, true) // Use capture phase
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleGlobalClick, true)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const toggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter(tag => tag !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  // Filter tags based on search query
  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  )

  // Filter categories based on search query
  const filteredCategories = topicCategories.filter(category => 
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  )

  const applyTemplate = (category: string) => {
    const template = categoryTemplates[category as keyof typeof categoryTemplates]
    if (template) {
      // Keep template as plain text for textarea
      setFormData(prev => ({ ...prev, content: template }))
      setTemplateApplied(true)
    }
  }

  const removeTemplate = () => {
    setFormData(prev => ({ ...prev, content: '' }))
    setTemplateApplied(false)
  }

  const resetTemplate = () => {
    setFormData(prev => ({ ...prev, content: '' }))
    setTemplateApplied(false)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user?.id) {
        setError('You must be logged in to create a topic. Please log in and try again.')
        return
      }

      const topicData = {
        title: formData.topicName || formData.title,
        description: formData.description,
        content: formData.content,
        author_id: user.id,
        author_username: user.username || user.email?.split('@')[0] || 'user',
        category_id: categoryIdMapping[formData.category] || 'id_1754163675_740242',
        is_featured: formData.featured,
        is_hot: false,
        is_new: true,
        view_count: 0,
        reply_count: 0,
        like_count: 0,
        bookmark_count: 0,
        share_count: 0,
        tags: selectedTags,
      }

      const createdTopic = await createTopic(topicData)
      console.log('Topic created successfully:', createdTopic)
      
      // Close modal and navigate to community
      onClose()
      navigate('/')
    } catch (error) {
      console.error('Error creating topic:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to create topic. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const containerClasses = position === 'top' 
    ? "fixed top-10 left-0 right-0 bottom-0 z-50 flex items-start justify-center pt-4"
    : "fixed top-0 left-0 right-0 bottom-0 z-50 flex items-end justify-center p-4"
  
  const backdropClasses = position === 'top'
    ? "fixed top-20 left-0 right-0 bottom-0 bg-black/50 transition-opacity"
    : "fixed  bg-black/50 transition-opacity"
  
  const animationClass = position === 'top' ? 'animate-slide-down' : 'animate-slide-up'

  return (
    <AuthGuard requireAuth={true}>
    <div className={containerClasses}>
      {/* Backdrop */}
      <div className={backdropClasses} />
      
      {/* Modal */}
      <div
        ref={modalRef}
        className={`relative bg-background shadow-2xl transform transition-all duration-300 ease-out ${animationClass} border border-border/50 backdrop-blur-sm ${
          isMinimized
            ? 'w-full max-w-md max-h-[120px] rounded-xl'
            : isFullscreen
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'w-full max-w-2xl max-h-[70vh] rounded-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 border-b border-border/50"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-foreground">Create a new Topic</h2>
          <div className="flex items-center gap-2 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                console.log('Fullscreen button clicked, current state:', isFullscreen)
                setIsFullscreen(!isFullscreen)
              }}
              className="h-8 w-8 p-0 hover:bg-muted/50 relative z-20"
              disabled={isMinimized}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                console.log('Minimize button clicked, current state:', isMinimized)
                setIsMinimized(!isMinimized)
              }}
              className="h-8 w-8 p-0 hover:bg-muted/50 relative z-20"
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div 
            className={`p-4 overflow-y-auto ${
              isFullscreen 
                ? 'h-[calc(100vh-80px)]' 
                : 'max-h-[calc(60vh-80px)]'
            }`}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
          <form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Error Display */}
            {error && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Topic Name */}
            <div className="space-y-1">
              <Label htmlFor="topicName" className="text-sm font-medium text-muted-foreground">Topic Name</Label>
              <Input
                id="topicName"
                placeholder="Enter topic name..."
                value={formData.topicName}
                onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                className="h-9 text-base border-primary/50 focus:border-primary"
              />
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Input
                id="title"
                placeholder="What is this discussion about in one brief sentence?"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="h-9 text-base border-primary/50 focus:border-primary"
              />
            </div>

            {/* Category and Tags Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="relative">
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value }))
                  setCategorySearchQuery('')
                  resetTemplate()
                  applyTemplate(value)
                }}
              >
                    <SelectTrigger className="h-9 border-primary/50 focus:border-primary">
                      <SelectValue placeholder="category..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {/* Search Input */}
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="Search categories..."
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            className="pl-8 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      {/* Category Options */}
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredCategories.length > 0 ? (
                          filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                ></div>
                                {category.name}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No categories found
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !selectedTags.includes(value)) {
                        setSelectedTags([...selectedTags, value])
                        setTagSearchQuery('')
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 border-primary/50 focus:border-primary">
                      <SelectValue placeholder="optional tags" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {/* Search Input */}
                      <div className="p-2 border-b border-border">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            placeholder="Search tags..."
                            value={tagSearchQuery}
                            onChange={(e) => setTagSearchQuery(e.target.value)}
                            className="pl-8 h-8 text-sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      {/* Tag Options */}
                      <div className="max-h-[200px] overflow-y-auto">
                        {filteredTags.length > 0 ? (
                          filteredTags.map((tag) => (
                            <SelectItem 
                              key={tag.id} 
                              value={tag.name}
                              disabled={selectedTags.includes(tag.name)}
                            >
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: tag.color }}
                                ></div>
                                {tag.name}
                                {selectedTags.includes(tag.name) && (
                                  <span className="text-xs text-muted-foreground ml-auto">✓</span>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            No tags found
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Selected Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map((tagName) => {
                    const tag = availableTags.find(t => t.name === tagName)
                    return (
                      <Badge
                        key={tagName}
                        variant="secondary"
                        className="cursor-pointer text-xs px-2 py-1 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setSelectedTags(selectedTags.filter(t => t !== tagName))}
                        style={tag?.color ? { backgroundColor: tag.color + '20', color: tag.color } : undefined}
                      >
                        {tagName} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="font-medium">Tip:</span> Insert your workflow by clicking '<code className="bg-muted px-1 py-0.5 rounded text-xs">&lt;/&gt;</code>' and pasting in the workflow's code
            </div>


            {/* Content Editor */}
            <div className="space-y-1">
              <Label htmlFor="content" className="text-sm font-medium text-muted-foreground">Content</Label>
              <Textarea
                id="content"
                placeholder={formData.category ? "Start typing your content..." : "Select a category before typing here..."}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[300px] resize-none"
                disabled={!formData.category}
              />
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.topicName || !formData.category || !formData.content}
                className="flex-1 h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                {isSubmitting ? 'Creating Topic...' : '+ Create Topic'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-9 px-6 border-border/50 hover:bg-muted/50"
              >
                Close
              </Button>
            </div>
          </form>
          </div>
        )}
      </div>

    </div>
    </AuthGuard>
  )
}

export default CreateTopicModal
