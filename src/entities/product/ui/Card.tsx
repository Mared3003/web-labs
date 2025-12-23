import { AddToCartButton } from '@/features/add-to-cart'
import { useProductStore } from '../model/store'
import type { Product } from '../model/types'

type ProductCardProps = {
  p: Product
}

export function ProductCard({ p }: ProductCardProps) {
  const oldPrice = typeof p.oldPrice === 'number' ? p.oldPrice : null
  const hasSale = oldPrice !== null && oldPrice > p.price
  const pct = hasSale && oldPrice !== null ? Math.round((1 - p.price / oldPrice) * 100) : 0
  const toggleFavorite = useProductStore((state) => state.toggleFavorite)
  const isFavorite = useProductStore((state) => state.isFavorite(p.id))

  return (
    <article className="rounded-xl border border-transparent shadow-sm p-3 flex flex-col gap-2 hover:border-gray-300 transition">
      <div className="h-40 rounded border bg-gray-50 relative">
        <button
          className="absolute top-2 right-2 grid place-items-center w-7 h-7 rounded bg-white/90 border border-transparent"
          aria-label="Добавить в избранное"
          onClick={() => toggleFavorite(p.id)}
        >
          <img
            src={isFavorite ? '/icons/heart_filled.svg' : '/icons/heart.svg'}
            alt=""
            className="w-4 h-4"
          />
        </button>
      </div>

      <div className="flex items-center gap-2 font-semibold">
        {hasSale && (
          <img
            src="/icons/discount2.svg"
            alt="Скидка"
            title={`Скидка ${pct}%`}
            className="w-4 h-4"
          />
        )}
        <span>{p.price.toLocaleString('ru-RU')} ₽</span>
        {hasSale && oldPrice !== null && (
          <span className="text-gray-500 line-through font-normal">
            {oldPrice.toLocaleString('ru-RU')} ₽
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600">{p.title}</p>
      <AddToCartButton id={p.id} />
    </article>
  )
}
