import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, X, Download, Calendar, Tag } from 'lucide-react'
import { DogPhoto } from '@/types/photo'

interface PhotoDetailModalProps {
  photo: DogPhoto | null
  isOpen: boolean
  onClose: () => void
  onToggleFavorite: (id: string) => void
}

export function PhotoDetailModal({ photo, isOpen, onClose, onToggleFavorite }: PhotoDetailModalProps) {
  if (!photo) return null

  const getCategoryColor = (category: DogPhoto['category']) => {
    switch (category) {
      case 'puppy':
        return 'bg-pink-100 text-pink-800'
      case 'adult':
        return 'bg-blue-100 text-blue-800'
      case 'action':
        return 'bg-green-100 text-green-800'
      case 'portrait':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = photo.imageUrl
    link.download = `${photo.title}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Image */}
          <div className="relative bg-black">
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full max-h-[60vh] object-contain"
            />
          </div>

          {/* Photo details */}
          <div className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">{photo.title}</h2>
                {photo.description && (
                  <p className="text-gray-600 leading-relaxed">{photo.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant={photo.isFavorite ? "default" : "outline"}
                  size="sm"
                  className={photo.isFavorite ? 'bg-red-500 hover:bg-red-600' : ''}
                  onClick={() => onToggleFavorite(photo.id)}
                >
                  <Heart className={`mr-2 h-4 w-4 ${photo.isFavorite ? 'fill-current' : ''}`} />
                  {photo.isFavorite ? 'Favorited' : 'Add to Favorites'}
                </Button>

                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Tag className="h-4 w-4" />
                <span>Category:</span>
                <Badge className={getCategoryColor(photo.category)}>
                  {photo.category.charAt(0).toUpperCase() + photo.category.slice(1)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Uploaded:</span>
                <span>{formatDate(photo.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}