'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, X, Upload, Camera, Sparkles, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/haptic'

interface StepImageProps {
  data: {
    images: Array<{ file: File; preview: string }>
  }
  onChange: (data: { images: Array<{ file: File; preview: string }> }) => void
  onNext: () => void
  onBack: () => void
}

export default function StepImage({ data, onChange, onNext, onBack }: StepImageProps) {
  const [isUploading, setIsUploading] = useState(false)

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      data.images.forEach(img => {
        if (img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview)
        }
      })
    }
  }, [])

  const handleImageSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const invalidFiles = files.filter(f => !validTypes.includes(f.type))
    if (invalidFiles.length > 0) {
      alert('Endast JPG, PNG, WebP och GIF är tillåtna')
      return
    }

    // Validate file sizes (max 10MB each)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = files.filter(f => f.size > maxSize)
    if (oversizedFiles.length > 0) {
      alert('Max 10MB per bild')
      return
    }

    // Limit total images
    if (data.images.length + files.length > 5) {
      alert('Max 5 bilder tillåtet')
      return
    }

    setIsUploading(true)
    haptic.medium()

    const newImages = await Promise.all(
      files.map(async (file) => {
        return new Promise<{ file: File; preview: string }>((resolve, reject) => {
          // Use URL.createObjectURL instead of base64 for memory efficiency
          const preview = URL.createObjectURL(file)
          resolve({ file, preview })
        })
      })
    )

    onChange({ images: [...data.images, ...newImages] })
    haptic.success()
    setIsUploading(false)
  }, [data.images, onChange])

  const handleRemoveImage = useCallback((index: number) => {
    haptic.light()
    const updated = data.images.filter((_, i) => i !== index)
    onChange({ images: updated })
  }, [data.images, onChange])

  const handleContinue = useCallback(() => {
    haptic.success()
    onNext()
  }, [onNext])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-xl font-semibold text-white mb-2"
        >
          Har du bilder på projektet?
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-sm"
        >
          Ladda upp bilder så kan vi ge en bättre bedömning (valfritt)
        </motion.p>
      </div>

      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
          id="image-upload-step"
          disabled={isUploading}
        />
        
        <label
          htmlFor="image-upload-step"
          className={cn(
            'flex flex-col items-center justify-center p-8 rounded-xl',
            'border-2 border-dashed transition-all duration-200 cursor-pointer',
            'hover:border-brand/50 hover:bg-brand/5',
            isUploading ? 'opacity-50 cursor-wait' : 'border-white/20 bg-white/5'
          )}
        >
          <div className="w-14 h-14 rounded-full bg-brand/20 flex items-center justify-center mb-4">
            {isUploading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Upload className="w-6 h-6 text-brand" />
              </motion.div>
            ) : (
              <ImageIcon className="w-6 h-6 text-brand" />
            )}
          </div>
          
          <p className="text-white font-medium text-sm mb-1">
            {isUploading ? 'Laddar upp...' : 'Klicka för att ladda upp bilder'}
          </p>
          <p className="text-white/40 text-xs">
            PNG, JPG upp till 10MB
          </p>
          
          <div className="flex items-center gap-4 mt-4 text-white/30">
            <div className="flex items-center gap-1.5 text-xs">
              <Camera className="w-4 h-4" />
              <span>Kamera</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Upload className="w-4 h-4" />
              <span>Galleri</span>
            </div>
          </div>
        </label>
      </div>

      {/* Image Previews */}
      <AnimatePresence>
        {data.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-3"
          >
            <p className="text-sm text-white/60 ml-1">
              Uppladdade bilder ({data.images.length})
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              {data.images.map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img
                    src={img.preview}
                    alt={`Bild ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-brand text-white text-xs font-medium">
                      Huvudbild
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Add More Button */}
              {data.images.length < 5 && (
                <label className="aspect-square rounded-lg border border-white/10 bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Plus className="w-6 h-6 text-white/40" />
                </label>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Option */}
      <button
        type="button"
        onClick={handleContinue}
        className="w-full text-center text-sm text-white/40 hover:text-white/60 transition-colors"
      >
        Hoppa över detta steg
      </button>

      {/* Info box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-brand/10 border border-brand/20 rounded-xl p-4 flex items-start gap-3"
      >
        <Sparkles className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
        <div className="text-xs text-white/70">
          <p className="font-medium text-white mb-1">AI-analys</p>
          <p>Vi använder AI för att analysera dina bilder och ge dig en mer exakt kostnadsuppskattning.</p>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className={cn(
            'flex-1 py-3 rounded-xl text-white/70 hover:text-white',
            'border border-white/10 hover:border-white/20',
            'transition-all duration-200'
          )}
        >
          Tillbaka
        </button>
        <motion.button
          type="button"
          onClick={handleContinue}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 rounded-xl font-medium bg-brand text-white hover:bg-brand-light transition-all duration-200"
        >
          {data.images.length > 0 ? `Fortsätt (${data.images.length} bild${data.images.length > 1 ? 'er' : ''})` : 'Fortsätt'}
        </motion.button>
      </div>
    </motion.div>
  )
}