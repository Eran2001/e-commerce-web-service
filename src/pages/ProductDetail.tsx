import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, Minus, Plus, Share2, Truck, RotateCcw, Shield, ChevronRight } from 'lucide-react'
import { getProductById, getReviewsForProduct, getRelatedProducts } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn, formatCurrency, delay } from '@/lib/utils'
import { ImageGallery } from '@/components/product/ImageGallery'
import { StarRating } from '@/components/common/StarRating'
import { ProductCard } from '@/components/product/ProductCard'
import { Product, Review } from '@/types'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')

  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      await delay(500)
      
      if (id) {
        const foundProduct = getProductById(id)
        if (foundProduct) {
          setProduct(foundProduct)
          setReviews(getReviewsForProduct(id))
          setRelatedProducts(getRelatedProducts(foundProduct))
          
          // Set default variants
          const defaults: Record<string, string> = {}
          foundProduct.variants.forEach(variant => {
            defaults[variant.type] = variant.options[0]
          })
          setSelectedVariants(defaults)
        }
      }
      
      setIsLoading(false)
    }

    loadProduct()
    window.scrollTo(0, 0)
  }, [id])

  if (isLoading) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-square rounded-lg skeleton-shimmer" />
            <div className="space-y-4">
              <div className="h-8 w-1/4 rounded skeleton-shimmer" />
              <div className="h-12 w-3/4 rounded skeleton-shimmer" />
              <div className="h-6 w-1/3 rounded skeleton-shimmer" />
              <div className="h-24 rounded skeleton-shimmer" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="text-gold hover:text-gold-light transition-colors">
            Browse all products
          </Link>
        </div>
      </main>
    )
  }

  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants)
  }

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Product Info */}
          <div>
            <p className="text-gold text-sm font-medium uppercase tracking-wide mb-2">
              {product.brand}
            </p>
            <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={product.rating} size="md" showValue />
              <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-semibold text-gold">{formatCurrency(product.price)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                  <span className="px-2 py-1 bg-gold/10 text-gold text-sm font-medium rounded">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Variants */}
            {product.variants.map(variant => (
              <div key={variant.type} className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3 capitalize">
                  {variant.type}: <span className="text-muted-foreground">{selectedVariants[variant.type]}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map(option => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.type]: option }))}
                      className={cn(
                        'px-4 py-2 border rounded-md text-sm transition-all',
                        selectedVariants[variant.type] === option
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-border text-foreground hover:border-gold'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium text-foreground mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border rounded-md">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-foreground">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-sm text-gold mt-2">Only {product.stock} left in stock</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-4 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={cn(
                  'px-6 py-4 border rounded-md transition-colors',
                  inWishlist
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-border text-foreground hover:border-gold'
                )}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={cn('h-5 w-5', inWishlist && 'fill-current')} />
              </button>
              <button
                className="px-6 py-4 border border-border rounded-md text-foreground hover:border-gold transition-colors"
                aria-label="Share"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-gold mb-2" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto text-gold mb-2" />
                <p className="text-xs text-muted-foreground">30-Day Returns</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-gold mb-2" />
                <p className="text-xs text-muted-foreground">2-Year Warranty</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-8 border-b border-border">
            {(['description', 'specs', 'reviews'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'pb-4 text-sm font-medium uppercase tracking-wide transition-colors relative',
                  activeTab === tab ? 'text-gold' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="max-w-3xl">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-3xl">
                <dl className="divide-y divide-border">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="py-4 grid grid-cols-2 gap-4">
                      <dt className="text-muted-foreground">{key}</dt>
                      <dd className="text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="max-w-3xl space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="pb-6 border-b border-border last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-medium">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{review.userName}</p>
                          <p className="text-xs text-muted-foreground">{review.date}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-muted-foreground">{review.text}</p>
                    <button className="text-sm text-gold hover:text-gold-light mt-2 transition-colors">
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-16 border-t border-border">
            <h2 className="font-display text-2xl text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
