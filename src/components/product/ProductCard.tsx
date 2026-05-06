import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { cn, formatCurrency } from '@/lib/utils'
import { StarRating } from '@/components/common/StarRating'
import { Badge } from '@/components/common/Badge'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
        {/* Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={cn(
            'w-full h-full object-cover transition-transform duration-500 group-hover:scale-105',
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 skeleton-shimmer" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.discount > 0 && (
            <Badge variant="sale">-{product.discount}%</Badge>
          )}
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="default">Low Stock</Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="soldout">Sold Out</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button
            onClick={handleToggleWishlist}
            className={cn(
              'p-2 rounded-full bg-background/90 backdrop-blur-sm transition-colors',
              inWishlist ? 'text-gold' : 'text-foreground hover:text-gold'
            )}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
          </button>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="p-2 rounded-full bg-background/90 backdrop-blur-sm text-foreground hover:text-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>

        {/* Quick add on mobile */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="absolute bottom-0 left-0 right-0 py-3 bg-charcoal/95 text-offwhite text-sm font-medium translate-y-full transition-transform duration-300 group-hover:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed md:hidden"
        >
          {product.stock === 0 ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-medium text-foreground group-hover:text-gold transition-colors line-clamp-1">
          {product.name}
        </h3>
        <StarRating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        <div className="flex items-center gap-2 pt-1">
          <span className="text-gold font-semibold">{formatCurrency(product.price)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
