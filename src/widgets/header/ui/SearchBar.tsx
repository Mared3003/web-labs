import { useEffect, useMemo, useRef, useState } from 'react'
import { MIN_SEARCH_QUERY_LENGTH, useProductStore } from '@/entities/product'
import { useCart } from '@/features/add-to-cart'

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const query = useProductStore((state) => state.searchQuery)
  const setQuery = useProductStore((state) => state.setSearchQuery)
  const searchProducts = useProductStore((state) => state.searchProducts)
  const favorites = useProductStore((state) => state.favorites)
  const toggleFavorite = useProductStore((state) => state.toggleFavorite)
  const { add, remove, has } = useCart()

  const results = useMemo(() => searchProducts(query), [searchProducts, query])
  const normalizedQuery = query.trim()

  useEffect(() => {
    setIsOpen(normalizedQuery.length >= MIN_SEARCH_QUERY_LENGTH)
  }, [normalizedQuery])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current) return
      if (!wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleCartToggle = (id: string) => {
    if (has(id)) {
      remove(id)
    } else {
      add(id)
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[560px]">
      <input
        className="search__input w-full"
        type="search"
        placeholder="Искать по каталогу..."
        value={query}
        onFocus={() => setIsOpen(normalizedQuery.length >= MIN_SEARCH_QUERY_LENGTH)}
        onChange={(event) => setQuery(event.target.value)}
      />

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-72 overflow-y-auto">
            {results.map((product) => {
              const inCart = has(product.id)
              const isFavorite = favorites[product.id] ?? false
              const hasSale =
                typeof product.oldPrice === 'number' && product.oldPrice > product.price

              return (
                <li
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="h-12 w-12 rounded-lg border bg-gray-100" />
                  <div className="flex-1">
                    <p className="font-medium leading-tight">{product.title}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      {hasSale && (
                        <img
                          src="/icons/discount2.svg"
                          alt="Скидка"
                          className="h-4 w-4"
                        />
                      )}
                      <span>{product.price.toLocaleString('ru-RU')} ₽</span>
                      {hasSale && product.oldPrice && (
                        <span className="text-xs font-normal text-gray-500 line-through">
                          {product.oldPrice.toLocaleString('ru-RU')} ₽
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border hover:bg-gray-50 ${isFavorite ? 'bg-rose-50 border-rose-200' : 'bg-white'}`}
                      aria-pressed={isFavorite}
                      aria-label="Добавить в избранное"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <img
                        src={isFavorite ? '/icons/heart_filled.svg' : '/icons/heart.svg'}
                        alt=""
                        className="h-4 w-4"
                      />
                    </button>
                    <button
                      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                        inCart
                          ? 'bg-gray-200 text-gray-900 border-gray-300'
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => handleCartToggle(product.id)}
                      aria-label={inCart ? 'Убрать из корзины' : 'Добавить в корзину'}
                    >
                      <img
                        src="/icons/cart.svg"
                        alt=""
                        className="h-4 w-4"
                      />
                    </button>
                  </div>
                </li>
              )
            })}
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">
                Ничего не найдено
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
