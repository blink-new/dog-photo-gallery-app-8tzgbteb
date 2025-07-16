import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Eye, MoreVertical, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DogPhoto } from '@/types/photo'

interface PhotoCardProps {
  photo: DogPhoto
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
  onView: (photo: DogPhoto) => void
}

export function PhotoCard({ photo, onToggleFavorite, onDelete, onView }: PhotoCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const getCategoryColor = (category: DogPhoto['category']) => {
    switch (category) {
      case 'puppy':
        return 'bg-pink-100 text-pink-800 hover:bg-pink-200'
      case 'adult':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'action':
        return 'bg-green-100 text-green-800 hover:bg-green-200'
      case 'portrait':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
        
        {imageError ? (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <p className="text-sm">Image unavailable</p>
            </div>
          </div>
        ) : (
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 cursor-pointer ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            onClick={() => onView(photo)}
          />
        )}

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant={photo.isFavorite ? "default" : "secondary"}
              className={`h-8 w-8 p-0 ${
                photo.isFavorite 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-700'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onToggleFavorite(photo.id)
              }}
            >
              <Heart className={`h-4 w-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(photo)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(photo.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* View button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 hover:bg-white text-gray-700"
              onClick={() => onView(photo)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm line-clamp-2 flex-1">{photo.title}</h3>
            {photo.isFavorite && (
              <Heart className="h-4 w-4 text-red-500 fill-current flex-shrink-0" />
            )}
          </div>

          {photo.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{photo.description}</p>
          )}

          <div className="flex items-center justify-between">
            <Badge 
              variant="secondary" 
              className={`text-xs ${getCategoryColor(photo.category)}`}
            >
              {photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500">{formatDate(photo.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}