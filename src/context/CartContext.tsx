import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { CartItem, Product } from '@/types'
import { toast } from 'sonner'

interface CartContextType {
  items: CartItem[]
  addToCart: (product: Product, quantity?: number, variants?: Record<string, string>) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  applyCoupon: (code: string) => boolean
  couponDiscount: number
  appliedCoupon: string | null
  removeCoupon: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'luxe-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToCart = (product: Product, quantity = 1, variants: Record<string, string> = {}) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      }
      return [...prev, { product, quantity, selectedVariants: variants }]
    })
    toast.success(`${product.name} added to cart`)
  }

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
    toast.success('Item removed from cart')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  const getCartTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    return subtotal * (1 - couponDiscount / 100)
  }

  const getCartCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  const applyCoupon = (code: string): boolean => {
    if (code.toUpperCase() === 'SAVE10') {
      setAppliedCoupon(code)
      setCouponDiscount(10)
      toast.success('Coupon applied! 10% off your order')
      return true
    }
    toast.error('Invalid coupon code')
    return false
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        applyCoupon,
        couponDiscount,
        appliedCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
