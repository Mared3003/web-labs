import type { Product } from './types'

const hoodies: Product[] = [
  { id: 'h1', title: 'Теплое худи', price: 999, oldPrice: 1199 },
  { id: 'h2', title: 'Классическое худи', price: 1199 },
  { id: 'h3', title: 'Oversize худи', price: 1299 },
  { id: 'h4', title: 'Худи с молнией', price: 1399, oldPrice: 1599 },
  { id: 'h5', title: 'Базовое худи', price: 1099 },
  { id: 'h6', title: 'Худи с начёсом', price: 1499, oldPrice: 1799 },
]

const shorts: Product[] = [
  { id: 's1', title: 'Wide Shorts', price: 999, oldPrice: 1199 },
  { id: 's2', title: 'Sport Shorts', price: 899 },
  { id: 's3', title: 'Casual Shorts', price: 949 },
  { id: 's4', title: 'Cotton Shorts', price: 799 },
  { id: 's5', title: 'Denim Shorts', price: 1199, oldPrice: 1399 },
  { id: 's6', title: 'Relax Shorts', price: 699 },
]

export const catalogGroups = [
  { id: 'hoodies', title: 'Худи', items: hoodies },
  { id: 'shorts', title: 'Шорты', items: shorts },
] as const

const byId = new Map<string, Product>()
for (const group of catalogGroups) {
  for (const item of group.items) {
    byId.set(item.id, item)
  }
}

export const allProducts: Product[] = Array.from(byId.values())

export function getProductById(id: string) {
  return byId.get(id)
}
