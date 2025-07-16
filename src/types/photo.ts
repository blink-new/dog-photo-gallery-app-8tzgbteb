export interface DogPhoto {
  id: string
  userId: string
  title: string
  description?: string
  imageUrl: string
  category: 'puppy' | 'adult' | 'action' | 'portrait' | 'uncategorized'
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface PhotoUpload {
  file: File
  title: string
  description?: string
  category: DogPhoto['category']
}