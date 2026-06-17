import { useState, useEffect } from 'react'

export function UserAvatar({ src, displayName, className = "w-8 h-8", style }) {
  const [error, setError] = useState(false)

  // Reset error state when src changes
  useEffect(() => {
    setError(false)
  }, [src])

  const defaultIcon = (
    <div 
      className={`${className} rounded-full flex items-center justify-center bg-[#F1EEF4] text-[#A098AE] border border-[#E8E4EE] flex-shrink-0 select-none`}
      style={style}
    >
      <svg 
        className="w-[55%] h-[55%] opacity-85" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  )

  if (!src || error) {
    return defaultIcon
  }

  return (
    <img
      src={src}
      alt={displayName || 'Usuario'}
      className={`${className} rounded-full object-cover flex-shrink-0`}
      style={style}
      onError={() => setError(true)}
    />
  )
}
