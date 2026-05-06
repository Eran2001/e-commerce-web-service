import { formatCurrency } from '@/lib/utils'

interface PriceRangeSliderProps {
  value: [number, number]
  onChange: (value: [number, number]) => void
  min: number
  max: number
}

export function PriceRangeSlider({ value, onChange, min, max }: PriceRangeSliderProps) {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Math.min(Number(e.target.value), value[1] - 10)
    onChange([newMin, value[1]])
  }

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Math.max(Number(e.target.value), value[0] + 10)
    onChange([value[0], newMax])
  }

  const minPercent = ((value[0] - min) / (max - min)) * 100
  const maxPercent = ((value[1] - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="relative h-2">
        {/* Track background */}
        <div className="absolute inset-0 rounded-full bg-muted" />
        
        {/* Active track */}
        <div
          className="absolute h-full rounded-full bg-gold"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMinChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          style={{ pointerEvents: 'auto' }}
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMaxChange}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
          style={{ pointerEvents: 'auto' }}
        />

        {/* Thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold border-2 border-background shadow-md pointer-events-none"
          style={{ left: `calc(${minPercent}% - 8px)` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold border-2 border-background shadow-md pointer-events-none"
          style={{ left: `calc(${maxPercent}% - 8px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{formatCurrency(value[0])}</span>
        <span className="text-muted-foreground">{formatCurrency(value[1])}</span>
      </div>
    </div>
  )
}
