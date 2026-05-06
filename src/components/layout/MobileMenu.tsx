import { Link } from 'react-router-dom'
import { X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { categories } from '@/data/categories'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu panel */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 z-50 w-[300px] bg-background border-r border-border transition-transform duration-300 ease-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-display text-xl font-semibold text-gold">LUXE</span>
            <button
              onClick={onClose}
              className="p-2 text-foreground/70 hover:text-foreground transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="px-4 mb-4">
              <Link
                to="/products"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-lg font-medium text-foreground hover:text-gold transition-colors"
              >
                Shop All
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </div>

            <div className="px-4 mb-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
                Categories
              </p>
            </div>

            {categories.map(category => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 text-foreground/80 hover:text-gold hover:bg-muted/50 transition-colors"
              >
                <span>{category.name}</span>
                <span className="text-sm text-muted-foreground">{category.productCount}</span>
              </Link>
            ))}

            <div className="h-px bg-border my-4 mx-4" />

            <div className="px-4 space-y-1">
              <Link
                to="/wishlist"
                onClick={onClose}
                className="block py-3 text-foreground/80 hover:text-gold transition-colors"
              >
                Wishlist
              </Link>
              <Link
                to="/cart"
                onClick={onClose}
                className="block py-3 text-foreground/80 hover:text-gold transition-colors"
              >
                Shopping Bag
              </Link>
              <Link
                to="/auth"
                onClick={onClose}
                className="block py-3 text-foreground/80 hover:text-gold transition-colors"
              >
                Sign In / Register
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
