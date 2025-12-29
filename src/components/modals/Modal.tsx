'use client'
import React from 'react'

type ModalProps = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative z-10 bg-stone-800
          border border-sky-300 rounded-md
          w-[92vw] max-w-[360px] md:max-w-[520px] lg:max-w-[640px]
          max-h-[85vh] overflow-y-auto
          p-6 md:p-7 lg:p-8 shadow-lg
        "
      >
        {children}
      </div>
    </div>
  )
}