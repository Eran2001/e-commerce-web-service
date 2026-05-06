import { Order } from '@/types'
import { products } from './products'

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    items: [
      { product: products[0], quantity: 1, selectedVariants: { color: 'Midnight Black' } },
      { product: products[5], quantity: 2, selectedVariants: {} },
    ],
    total: 549.99,
    status: 'delivered',
    date: '2024-01-15',
    shippingAddress: {
      id: 'addr_1',
      name: 'Home',
      street: '123 Luxury Lane',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      isDefault: true,
    },
  },
  {
    id: 'ORD-002',
    items: [
      { product: products[12], quantity: 1, selectedVariants: { size: 'M', color: 'Navy' } },
    ],
    total: 289.99,
    status: 'shipped',
    date: '2024-02-20',
    shippingAddress: {
      id: 'addr_1',
      name: 'Home',
      street: '123 Luxury Lane',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      isDefault: true,
    },
  },
  {
    id: 'ORD-003',
    items: [
      { product: products[25], quantity: 1, selectedVariants: {} },
      { product: products[30], quantity: 1, selectedVariants: {} },
      { product: products[35], quantity: 1, selectedVariants: {} },
    ],
    total: 425.97,
    status: 'processing',
    date: '2024-03-01',
    shippingAddress: {
      id: 'addr_2',
      name: 'Office',
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90001',
      country: 'United States',
      isDefault: false,
    },
  },
  {
    id: 'ORD-004',
    items: [
      { product: products[40], quantity: 2, selectedVariants: {} },
    ],
    total: 159.98,
    status: 'delivered',
    date: '2023-12-10',
    shippingAddress: {
      id: 'addr_1',
      name: 'Home',
      street: '123 Luxury Lane',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      isDefault: true,
    },
  },
  {
    id: 'ORD-005',
    items: [
      { product: products[55], quantity: 1, selectedVariants: {} },
    ],
    total: 89.99,
    status: 'delivered',
    date: '2023-11-28',
    shippingAddress: {
      id: 'addr_1',
      name: 'Home',
      street: '123 Luxury Lane',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'United States',
      isDefault: true,
    },
  },
]

export const mockAddresses = [
  {
    id: 'addr_1',
    name: 'Home',
    street: '123 Luxury Lane',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    isDefault: true,
  },
  {
    id: 'addr_2',
    name: 'Office',
    street: '456 Business Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    country: 'United States',
    isDefault: false,
  },
]
