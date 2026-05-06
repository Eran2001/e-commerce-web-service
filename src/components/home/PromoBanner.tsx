import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export function PromoBanner() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {/* Banner 1 */}
          <Link
            to="/products?category=Electronics"
            className="group relative overflow-hidden rounded-lg aspect-[16/9] md:aspect-[4/3]"
          >
            <img
              src="https://picsum.photos/seed/promo1/800/600"
              alt="Electronics Collection"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-12">
              <p className="text-gold text-sm font-medium uppercase tracking-[0.2em] mb-2">
                Limited Time
              </p>
              <h3 className="font-display text-2xl lg:text-3xl text-offwhite mb-4">
                Tech Essentials
              </h3>
              <p className="text-offwhite/70 mb-6 max-w-xs">
                Up to 40% off on premium electronics and accessories
              </p>
              <span className="inline-flex items-center gap-2 text-gold group-hover:gap-3 transition-all">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>

          {/* Banner 2 */}
          <Link
            to="/products?category=Clothing"
            className="group relative overflow-hidden rounded-lg aspect-[16/9] md:aspect-[4/3]"
          >
            <img
              src="https://picsum.photos/seed/promo2/800/600"
              alt="Fashion Collection"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-8 lg:p-12">
              <p className="text-gold text-sm font-medium uppercase tracking-[0.2em] mb-2">
                New Arrivals
              </p>
              <h3 className="font-display text-2xl lg:text-3xl text-offwhite mb-4">
                Spring Collection
              </h3>
              <p className="text-offwhite/70 mb-6 max-w-xs">
                Discover the latest in luxury fashion and timeless style
              </p>
              <span className="inline-flex items-center gap-2 text-gold group-hover:gap-3 transition-all">
                Explore
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>

        {/* Full-width banner */}
        <div className="mt-6 lg:mt-8">
          <Link
            to="/products"
            className="group relative block overflow-hidden rounded-lg aspect-[21/9] lg:aspect-[3/1]"
          >
            <img
              src="https://picsum.photos/seed/promo3/1600/400"
              alt="Special Offer"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-charcoal/70" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <p className="text-gold text-sm font-medium uppercase tracking-[0.2em] mb-2">
                Exclusive Offer
              </p>
              <h3 className="font-display text-3xl lg:text-4xl text-offwhite mb-4">
                Free Shipping on Orders Over $100
              </h3>
              <p className="text-offwhite/70 mb-6 max-w-lg">
                Use code <span className="text-gold font-semibold">SAVE10</span> at checkout for an extra 10% off your order
              </p>
              <span className="inline-flex items-center gap-2 px-6 py-3 border border-gold text-gold hover:bg-gold hover:text-charcoal transition-all duration-300">
                Shop All Products
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
