import { Link } from 'react-router-dom'
import { Laptop, Shirt, Home, Dumbbell, Sparkles, BookOpen, ArrowRight } from 'lucide-react'
import { categories } from '@/data/categories'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Shirt,
  Home,
  Dumbbell,
  Sparkles,
  BookOpen,
}

export function CategoriesGrid() {
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-gold text-sm font-medium uppercase tracking-[0.2em] mb-3">
            Explore
          </p>
          <h2 className="font-display text-foreground">Shop by Category</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Laptop
            return (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-card"
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 lg:p-6">
                  <div className="p-3 rounded-full bg-gold/10 backdrop-blur-sm mb-3 group-hover:bg-gold/20 transition-colors">
                    <Icon className="h-6 w-6 text-gold" />
                  </div>
                  <h3 className="font-display text-lg text-offwhite text-center">{category.name}</h3>
                  <p className="text-sm text-offwhite/60 mt-1">{category.productCount} items</p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="px-4 py-2 bg-gold text-charcoal text-sm font-medium rounded-full flex items-center gap-2">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
