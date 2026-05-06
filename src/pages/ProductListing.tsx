import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { products } from '@/data/products'
import { Product } from '@/types'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { cn, delay } from '@/lib/utils'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
]

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category')
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)

  // Sync category from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    setSelectedCategory(categoryFromUrl)
  }, [searchParams])

  // Simulate loading
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true)
      await delay(600)
      setIsLoading(false)
    }
    loadProducts()
  }, [selectedCategory, priceRange, selectedBrands, minRating, inStockOnly, sortBy])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, priceRange, selectedBrands, minRating, inStockOnly, sortBy])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products]

    // Category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Brand filter
    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand))
    }

    // Rating filter
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating)
    }

    // Stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0)
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => parseInt(b.id.replace('prod_', '')) - parseInt(a.id.replace('prod_', '')))
        break
    }

    return result
  }, [selectedCategory, priceRange, selectedBrands, minRating, inStockOnly, sortBy])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category)
    if (category) {
      setSearchParams({ category })
    } else {
      setSearchParams({})
    }
  }

  const handleClearAll = () => {
    setSelectedCategory(null)
    setPriceRange([0, 500])
    setSelectedBrands([])
    setMinRating(0)
    setInStockOnly(false)
    setSearchParams({})
  }

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-2">
            {selectedCategory || 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} products
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              inStockOnly={inStockOnly}
              onInStockChange={setInStockOnly}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
              {/* Mobile filter button */}
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm text-foreground hover:border-gold transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>

              {/* Sort dropdown */}
              <div className="relative ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-card border border-border rounded-md px-4 py-2 pr-10 text-sm text-foreground focus:outline-none focus:border-gold cursor-pointer"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid products={paginatedProducts} isLoading={isLoading} />

            {/* Pagination */}
            {totalPages > 1 && !isLoading && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        'w-10 h-10 rounded-md text-sm transition-colors',
                        currentPage === page
                          ? 'bg-gold text-charcoal'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-border rounded-md text-sm text-foreground hover:border-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute top-0 right-0 bottom-0 w-[300px] bg-background overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-medium text-foreground">Filters</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                selectedBrands={selectedBrands}
                onBrandsChange={setSelectedBrands}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                inStockOnly={inStockOnly}
                onInStockChange={setInStockOnly}
                onClearAll={handleClearAll}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
