import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, User, Search, Menu, Sun, Moon } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { useScrollPosition } from '@/hooks/useScrollPosition'
import { cn } from '@/lib/utils'
import { MobileMenu } from './MobileMenu'
import { SearchModal } from './SearchModal'

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { getCartCount } = useCart()
  const { items: wishlistItems } = useWishlist()
  const { isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { y: scrollY } = useScrollPosition()
  const location = useLocation()

  const isHome = location.pathname === '/'
  const isScrolled = scrollY > 50
  const isTransparent = isHome && !isScrolled

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isTransparent
            ? 'bg-transparent'
            : 'bg-background/95 backdrop-blur-md shadow-sm'
        )}
      >
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-foreground/80 hover:text-foreground transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="font-display text-2xl font-semibold tracking-wider text-gold lg:text-3xl">
                LUXE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/products"
                className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors uppercase tracking-wide"
              >
                Shop All
              </Link>
              <Link
                to="/products?category=Electronics"
                className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors uppercase tracking-wide"
              >
                Electronics
              </Link>
              <Link
                to="/products?category=Clothing"
                className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors uppercase tracking-wide"
              >
                Clothing
              </Link>
              <Link
                to="/products?category=Home+%26+Kitchen"
                className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors uppercase tracking-wide"
              >
                Home
              </Link>
              <Link
                to="/products?category=Beauty"
                className="text-sm font-medium text-foreground/70 hover:text-gold transition-colors uppercase tracking-wide"
              >
                Beauty
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-foreground/70 hover:text-gold transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 text-foreground/70 hover:text-gold transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              <Link
                to="/wishlist"
                className="relative p-2 text-foreground/70 hover:text-gold transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-0 -right-0 h-4 w-4 rounded-full bg-gold text-[10px] font-medium text-charcoal flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2 text-foreground/70 hover:text-gold transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-0 -right-0 h-4 w-4 rounded-full bg-gold text-[10px] font-medium text-charcoal flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              <Link
                to={isAuthenticated ? '/profile' : '/auth'}
                className="p-2 text-foreground/70 hover:text-gold transition-colors"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
