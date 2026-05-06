import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, ArrowRight } from 'lucide-react'
import { cn, formatCurrency } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { searchProducts } from '@/data/products'
import { Product } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      setQuery('')
      setResults([])
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true)
      // Simulate async search
      setTimeout(() => {
        setResults(searchProducts(debouncedQuery).slice(0, 6))
        setIsLoading(false)
      }, 200)
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      onClose()
    }
  }

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex flex-col items-center pt-[15vh] px-4">
        <div className="w-full max-w-2xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-offwhite/70 hover:text-offwhite transition-colors"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Search input */}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full h-14 pl-14 pr-4 bg-card border border-border rounded-lg text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </form>

          {/* Results */}
          {query.length >= 2 && (
            <div className="mt-4 bg-card border border-border rounded-lg overflow-hidden">
              {isLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-md skeleton-shimmer" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
                        <div className="h-3 w-1/4 rounded skeleton-shimmer" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="divide-y divide-border">
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <span className="text-gold font-medium">{formatCurrency(product.price)}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full flex items-center justify-center gap-2 p-4 text-gold hover:bg-muted/50 transition-colors border-t border-border"
                  >
                    View all results
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No products found for "{query}"</p>
                </div>
              )}
            </div>
          )}

          {/* Popular searches */}
          {query.length < 2 && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {['Headphones', 'Sweater', 'Coffee', 'Skincare', 'Watch'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground hover:border-gold hover:text-gold transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
