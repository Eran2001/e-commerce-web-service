import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = [
  {
    id: 1,
    title: 'The Art of Luxury',
    subtitle: 'New Season Collection',
    description: 'Discover curated pieces that define modern elegance',
    cta: 'Explore Collection',
    link: '/products',
    image: 'https://picsum.photos/seed/hero1/1920/1080',
  },
  {
    id: 2,
    title: 'Timeless Elegance',
    subtitle: 'Premium Electronics',
    description: 'Technology meets sophistication in our latest arrivals',
    cta: 'Shop Now',
    link: '/products?category=Electronics',
    image: 'https://picsum.photos/seed/hero2/1920/1080',
  },
  {
    id: 3,
    title: 'Refined Living',
    subtitle: 'Home & Kitchen',
    description: 'Elevate your space with artisanal craftsmanship',
    cta: 'Discover More',
    link: '/products?category=Home+%26+Kitchen',
    image: 'https://picsum.photos/seed/hero3/1920/1080',
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden grain-overlay">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-1000',
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          )}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="mx-auto max-w-[1800px] w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <p
                  className={cn(
                    'text-gold text-sm font-medium uppercase tracking-[0.2em] mb-4 transition-all duration-700 delay-200',
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  )}
                >
                  {slide.subtitle}
                </p>
                <h1
                  className={cn(
                    'font-display text-offwhite mb-6 transition-all duration-700 delay-300',
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  )}
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
                >
                  {slide.title}
                </h1>
                <p
                  className={cn(
                    'text-offwhite/80 text-lg mb-8 max-w-md transition-all duration-700 delay-400',
                    index === currentSlide
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  )}
                >
                  {slide.description}
                </p>
                <Link
                  to={slide.link}
                  className={cn(
                    'inline-flex items-center gap-2 px-8 py-3 border border-gold text-gold font-medium uppercase tracking-wider text-sm hover:bg-gold hover:text-charcoal transition-all duration-300',
                    index === currentSlide
                      ? 'opacity-100 translate-y-0 delay-500'
                      : 'opacity-0 translate-y-4'
                  )}
                >
                  {slide.cta}
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-4 right-4 flex justify-between z-20 pointer-events-none">
        <button
          onClick={goToPrevious}
          className="p-3 text-offwhite/70 hover:text-gold transition-colors pointer-events-auto"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-8 w-8" />
        </button>
        <button
          onClick={goToNext}
          className="p-3 text-offwhite/70 hover:text-gold transition-colors pointer-events-auto"
          aria-label="Next slide"
        >
          <ChevronRight className="h-8 w-8" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              'h-0.5 transition-all duration-300',
              index === currentSlide
                ? 'w-12 bg-gold'
                : 'w-6 bg-offwhite/30 hover:bg-offwhite/50'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden lg:flex flex-col items-center gap-2 text-offwhite/50">
        <span className="text-xs uppercase tracking-widest rotate-90 origin-center translate-x-4">Scroll</span>
        <div className="w-px h-16 bg-gradient-to-b from-offwhite/50 to-transparent" />
      </div>
    </section>
  )
}
