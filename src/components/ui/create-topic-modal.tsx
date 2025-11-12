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
import { useApi, type Category } from '@/services/api'
import { useAuth } from 'react-oidc-context'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { useToast } from '@/hooks/use-toast'

interface CreateTopicModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  position?: 'top' | 'bottom'
}

const CreateTopicModal = ({ isOpen, onClose, onSuccess, position = 'bottom' }: CreateTopicModalProps) => {
  const navigate = useNavigate()
  const { createTopic, getAllCategories, getAllTags } = useApi()
  const modalRef = useRef<HTMLDivElement>(null)
  const auth = useAuth()
  const { toast } = useToast()
  
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
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<{
    topicName?: string
    title?: string
    category?: string
    content?: string
    tags?: string
  }>({})
  
  // Categories state
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  
  // Tags state
  const [availableTags, setAvailableTags] = useState<any[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)

  // Tags are now fetched from API
  
  const [formData, setFormData] = useState({
    topicName: '',
    title: '',
    category: '',
    content: '',
    description: '',
    featured: false,
    allowRating: true,
  })

  // Fetch categories and tags from API
  useEffect(() => {
    const fetchData = async () => {
      try {
    
        setIsLoadingCategories(true)
        setIsLoadingTags(true)
        
        // Fetch categories and tags separately to handle partial failures
        const categoriesPromise = getAllCategories().catch(error => {
          console.error('❌ Error fetching categories:', error)
          return [] // Return empty array if categories fail
        })
        
        const tagsPromise = getAllTags().catch(error => {
          console.error('❌ Error fetching tags:', error)
          return [] // Return empty array if tags fail
        })
        
        const [fetchedCategories, fetchedTags] = await Promise.all([
          categoriesPromise,
          tagsPromise
        ])
        
        
        setCategories(fetchedCategories)
        setAvailableTags(fetchedTags)
        
        // Show specific error messages for partial failures
        if (fetchedCategories.length === 0 && fetchedTags.length === 0) {
          setError('Failed to load categories and tags. Please refresh the page and try again.')
        } else if (fetchedCategories.length === 0) {
          setError('Failed to load categories. You can still create topics without categories.')
        } else if (fetchedTags.length === 0) {
          setError('Failed to load tags. You can still create topics without tags.')
        } else {
          // Clear any previous errors if both loaded successfully
          setError(null)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again.')
      } finally {
        setIsLoadingCategories(false)
        setIsLoadingTags(false)
      }
    }

    if (isOpen) {
      fetchData()
    }
  }, [isOpen, getAllCategories, getAllTags])

  const categoryTemplates = {
    'question': `<!-- Thank you for asking a question! Please provide as much detail as possible to help us give you the best answer. -->

**What are you trying to achieve?**

<!-- Describe what you're trying to accomplish -->

**What have you tried so far?**

<!-- Share what you've already attempted -->

**Current setup:**

<!-- Describe your current environment, versions, etc. -->

**Expected behavior:**

<!-- What should happen? -->

**Actual behavior:**

<!-- What actually happens? -->

**Additional context:**

<!-- Any other details that might help -->`,
    
    'bult with fastn': `<!-- Thank you for sharing your fastn project! Please provide details about your implementation. -->

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
    
    'request feature': `<!-- Thank you for opening a feature request. If this is for a node, please add the node subcategory. Otherwise, follow the below template. -->

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
    
    'feadback': `<!-- Thank you for providing feedback! Your input helps us improve fastn. -->

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
  
  // Category ID mapping is no longer needed since we use API category IDs directly

  // Validation functions
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'topicName':
        if (!value.trim()) return 'Topic name is required'
        if (value.trim().length < 3) return 'Topic name must be at least 3 characters'
        if (value.trim().length > 100) return 'Topic name must be less than 100 characters'
        return undefined
      case 'title':
        if (!value.trim()) return 'Title is required'
        if (value.trim().length < 5) return 'Title must be at least 5 characters'
        if (value.trim().length > 200) return 'Title must be less than 200 characters'
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
        if (selectedTags.length === 0) return 'At least one tag is required'
        if (selectedTags.length > 3) return 'Maximum 3 tags allowed'
        return undefined
      default:
        return undefined
    }
  }

  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {}
    
    errors.topicName = validateField('topicName', formData.topicName)
    errors.title = validateField('title', formData.title)
    errors.category = validateField('category', formData.category)
    errors.content = validateField('content', formData.content)
    errors.tags = validateField('tags', '') // Pass empty string since we check selectedTags array
    
    setValidationErrors(errors)
    return !Object.values(errors).some(error => error !== undefined)
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
      setValidationErrors({})
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
    // Clear validation error when tags change
    if (validationErrors.tags) {
      setValidationErrors(prev => ({ ...prev, tags: undefined }))
    }
  }

  // Filter tags based on search query
  const filteredTags = availableTags.filter(tag => 
    tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
  )

  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  )

  const applyTemplate = (category: string) => {
    const template = categoryTemplates[category as keyof typeof categoryTemplates]
    if (template && category) {
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
    
    // Validate form before submission
    if (!validateForm()) {
      setError('Please fix the validation errors below')
      return
    }
    
    setIsSubmitting(true)
    setError(null)

    try {
      if (!user?.id) {
        setError('You must be logged in to create a topic. Please log in and try again.')
        return
      }

      // Check if we have at least categories or tags available
      if (categories.length === 0 && availableTags.length === 0) {
        setError('Unable to load categories and tags. Please refresh the page and try again.')
        return
      }

      // Find the first selected tag's ID (only if tags are available)
      const firstSelectedTag = availableTags.length > 0 ? availableTags.find(tag => selectedTags.includes(tag.name)) : null;
      
      // Find category ID (only if categories are available)
      const selectedCategory = categories.length > 0 ? categories.find(cat => cat.name === formData.category) : null;
      
      const topicData = {
        title: formData.topicName || formData.title,
        description: formData.description,
        content: formData.content,
        author_id: user.id,
        author_username: user.username || user.email?.split('@')[0] || 'user',
        category_id: selectedCategory?.id || null,
        tag_id: firstSelectedTag?.id || null,
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
      
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess()
      }
      
      // Inform user topic is under review
      toast({
        title: 'Topic submitted',
        description: 'Got it! Our team is reviewing your topic before it goes live',
        variant: 'success',
      })
      
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
              <Label htmlFor="topicName" className="text-sm font-medium text-muted-foreground">Topic Name *</Label>
              <Input
                id="topicName"
                placeholder="Enter topic name..."
                value={formData.topicName}
                onChange={(e) => {
                  setFormData({ ...formData, topicName: e.target.value })
                  // Clear validation error on change
                  if (validationErrors.topicName) {
                    setValidationErrors(prev => ({ ...prev, topicName: undefined }))
                  }
                }}
                onBlur={() => {
                  const error = validateField('topicName', formData.topicName)
                  setValidationErrors(prev => ({ ...prev, topicName: error }))
                }}
                className={`h-9 text-base border-border focus:border-primary ${
                  validationErrors.topicName ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {validationErrors.topicName && (
                <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.topicName}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">Title *</Label>
              <Input
                id="title"
                placeholder="What is this discussion about in one brief sentence?"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  // Clear validation error on change
                  if (validationErrors.title) {
                    setValidationErrors(prev => ({ ...prev, title: undefined }))
                  }
                }}
                onBlur={() => {
                  const error = validateField('title', formData.title)
                  setValidationErrors(prev => ({ ...prev, title: error }))
                }}
                className={`h-9 text-base border-border focus:border-primary ${
                  validationErrors.title ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {validationErrors.title && (
                <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.title}</p>
              )}
            </div>

            {/* Category and Tags Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Category *</Label>
                <div className="relative">
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  setFormData(prev => ({ ...prev, category: value }))
                  setCategorySearchQuery('')
                  resetTemplate()
                  applyTemplate(value)
                  // Clear validation error on change
                  if (validationErrors.category) {
                    setValidationErrors(prev => ({ ...prev, category: undefined }))
                  }
                }}
              >
                    <SelectTrigger className={`h-9 border-border focus:border-primary ${
                      validationErrors.category ? 'border-red-500 focus:border-red-500' : ''
                    }`}>
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
                        {isLoadingCategories ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Loading categories...
                          </div>
                        ) : filteredCategories.length > 0 ? (
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
                {validationErrors.category && (
                  <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.category}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Tags *</Label>
                <div className="relative">
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !selectedTags.includes(value)) {
                        setSelectedTags([...selectedTags, value])
                        setTagSearchQuery('')
                        // Clear validation error when tags change
                        if (validationErrors.tags) {
                          setValidationErrors(prev => ({ ...prev, tags: undefined }))
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="h-9 border-border focus:border-primary">
                      <SelectValue placeholder="select tags..." />
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
                        {isLoadingTags ? (
                          <div className="p-2 text-sm text-muted-foreground text-center">
                            Loading tags...
                          </div>
                        ) : filteredTags.length > 0 ? (
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
            <div className="space-y-2">
              {selectedTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.map((tagName) => {
                    const tag = availableTags.find(t => t.name === tagName)
                    return (
                      <Badge
                        key={tagName}
                        variant="secondary"
                        className="cursor-pointer text-xs px-2 py-1 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => {
                          setSelectedTags(selectedTags.filter(t => t !== tagName))
                          // Clear validation error when tags change
                          if (validationErrors.tags) {
                            setValidationErrors(prev => ({ ...prev, tags: undefined }))
                          }
                        }}
                        style={tag?.color ? { backgroundColor: tag.color + '20', color: tag.color } : undefined}
                      >
                        {tagName} <X className="w-3 h-3 ml-1" />
                      </Badge>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Select at least one tag</p>
              )}
              {validationErrors.tags && (
                <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.tags}</p>
              )}
            </div>

            {/* Tip */}
            <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
              <span className="font-medium">Tip:</span> Insert your workflow by clicking '<code className="bg-muted px-1 py-0.5 rounded text-xs">&lt;/&gt;</code>' and pasting in the workflow's code
            </div>


            {/* Content Editor */}
            <div className="space-y-1">
              <Label htmlFor="content" className="text-sm font-medium text-muted-foreground">Content *</Label>
              <Textarea
                id="content"
                placeholder="Start typing your content..."
                value={formData.content}
                onChange={(e) => {
                  setFormData({ ...formData, content: e.target.value })
                  // Clear validation error on change
                  if (validationErrors.content) {
                    setValidationErrors(prev => ({ ...prev, content: undefined }))
                  }
                }}
                onBlur={() => {
                  const error = validateField('content', formData.content)
                  setValidationErrors(prev => ({ ...prev, content: error }))
                }}
                className={`min-h-[150px] resize-y border-border focus:border-primary ${
                  validationErrors.content ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              {validationErrors.content && (
                <p className="text-sm text-red-600 dark:text-red-400">{validationErrors.content}</p>
              )}
            </div>


            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button
                type="submit"
                disabled={isSubmitting || !formData.topicName || !formData.content || Object.values(validationErrors).some(error => error !== undefined)}
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
