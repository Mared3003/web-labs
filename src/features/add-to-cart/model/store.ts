import { create } from 'zustand'

type CartItem = {
  id: string
  qty: number
}

type CartState = {
  items: CartItem[]
  add: (id: string) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
  increment: (id: string) => void
  decrement: (id: string) => void
  setQuantity: (id: string, qty: number) => void
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (id) =>
    set((state) =>
      state.items.some((item) => item.id === id)
        ? state
        : { items: [...state.items, { id, qty: 1 }] }
    ),
  remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
  has: (id) => get().items.some((item) => item.id === id),
  clear: () => set({ items: [] }),
  increment: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      ),
    })),
  decrement: (id) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      ),
    })),
  setQuantity: (id, qty) =>
    set((state) => {
      const numeric = Number.isFinite(qty) ? Math.floor(qty) : 1
      const nextQty = Math.max(1, numeric)
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, qty: nextQty } : item
        ),
      }
    }),
}))
