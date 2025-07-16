import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Upload, Search, Heart, Grid3X3, LayoutGrid, Camera } from 'lucide-react'
import { PhotoUploadModal } from '@/components/PhotoUploadModal'
import { PhotoCard } from '@/components/PhotoCard'
import { PhotoDetailModal } from '@/components/PhotoDetailModal'
import { DogPhoto } from '@/types/photo'
import { blink } from '@/blink/client'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [photos, setPhotos] = useState<DogPhoto[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<DogPhoto | null>(null)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Mock data for demonstration
  useEffect(() => {
    if (user) {
      // In a real app, this would fetch from the database
      const mockPhotos: DogPhoto[] = [
        {
          id: '1',
          userId: user.id,
          title: 'Golden Retriever Puppy',
          description: 'Adorable golden retriever puppy playing in the garden',
          imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=500&fit=crop',
          category: 'puppy',
          isFavorite: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          userId: user.id,
          title: 'Border Collie in Action',
          description: 'Border collie catching a frisbee at the park',
          imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=500&h=500&fit=crop',
          category: 'action',
          isFavorite: false,
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          updatedAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: '3',
          userId: user.id,
          title: 'Labrador Portrait',
          description: 'Beautiful portrait of a chocolate labrador',
          imageUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=500&fit=crop',
          category: 'portrait',
          isFavorite: true,
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          updatedAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          id: '4',
          userId: user.id,
          title: 'German Shepherd',
          description: 'Majestic German Shepherd standing in the field',
          imageUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=500&h=500&fit=crop',
          category: 'adult',
          isFavorite: false,
          createdAt: new Date(Date.now() - 345600000).toISOString(),
          updatedAt: new Date(Date.now() - 345600000).toISOString()
        }
      ]
      setPhotos(mockPhotos)
    }
  }, [user])

  // Filter photos based on search and category
  const filteredPhotos = useMemo(() => {
    let filtered = photos

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(photo =>
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'favorites') {
        filtered = filtered.filter(photo => photo.isFavorite)
      } else {
        filtered = filtered.filter(photo => photo.category === selectedCategory)
      }
    }

    // Filter by favorites only
    if (showFavoritesOnly) {
      filtered = filtered.filter(photo => photo.isFavorite)
    }

    return filtered
  }, [photos, searchQuery, selectedCategory, showFavoritesOnly])

  const handleUpload = async (photoData: Omit<DogPhoto, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    const newPhoto: DogPhoto = {
      ...photoData,
      id: Date.now().toString(),
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setPhotos(prev => [newPhoto, ...prev])
  }

  const handleToggleFavorite = (photoId: string) => {
    setPhotos(prev =>
      prev.map(photo =>
        photo.id === photoId
          ? { ...photo, isFavorite: !photo.isFavorite }
          : photo
      )
    )
  }

  const handleDeletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId))
  }

  const categories = [
    { value: 'all', label: 'All Photos', count: photos.length },
    { value: 'favorites', label: 'Favorites', count: photos.filter(p => p.isFavorite).length },
    { value: 'puppy', label: 'Puppy', count: photos.filter(p => p.category === 'puppy').length },
    { value: 'adult', label: 'Adult', count: photos.filter(p => p.category === 'adult').length },
    { value: 'action', label: 'Action', count: photos.filter(p => p.category === 'action').length },
    { value: 'portrait', label: 'Portrait', count: photos.filter(p => p.category === 'portrait').length },
    { value: 'uncategorized', label: 'Uncategorized', count: photos.filter(p => p.category === 'uncategorized').length }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your gallery...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="space-y-2">
            <Camera className="w-16 h-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Dog Photo Gallery</h1>
            <p className="text-muted-foreground">
              Organize, store, and share your favorite dog photos
            </p>
          </div>
          <Button onClick={() => blink.auth.login()} size="lg" className="w-full">
            Sign In to Get Started
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Camera className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold">Dog Photo Gallery</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? 'bg-red-50 border-red-200 text-red-700' : ''}
              >
                <Heart className={`mr-2 h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites
              </Button>

              <Button onClick={() => setShowUploadModal(true)} className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>

              <Button variant="ghost" onClick={() => blink.auth.logout()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search photos by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'masonry' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('masonry')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category.value} value={category.value} className="text-xs">
                  {category.label}
                  {category.count > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {category.count}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Photo Grid */}
        {filteredPhotos.length === 0 ? (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {photos.length === 0 ? 'No photos yet' : 'No photos found'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {photos.length === 0
                ? 'Upload your first dog photo to get started!'
                : 'Try adjusting your search or filters.'}
            </p>
            {photos.length === 0 && (
              <Button onClick={() => setShowUploadModal(true)} className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Your First Photo
              </Button>
            )}
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5'
          }`}>
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className={viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}>
                <PhotoCard
                  photo={photo}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeletePhoto}
                  onView={setSelectedPhoto}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <PhotoUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
      />

      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  )
}

export default App