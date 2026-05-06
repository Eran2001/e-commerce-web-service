import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingFilterProps {
  value: number
  onChange: (value: number) => void
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
  const ratings = [4, 3, 2, 1]

  return (
    <div className="space-y-2">
      {ratings.map((rating) => (
        <button
          key={rating}
          onClick={() => onChange(value === rating ? 0 : rating)}
          className={cn(
            'flex items-center gap-2 w-full py-1 text-left transition-colors',
            value === rating ? 'text-gold' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < rating ? 'text-gold fill-gold' : 'text-muted-foreground/30'
                )}
              />
            ))}
          </div>
          <span className="text-sm">& Up</span>
        </button>
      ))}
    </div>
  )
}
