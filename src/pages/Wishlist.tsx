import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, X, ArrowRight } from 'lucide-react'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/utils'

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item: typeof items[0]) => {
    addToCart(item.product)
    removeFromWishlist(item.product.id)
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-flex p-6 rounded-full bg-gold/10 mb-6">
            <Heart className="h-12 w-12 text-gold" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Save your favorite items here by clicking the heart icon on any product. Start exploring our collection.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
          >
            Explore Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl text-foreground">My Wishlist</h1>
            <p className="text-muted-foreground mt-1">{items.length} items saved</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5 gap-4 sm:gap-6">
          {items.map((item) => (
            <div key={item.product.id} className="group relative bg-card rounded-lg overflow-hidden">
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(item.product.id)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove from wishlist"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Image */}
              <Link to={`/product/${item.product.id}`} className="block aspect-square overflow-hidden">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {item.product.brand}
                </p>
                <Link
                  to={`/product/${item.product.id}`}
                  className="font-medium text-foreground hover:text-gold transition-colors line-clamp-1 block mb-2"
                >
                  {item.product.name}
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gold font-semibold">{formatCurrency(item.product.price)}</span>
                  {item.product.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatCurrency(item.product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Move to Cart */}
                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.product.stock === 0}
                  className="w-full py-2.5 flex items-center justify-center gap-2 border border-gold text-gold text-sm font-medium rounded-md hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {item.product.stock === 0 ? 'Out of Stock' : 'Move to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
