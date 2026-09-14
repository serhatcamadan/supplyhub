'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { IconPhoto, IconZoomIn } from '@tabler/icons-react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const t = useTranslations('buyer')
  const [selected, setSelected] = useState(0)
  const mainImage = images[selected] ?? null

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Main image */}
      <div className="w-full aspect-[4/3] bg-surface-container flex items-center justify-center relative overflow-hidden group">
        {mainImage ? (
          <>
            <img
              src={mainImage}
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <IconZoomIn size={32} className="text-on-surface/50 bg-surface/80 p-3 rounded-full backdrop-blur-sm shadow-md" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <IconPhoto size={80} className="text-on-surface-variant/20" />
            <span className="text-xs text-on-surface-variant/40">{t('discover.gallery.noImage')}</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="p-4 flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {images.map((url, idx) => (
            <button
              key={url}
              onClick={() => setSelected(idx)}
              className={`flex-shrink-0 w-20 aspect-square rounded-lg bg-surface-container overflow-hidden border-2 transition-colors focus:outline-none ${
                selected === idx
                  ? 'border-primary'
                  : 'border-transparent hover:border-outline-variant'
              }`}
            >
              <img
                src={url}
                alt={`${productName} görsel ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
