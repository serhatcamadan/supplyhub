'use client'

import { useState } from 'react'

export function ProductMedia() {
  const [preview, setPreview] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-8 border border-outline-variant/20">
      <h2 className="text-sm font-semibold text-on-surface mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary text-[20px]">image</span>
        Product Media
      </h2>

      <div className="w-full aspect-video rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface flex flex-col items-center justify-center p-6 text-center hover:bg-surface-container-low hover:border-primary/50 transition-all cursor-pointer mb-4 group relative overflow-hidden">
        <input
          accept="image/*"
          multiple
          type="file"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined text-primary text-[24px]">cloud_upload</span>
        </div>
        <p className="text-sm font-semibold text-on-surface mb-1">Click or drag images to upload</p>
        <p className="text-xs text-on-surface-variant">JPG, PNG, WebP up to 5MB</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {preview && (
          <div className="aspect-square rounded-lg bg-surface border border-outline-variant/20 relative overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Product preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-on-surface/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={() => setPreview(null)} className="p-1.5 bg-surface text-error rounded shadow hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[16px]">delete</span>
              </button>
            </div>
            <div className="absolute bottom-1 left-1 bg-primary text-on-primary text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
              Primary
            </div>
          </div>
        )}
        <div className="aspect-square rounded-lg bg-surface border border-dashed border-outline-variant/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-outline-variant text-[24px]">add_photo_alternate</span>
        </div>
      </div>
    </div>
  )
}
