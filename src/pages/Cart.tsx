import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, X, Tag, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { cn, formatCurrency } from '@/lib/utils'

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    applyCoupon,
    couponDiscount,
    appliedCoupon,
    removeCoupon,
  } = useCart()
  const [couponCode, setCouponCode] = useState('')

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 100 ? 0 : 9.99
  const discount = subtotal * (couponDiscount / 100)
  const total = getCartTotal() + shipping

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode)
      setCouponCode('')
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="inline-flex p-6 rounded-full bg-gold/10 mb-6">
            <ShoppingBag className="h-12 w-12 text-gold" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Looks like you haven&apos;t added any items to your cart yet. Explore our collection and find something you love.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.product.id} className="py-6 flex gap-4 sm:gap-6">
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-card"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">
                          {item.product.brand}
                        </p>
                        <Link
                          to={`/product/${item.product.id}`}
                          className="font-medium text-foreground hover:text-gold transition-colors line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        {Object.entries(item.selectedVariants).length > 0 && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {Object.entries(item.selectedVariants)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(' / ')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Remove item"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-10 text-center text-foreground text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-gold font-semibold">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.product.price)} each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg p-6 sticky top-24">
              <h2 className="font-display text-xl text-foreground mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-gold/10 rounded-md">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium text-gold">{appliedCoupon}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="flex-1 h-10 px-3 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold transition-colors"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 h-10 border border-gold text-gold text-sm font-medium rounded-md hover:bg-gold hover:text-charcoal transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">Try "SAVE10" for 10% off</p>
              </div>

              {/* Totals */}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Discount ({couponDiscount}%)</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-gold">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full mt-6 py-4 bg-gold text-charcoal font-medium rounded-md hover:bg-gold-light transition-colors flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </Link>

              {/* Continue Shopping */}
              <Link
                to="/products"
                className="block text-center mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
