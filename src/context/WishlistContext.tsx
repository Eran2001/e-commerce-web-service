import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Product, WishlistItem } from '@/types'
import { toast } from 'sonner'

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (product: Product) => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const STORAGE_KEY = 'luxe-wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addToWishlist = (product: Product) => {
    setItems(prev => {
      if (prev.some(item => item.product.id === product.id)) {
        return prev
      }
      return [...prev, { product, addedAt: new Date() }]
    })
    toast.success(`${product.name} added to wishlist`)
  }

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId))
    toast.success('Item removed from wishlist')
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product.id === productId)
  }

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
