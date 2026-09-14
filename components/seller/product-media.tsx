'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { SectionHeading } from '@/components/ui/section-heading'
import { IconCloudUpload, IconPhoto, IconPhotoPlus, IconStar, IconTrash } from '@tabler/icons-react'

export interface MediaItem {
  id: string
  url: string
  file?: File
}

interface ProductMediaProps {
  initialImages?: string[]
  onChange?: (items: MediaItem[]) => void
}

export function ProductMedia({ initialImages, onChange }: ProductMediaProps) {
  const t = useTranslations('seller')
  const [items, setItems] = useState<MediaItem[]>(
    () => initialImages?.map((url) => ({ id: url, url })) ?? []
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      items.forEach((item) => {
        if (item.file) URL.revokeObjectURL(item.url)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function emit(next: MediaItem[]) {
    setItems(next)
    onChange?.(next)
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    const newItems: MediaItem[] = files.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
    }))
    emit([...items, ...newItems])
    e.target.value = ''
  }

  function handleRemove(id: string) {
    const target = items.find((item) => item.id === id)
    if (target?.file) URL.revokeObjectURL(target.url)
    emit(items.filter((item) => item.id !== id))
  }

  function handleMakePrimary(id: string) {
    const idx = items.findIndex((item) => item.id === id)
    if (idx <= 0) return
    const next = [...items]
    const [target] = next.splice(idx, 1)
    next.unshift(target)
    emit(next)
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 border border-outline-variant/20">
      <SectionHeading icon={IconPhoto} label={t('products.media.heading')} />

      <div className="w-full aspect-video rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface flex flex-col items-center justify-center p-6 text-center hover:bg-surface-container-low hover:border-primary/50 transition-all cursor-pointer mb-4 group relative overflow-hidden">
        <input
          ref={fileInputRef}
          accept="image/*"
          type="file"
          multiple
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <IconCloudUpload className="text-primary text-[24px]" />
        </div>
        <p className="text-sm font-semibold text-on-surface mb-1">{t('products.media.dropzoneLabel')}</p>
        <p className="text-xs text-on-surface-variant">{t('products.media.dropzoneSub')}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="aspect-square rounded-lg bg-surface border border-outline-variant/20 relative overflow-hidden group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleMakePrimary(item.id)}
                  title={t('products.media.makePrimary')}
                  className="p-1.5 bg-surface text-tertiary rounded shadow hover:scale-105 transition-transform"
                >
                  <IconStar className="text-[16px]" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                title={t('products.media.remove')}
                className="p-1.5 bg-surface text-error rounded shadow hover:scale-105 transition-transform"
              >
                <IconTrash className="text-[16px]" />
              </button>
            </div>
            {idx === 0 && (
              <div className="absolute bottom-1 left-1 bg-primary text-on-primary text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
                {t('products.media.primary')}
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square rounded-lg bg-surface border border-dashed border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-low hover:border-primary/50 transition-colors"
        >
          <IconPhotoPlus className="text-outline-variant text-[24px]" />
        </button>
      </div>
    </div>
  )
}
