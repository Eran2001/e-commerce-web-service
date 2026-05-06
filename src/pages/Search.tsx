import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search as SearchIcon, SlidersHorizontal, X } from 'lucide-react'
import { searchProducts } from '@/data/products'
import { Product } from '@/types'
import { ProductGrid } from '@/components/product/ProductGrid'
import { FilterSidebar } from '@/components/filters/FilterSidebar'
import { delay } from '@/lib/utils'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(query)
  const [results, setResults] = useState<Product[]>([])
  const [filteredResults, setFilteredResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)

  // Search effect
  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true)
      await delay(500)
      const searchResults = query ? searchProducts(query) : []
      setResults(searchResults)
      setIsLoading(false)
    }
    performSearch()
    setSearchInput(query)
  }, [query])

  // Filter effect
  useEffect(() => {
    let filtered = [...results]

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand))
    }
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating)
    }
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0)
    }

    setFilteredResults(filtered)
  }, [results, selectedCategory, priceRange, selectedBrands, minRating, inStockOnly])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() })
    }
  }

  const handleClearAll = () => {
    setSelectedCategory(null)
    setPriceRange([0, 500])
    setSelectedBrands([])
    setMinRating(0)
    setInStockOnly(false)
  }

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products..."
                className="w-full h-14 pl-12 pr-4 bg-card border border-border rounded-lg text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
          
          {query && (
            <p className="text-muted-foreground mt-4">
              {isLoading ? (
                'Searching...'
              ) : (
                <>
                  {filteredResults.length} results for <span className="text-foreground">"{query}"</span>
                </>
              )}
            </p>
          )}
        </div>

        {query ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <FilterSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
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

            {/* Results */}
            <div className="flex-1">
              {/* Mobile filter button */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-sm text-foreground hover:border-gold transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </div>

              {!isLoading && filteredResults.length === 0 ? (
                <div className="text-center py-16">
                  <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h2 className="font-display text-xl text-foreground mb-2">No results found</h2>
                  <p className="text-muted-foreground mb-6">
                    We couldn&apos;t find any products matching "{query}"
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
                  >
                    Browse All Products
                  </Link>
                </div>
              ) : (
                <ProductGrid products={filteredResults} isLoading={isLoading} />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-xl text-foreground mb-2">Search Products</h2>
            <p className="text-muted-foreground mb-6">
              Enter a search term to find products
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Headphones', 'Sweater', 'Coffee', 'Skincare', 'Watch'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchParams({ q: term })}
                  className="px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground hover:border-gold hover:text-gold transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
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
                onCategoryChange={setSelectedCategory}
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
