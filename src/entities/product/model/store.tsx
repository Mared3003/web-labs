import { createContext, useContext, useState, type ReactNode } from 'react'
import { createStore, useStore, type StoreApi } from 'zustand'
import { allProducts } from './data'
import type { Product } from './types'

export const MIN_SEARCH_QUERY_LENGTH = 2

type ProductState = {
  products: Product[]
  favorites: Record<string, boolean>
  searchQuery: string
  setSearchQuery: (value: string) => void
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  searchProducts: (query: string) => Product[]
}

const createProductStore = (
  initialState?: Partial<Pick<ProductState, 'products' | 'favorites' | 'searchQuery'>>
) =>
  createStore<ProductState>((set, get) => ({
    products: initialState?.products ?? allProducts,
    favorites: initialState?.favorites ?? {},
    searchQuery: initialState?.searchQuery ?? '',
    setSearchQuery: (value) => set({ searchQuery: value }),
    toggleFavorite: (id) =>
      set((state) => ({
        favorites: { ...state.favorites, [id]: !state.favorites[id] },
      })),
    isFavorite: (id) => Boolean(get().favorites[id]),
    searchProducts: (query) => {
      const normalized = query.trim().toLowerCase()
      if (normalized.length < MIN_SEARCH_QUERY_LENGTH) return []
      return get().products.filter((product) =>
        product.title.toLowerCase().includes(normalized)
      )
    },
  }))

type ProductStore = ReturnType<typeof createProductStore>

const ProductStoreContext = createContext<ProductStore | null>(null)

export function ProductStoreProvider({ children }: { children?: ReactNode }) {
  const [store] = useState(() => createProductStore())
  return (
    <ProductStoreContext.Provider value={store}>{children}</ProductStoreContext.Provider>
  )
}

export function useProductStore<T>(selector: (state: ProductState) => T): T {
  const store = useContext(ProductStoreContext)
  if (!store) {
    throw new Error('useProductStore must be used within ProductStoreProvider')
  }
  return useStore(store, selector)
}
