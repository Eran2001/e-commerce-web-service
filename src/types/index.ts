export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviewCount: number
  images: string[]
  description: string
  specs: Record<string, string>
  brand: string
  stock: number
  variants: ProductVariant[]
}

export interface ProductVariant {
  type: 'size' | 'color'
  options: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  image: string
  productCount: number
}

export interface CartItem {
  product: Product
  quantity: number
  selectedVariants: Record<string, string>
}

export interface WishlistItem {
  product: Product
  addedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  country: string
  isDefault: boolean
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'processing' | 'shipped' | 'delivered'
  date: string
  shippingAddress: Address
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  date: string
  text: string
  helpful: number
}
