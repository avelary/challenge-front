import React, { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src: string | null
  alt: string
  width?: number
  height?: number
  className?: string
}

export function ProductImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)

  if (!src || imageError) {
    return (
      <div
        className={`bg-gray-700 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-xs text-gray-400">Sem imagem</p>
        </div>
      </div>
    )
  }

  // Se é data URL (base64), usar tag img normal
  if (src.startsWith('data:')) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'cover' }}
        onError={() => setImageError(true)}
      />
    )
  }

  // Se é URL normal, usar Next.js Image com otimização
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
  const imageUrl = src.startsWith('http') ? src : `${apiUrl}${src}`

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: 'cover' }}
      onError={() => setImageError(true)}
    />
  )
}
