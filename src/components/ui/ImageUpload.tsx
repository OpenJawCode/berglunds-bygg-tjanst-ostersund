'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, Upload, ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { haptic } from '@/lib/haptic'

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  onImageRemove: () => void
  selectedImage: { file: File; preview: string } | null
  isUploading?: boolean
  uploadProgress?: number
  maxSizeMB?: number
}

export function ImageUploadButton({
  onImageSelect,
  selectedImage,
  isUploading,
  maxSizeMB = 5
}: Pick<ImageUploadProps, 'onImageSelect' | 'selectedImage' | 'isUploading' | 'maxSizeMB'>) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [showOptions, setShowOptions] = useState(false)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      haptic.error()
      alert('Vänligen välj en bildfil (JPEG, PNG)')
      return
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024
    if (file.size > maxSize) {
      haptic.error()
      alert(`Bilden är för stor. Max ${maxSizeMB}MB.`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      onImageSelect(file, preview)
      haptic.imageUploaded()
    }
    reader.readAsDataURL(file)
    setShowOptions(false)
  }, [onImageSelect, maxSizeMB])

  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <div className="relative">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Välj bild från galleri"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Ta foto med kamera"
      />

      {/* Upload button */}
      <motion.button
        type="button"
        onClick={() => {
          haptic.light()
          if (isMobile) {
            setShowOptions(!showOptions)
          } else {
            fileInputRef.current?.click()
          }
        }}
        whileTap={{ scale: 0.95 }}
        disabled={isUploading}
        className={cn(
          'relative p-3 rounded-xl',
          'bg-white/5 border border-white/10',
          'hover:bg-white/10 hover:border-white/20',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand/30',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        aria-label="Ladda upp bild"
      >
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
            >
              <Loader2 className="w-5 h-5 text-brand animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="camera"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Camera className="w-5 h-5 text-white/70" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success indicator */}
        {selectedImage && !isUploading && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-3 h-3 bg-brand rounded-full border-2 border-[#0d1117]"
          />
        )}
      </motion.button>

      {/* Mobile options menu */}
      <AnimatePresence>
        {showOptions && isMobile && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute bottom-full left-0 mb-2 py-2 rounded-xl',
              'bg-[#1a1f2e] border border-white/10 shadow-xl',
              'min-w-[160px] z-50'
            )}
          >
            <button
              type="button"
              onClick={() => {
                haptic.light()
                cameraInputRef.current?.click()
                setShowOptions(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors text-left"
            >
              <Camera className="w-4 h-4 text-brand" />
              <span className="text-sm">Ta foto</span>
            </button>
            <button
              type="button"
              onClick={() => {
                haptic.light()
                fileInputRef.current?.click()
                setShowOptions(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors text-left"
            >
              <ImageIcon className="w-4 h-4 text-brand" />
              <span className="text-sm">Välj från galleri</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menu */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  )
}

export function ImagePreview({
  preview,
  onRemove,
  isUploading,
  uploadProgress
}: {
  preview: string
  onRemove: () => void
  isUploading?: boolean
  uploadProgress?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="relative rounded-xl overflow-hidden border border-white/10"
    >
      <img
        src={preview}
        alt="Vald bild"
        className="w-full h-32 object-cover"
      />
      
      {/* Upload progress overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
          <Loader2 className="w-6 h-6 text-brand animate-spin mb-2" />
          <span className="text-sm text-white">
            Laddar upp... {uploadProgress}%
          </span>
          <div className="w-24 h-1 bg-white/20 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-brand"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Remove button */}
      {!isUploading && (
        <button
          type="button"
          onClick={() => {
            haptic.light()
            onRemove()
          }}
          className={cn(
            'absolute top-2 right-2 p-1.5 rounded-full',
            'bg-black/50 text-white/80',
            'hover:bg-black/70 hover:text-white',
            'transition-colors'
          )}
          aria-label="Ta bort bild"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  )
}

export function ImageUpload({
  onImageSelect,
  onImageRemove,
  selectedImage,
  isUploading,
  uploadProgress,
  maxSizeMB = 5
}: ImageUploadProps) {
  return (
    <div className="space-y-3">
      {selectedImage ? (
        <ImagePreview
          preview={selectedImage.preview}
          onRemove={onImageRemove}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      ) : (
        <ImageUploadButton
          onImageSelect={onImageSelect}
          selectedImage={selectedImage}
          isUploading={isUploading}
          maxSizeMB={maxSizeMB}
        />
      )}
      <p className="text-xs text-white/40">
        Max {maxSizeMB}MB. JPEG eller PNG.
      </p>
    </div>
  )
}
