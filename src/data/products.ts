import { Product, Review } from '@/types'

const brands = {
  Electronics: ['TechPro', 'SoundMax', 'PixelPerfect', 'SmartLife', 'AudioElite'],
  Clothing: ['Luxe Wear', 'Urban Edge', 'Classic Couture', 'Modern Thread', 'Artisan Apparel'],
  'Home & Kitchen': ['HomeCraft', 'Culinary Pro', 'Living Space', 'Kitchen Master', 'Comfort Home'],
  Sports: ['AthleteX', 'ProFit', 'SportElite', 'ActiveLife', 'Performance Plus'],
  Beauty: ['Glow Essentials', 'Pure Radiance', 'Luxe Beauty', 'Natural Glow', 'Skin Perfect'],
  Books: ['Penguin Classics', 'Modern Library', 'Vintage Books', 'Harper Collins', 'Random House'],
}

const productNames = {
  Electronics: [
    'Wireless Noise-Canceling Headphones', 'Smart Watch Pro', '4K Ultra HD Monitor', 'Bluetooth Speaker System',
    'Mechanical Gaming Keyboard', 'Wireless Earbuds Elite', 'Portable Power Bank', 'Smart Home Hub',
    'Digital Camera DSLR', 'Tablet Pro 12.9"'
  ],
  Clothing: [
    'Cashmere Blend Sweater', 'Tailored Wool Blazer', 'Premium Cotton Shirt', 'Silk Evening Dress',
    'Leather Jacket Classic', 'Merino Wool Coat', 'Designer Denim Jeans', 'Linen Summer Suit',
    'Velvet Lounge Set', 'Organic Cotton Hoodie'
  ],
  'Home & Kitchen': [
    'Espresso Machine Pro', 'Cast Iron Cookware Set', 'Smart Air Purifier', 'Luxury Bedding Set',
    'Handcrafted Ceramic Vase', 'Chef Knife Collection', 'Aromatherapy Diffuser', 'Marble Cutting Board',
    'French Press Coffee Maker', 'Bamboo Organizer Set'
  ],
  Sports: [
    'Carbon Fiber Tennis Racket', 'Professional Yoga Mat', 'Smart Fitness Tracker', 'Resistance Band Set',
    'Adjustable Dumbbell System', 'Running Shoes Elite', 'Cycling Jersey Pro', 'Gym Duffle Bag',
    'Foam Roller Recovery Kit', 'Smart Jump Rope'
  ],
  Beauty: [
    'Anti-Aging Serum Complex', 'Luxury Face Cream', 'Professional Makeup Brush Set', 'Organic Skincare Kit',
    'Premium Hair Care Bundle', 'Aromatherapy Essential Oils', 'Jade Facial Roller Set', 'Vitamin C Brightening Set',
    'Natural Lip Collection', 'Hydrating Face Mask Pack'
  ],
  Books: [
    'The Art of Mindfulness', 'Modern Architecture Guide', 'Culinary Masterclass', 'Philosophy of Design',
    'World Travel Photography', 'Creative Writing Workshop', 'Business Strategy Essentials', 'Digital Marketing Pro',
    'The Science of Success', 'Meditation & Wellness Guide'
  ],
}

const descriptions = {
  Electronics: 'Experience cutting-edge technology with premium build quality and exceptional performance. Designed for the modern lifestyle with intuitive features and seamless connectivity.',
  Clothing: 'Crafted with the finest materials and impeccable attention to detail. This piece combines timeless elegance with contemporary style for the discerning individual.',
  'Home & Kitchen': 'Elevate your living space with this thoughtfully designed piece. Premium craftsmanship meets functional elegance to enhance your everyday experience.',
  Sports: 'Engineered for peak performance and designed for champions. Professional-grade quality meets innovative technology to help you achieve your goals.',
  Beauty: 'Formulated with premium ingredients and backed by advanced research. Experience the transformative power of luxury skincare and beauty essentials.',
  Books: 'A carefully curated collection of wisdom and inspiration. Discover new perspectives and expand your horizons with this essential addition to your library.',
}

function generateSpecs(category: string): Record<string, string> {
  const specsByCategory: Record<string, Record<string, string>> = {
    Electronics: { 'Battery Life': '40 hours', 'Connectivity': 'Bluetooth 5.3', 'Weight': '250g', 'Warranty': '2 years' },
    Clothing: { 'Material': '100% Premium Cotton', 'Care': 'Dry Clean Only', 'Fit': 'Regular', 'Origin': 'Italy' },
    'Home & Kitchen': { 'Material': 'Premium Stainless Steel', 'Dimensions': '12" x 8" x 6"', 'Weight': '2.5 lbs', 'Warranty': '5 years' },
    Sports: { 'Material': 'Carbon Fiber Composite', 'Weight': '300g', 'Size': 'Universal', 'Warranty': '1 year' },
    Beauty: { 'Volume': '50ml', 'Ingredients': 'Natural & Organic', 'Skin Type': 'All Types', 'Cruelty Free': 'Yes' },
    Books: { 'Format': 'Hardcover', 'Pages': '320', 'Language': 'English', 'Publisher': 'Premium Press' },
  }
  return specsByCategory[category] || {}
}

function generateVariants(category: string): { type: 'size' | 'color'; options: string[] }[] {
  if (category === 'Clothing') {
    return [
      { type: 'size', options: ['XS', 'S', 'M', 'L', 'XL'] },
      { type: 'color', options: ['Black', 'Navy', 'Charcoal', 'Cream'] },
    ]
  }
  if (category === 'Electronics') {
    return [{ type: 'color', options: ['Midnight Black', 'Silver', 'Rose Gold'] }]
  }
  if (category === 'Sports') {
    return [{ type: 'size', options: ['S', 'M', 'L'] }]
  }
  return []
}

export const products: Product[] = []

let productId = 1
const categories = Object.keys(productNames) as (keyof typeof productNames)[]

categories.forEach(category => {
  const names = productNames[category]
  const categoryBrands = brands[category]
  
  names.forEach((name, index) => {
    const basePrice = Math.floor(Math.random() * 400) + 50
    const hasDiscount = Math.random() > 0.5
    const discount = hasDiscount ? Math.floor(Math.random() * 30) + 10 : 0
    const originalPrice = hasDiscount ? Math.floor(basePrice / (1 - discount / 100)) : basePrice
    
    products.push({
      id: `prod_${productId}`,
      name,
      category,
      price: basePrice,
      originalPrice,
      discount,
      rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 20,
      images: [
        `https://picsum.photos/seed/${productId * 10}/600/600`,
        `https://picsum.photos/seed/${productId * 10 + 1}/600/600`,
        `https://picsum.photos/seed/${productId * 10 + 2}/600/600`,
        `https://picsum.photos/seed/${productId * 10 + 3}/600/600`,
      ],
      description: descriptions[category],
      specs: generateSpecs(category),
      brand: categoryBrands[index % categoryBrands.length],
      stock: Math.floor(Math.random() * 50) + 5,
      variants: generateVariants(category),
    })
    productId++
  })
})

const reviewerNames = [
  'Alexandra M.', 'Benjamin T.', 'Charlotte R.', 'Daniel K.', 
  'Eleanor S.', 'Frederick W.', 'Gabriella L.', 'Harrison P.'
]

const reviewTexts = [
  'Absolutely exceeded my expectations. The quality is impeccable and the attention to detail is remarkable.',
  'A truly premium product that delivers on every promise. Worth every penny.',
  'Elegant design meets exceptional functionality. Highly recommend to anyone seeking quality.',
  'Outstanding craftsmanship. This has become an essential part of my daily routine.',
  'The perfect blend of luxury and practicality. Could not be happier with this purchase.',
  'Impressive quality and fast shipping. The product looks even better in person.',
  'A sophisticated choice that stands out from the competition. Five stars well deserved.',
  'Exceeded all expectations. The build quality and finish are second to none.',
]

export function getReviewsForProduct(productId: string): Review[] {
  const seed = parseInt(productId.replace('prod_', ''))
  return reviewerNames.map((name, index) => ({
    id: `review_${seed}_${index}`,
    userId: `user_${index}`,
    userName: name,
    rating: Math.min(5, Math.max(3, Math.floor(Math.random() * 3) + 3)),
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    text: reviewTexts[index],
    helpful: Math.floor(Math.random() * 50),
  }))
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter(p => p.category === category)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.brand.toLowerCase().includes(lowerQuery)
  )
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit)
}
