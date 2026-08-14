'use client'

import { useState } from 'react'

interface ProductImageGalleryProps {
  imageUrl: string | null
  productName: string
}

const THUMBS = [0, 1, 2]

export function ProductImageGallery({ imageUrl, productName }: ProductImageGalleryProps) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col">
      {/* Main image */}
      <div className="w-full aspect-[4/3] bg-surface-container flex items-center justify-center relative overflow-hidden group">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={productName}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-on-surface/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span
                className="material-symbols-outlined text-on-surface/50 bg-surface/80 p-3 rounded-full backdrop-blur-sm shadow-md"
                style={{ fontSize: '32px' }}
              >
                zoom_in
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            <span
              className="material-symbols-outlined text-on-surface-variant/20"
              style={{ fontSize: '80px' }}
            >
              image
            </span>
            <span className="text-xs text-on-surface-variant/40">Görsel yok</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="p-4 flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {THUMBS.map((idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`flex-shrink-0 w-20 aspect-square rounded-lg bg-surface-container overflow-hidden border-2 transition-colors focus:outline-none ${
              selected === idx
                ? 'border-primary'
                : 'border-transparent hover:border-outline-variant'
            }`}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={`${productName} görsel ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-on-surface-variant/30"
                  style={{ fontSize: '24px' }}
                >
                  image
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
