import { HeroCarousel } from '@/components/home/HeroCarousel'
import { CategoriesGrid } from '@/components/home/CategoriesGrid'
import { TrendingProducts } from '@/components/home/TrendingProducts'
import { PromoBanner } from '@/components/home/PromoBanner'
import { Newsletter } from '@/components/home/Newsletter'

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <CategoriesGrid />
      <TrendingProducts />
      <PromoBanner />
      <Newsletter />
    </main>
  )
}
