import { Category } from '@/types'

export const categories: Category[] = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Laptop',
    image: 'https://picsum.photos/seed/cat-electronics/800/600',
    productCount: 10,
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: 'Shirt',
    image: 'https://picsum.photos/seed/cat-clothing/800/600',
    productCount: 10,
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    icon: 'Home',
    image: 'https://picsum.photos/seed/cat-home/800/600',
    productCount: 10,
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'Dumbbell',
    image: 'https://picsum.photos/seed/cat-sports/800/600',
    productCount: 10,
  },
  {
    id: 'beauty',
    name: 'Beauty',
    icon: 'Sparkles',
    image: 'https://picsum.photos/seed/cat-beauty/800/600',
    productCount: 10,
  },
  {
    id: 'books',
    name: 'Books',
    icon: 'BookOpen',
    image: 'https://picsum.photos/seed/cat-books/800/600',
    productCount: 10,
  },
]

export function getCategoryByName(name: string): Category | undefined {
  return categories.find(c => c.name.toLowerCase() === name.toLowerCase())
}
