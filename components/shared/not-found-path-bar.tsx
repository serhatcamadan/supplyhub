'use client'

import { useState, useEffect } from 'react'
import { IconCheck, IconCopy, IconLink } from '@tabler/icons-react'

interface NotFoundPathBarProps {
  label: string
  copyLabel: string
  copiedLabel: string
}

export function NotFoundPathBar({ label, copyLabel, copiedLabel }: NotFoundPathBarProps) {
  const [path, setPath] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // window.location is only available client-side, so this can't run during SSR/first render
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPath(window.location.pathname)
  }, [])

  if (!path) return null

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard access denied — not critical, silently ignore
    }
  }

  return (
    <div className="w-full max-w-lg flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-surface-container-low text-on-surface-variant">
      <div className="flex items-center gap-2 min-w-0">
        <IconLink size={16} className="text-primary shrink-0" />
        <span className="text-xs font-mono truncate">
          {label}: {path}
        </span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
      >
        {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        {copied ? copiedLabel : copyLabel}
      </button>
    </div>
  )
}
