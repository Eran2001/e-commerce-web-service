import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import { ProductCard } from '@/components/product/ProductCard'
import { SkeletonProductGrid } from '@/components/common/SkeletonCard'
import { delay } from '@/lib/utils'

export function TrendingProducts() {
  const [isLoading, setIsLoading] = useState(true)
  const [trendingProducts, setTrendingProducts] = useState(products.slice(0, 8))

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      await delay(800) // Simulate loading
      // Get top rated products
      const sorted = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8)
      setTrendingProducts(sorted)
      setIsLoading(false)
    }
    fetchProducts()
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-card/50">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-gold text-sm font-medium uppercase tracking-[0.2em] mb-3">
              Curated Selection
            </p>
            <h2 className="font-display text-foreground">Trending Now</h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <SkeletonProductGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
