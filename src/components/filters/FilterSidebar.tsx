import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PriceRangeSlider } from './PriceRangeSlider'
import { RatingFilter } from './RatingFilter'
import { categories } from '@/data/categories'

interface FilterSidebarProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  priceRange: [number, number]
  onPriceRangeChange: (range: [number, number]) => void
  selectedBrands: string[]
  onBrandsChange: (brands: string[]) => void
  minRating: number
  onMinRatingChange: (rating: number) => void
  inStockOnly: boolean
  onInStockChange: (value: boolean) => void
  onClearAll: () => void
}

const brands = [
  'TechPro', 'SoundMax', 'Luxe Wear', 'Urban Edge', 'HomeCraft',
  'AthleteX', 'Glow Essentials', 'Penguin Classics'
]

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-medium text-foreground uppercase tracking-wide">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 mt-4' : 'max-h-0'
        )}
      >
        {children}
      </div>
    </div>
  )
}

export function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onBrandsChange,
  minRating,
  onMinRatingChange,
  inStockOnly,
  onInStockChange,
  onClearAll,
}: FilterSidebarProps) {
  const hasFilters =
    selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < 500 ||
    selectedBrands.length > 0 ||
    minRating > 0 ||
    inStockOnly

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand))
    } else {
      onBrandsChange([...selectedBrands, brand])
    }
  }

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      <div className="sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground">Filters</h3>
          {hasFilters && (
            <button
              onClick={onClearAll}
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Categories */}
        <FilterSection title="Category">
          <div className="space-y-2">
            <button
              onClick={() => onCategoryChange(null)}
              className={cn(
                'block w-full text-left py-1.5 text-sm transition-colors',
                !selectedCategory ? 'text-gold' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              All Categories
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.name)}
                className={cn(
                  'block w-full text-left py-1.5 text-sm transition-colors',
                  selectedCategory === category.name
                    ? 'text-gold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {category.name}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <PriceRangeSlider
            value={priceRange}
            onChange={onPriceRangeChange}
            min={0}
            max={500}
          />
        </FilterSection>

        {/* Brands */}
        <FilterSection title="Brand" defaultOpen={false}>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 rounded border-border text-gold focus:ring-gold bg-card"
                />
                <span className="text-sm text-muted-foreground">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Rating */}
        <FilterSection title="Rating" defaultOpen={false}>
          <RatingFilter value={minRating} onChange={onMinRatingChange} />
        </FilterSection>

        {/* Availability */}
        <FilterSection title="Availability" defaultOpen={false}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onInStockChange(e.target.checked)}
              className="w-4 h-4 rounded border-border text-gold focus:ring-gold bg-card"
            />
            <span className="text-sm text-muted-foreground">In Stock Only</span>
          </label>
        </FilterSection>
      </div>
    </aside>
  )
}
