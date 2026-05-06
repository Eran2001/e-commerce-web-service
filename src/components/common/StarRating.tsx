import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'sm',
  showValue = false,
  reviewCount,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const fillPercentage = Math.min(100, Math.max(0, (rating - index) * 100))
          
          return (
            <div key={index} className="relative">
              <Star className={cn(sizeClasses[size], 'text-muted-foreground/30')} />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star className={cn(sizeClasses[size], 'text-gold fill-gold')} />
              </div>
            </div>
          )
        })}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground ml-1">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  )
}
