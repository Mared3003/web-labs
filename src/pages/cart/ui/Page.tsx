import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/features/add-to-cart'
import { Button } from '@/shared/ui/button'
import { getProductById, type Product } from '@/entities/product'

type DetailedCartItem = Product & { qty: number }

const formatCurrency = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

export default function CartPage() {
  const { items, remove, clear, increment, decrement, setQuantity } = useCart()
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})

  const detailedItems = useMemo<DetailedCartItem[]>(() => {
    return items
      .map((item) => {
        const product = getProductById(item.id)
        if (!product) {
          return null
        }
        return { ...product, qty: item.qty }
      })
      .filter((item): item is DetailedCartItem => Boolean(item))
  }, [items])

  const [selected, setSelected] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setSelected((prev) => {
      const next: Record<string, boolean> = {}
      for (const item of detailedItems) {
        next[item.id] = prev[item.id] ?? true
      }
      return next
    })
  }, [detailedItems])

  const allSelected =
    detailedItems.length > 0 && detailedItems.every((item) => selected[item.id])

  const selectedItems = detailedItems.filter((item) => selected[item.id])

  const summary = selectedItems.reduce(
    (acc, item) => {
      const basePrice = item.oldPrice ?? item.price
      const discountPerUnit = Math.max(basePrice - item.price, 0)
      acc.positions += 1
      acc.units += item.qty
      acc.full += basePrice * item.qty
      acc.discount += discountPerUnit * item.qty
      acc.total += item.price * item.qty
      return acc
    },
    { positions: 0, units: 0, full: 0, discount: 0, total: 0 }
  )

  const toggleItem = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))

  const toggleAll = () => {
    const nextValue = !allSelected
    const next: Record<string, boolean> = {}
    for (const item of detailedItems) {
      next[item.id] = nextValue
    }
    setSelected(next)
  }

  if (detailedItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center space-y-4">
        <h1 className="text-3xl font-bold">Корзина</h1>
        <p className="text-gray-600">
          Здесь будут товары, которые вы добавите на странице каталога.
        </p>
        <Link
          to="/"
          className="inline-flex h-10 items-center justify-center rounded-full border px-5 font-medium hover:bg-gray-50"
        >
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Корзина</h1>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.5fr)_minmax(260px,1fr)]">
        <section className="rounded-2xl border bg-white shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 text-sm">
            <label className="flex items-center gap-2 font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 accent-black"
                checked={allSelected}
                onChange={toggleAll}
              />
              Выбрать все
            </label>
            <button
              className="text-gray-500 hover:text-gray-900"
              onClick={clear}
            >
              Очистить корзину
            </button>
          </header>
          <ul className="divide-y">
            {detailedItems.map((item) => {
              const hasSale = typeof item.oldPrice === 'number' && item.oldPrice > item.price
              const pct = hasSale && item.oldPrice
                ? Math.round((1 - item.price / item.oldPrice) * 100)
                : 0
              const isFavorite = favorites[item.id] ?? false

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 px-4 py-5 md:flex-row md:items-center"
                >
                  <div className="flex flex-1 items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-2 h-4 w-4 accent-black"
                      checked={selected[item.id] ?? true}
                      onChange={() => toggleItem(item.id)}
                    />
                    <div className="h-20 w-20 rounded-lg border bg-gray-100" />
                    <div className="space-y-1">
                      <p className="font-semibold">{item.title}</p>
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        {hasSale && (
                          <img
                            src="/icons/discount2.svg"
                            alt="Скидка"
                            title={`Скидка ${pct}%`}
                            className="w-4 h-4"
                          />
                        )}
                        <span>{formatCurrency(item.price)}</span>
                        {hasSale && item.oldPrice && (
                          <span className="text-sm font-normal text-gray-500 line-through">
                            {formatCurrency(item.oldPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2 text-sm">
                        <button
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                            isFavorite ? 'bg-rose-50 border-rose-200' : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() =>
                            setFavorites((prev) => {
                              const current = prev[item.id] ?? false
                              return { ...prev, [item.id]: !current }
                            })
                          }
                          aria-label="Добавить в избранное"
                        >
                          <img
                            src={isFavorite ? '/icons/heart_filled.svg' : '/icons/heart.svg'}
                            alt=""
                            className="w-4 h-4"
                          />
                        </button>
                        <button
                          className="flex h-9 w-9 items-center justify-center rounded-lg border bg-white text-gray-600 transition hover:bg-gray-50"
                          aria-label="Удалить из корзины"
                          onClick={() => remove(item.id)}
                        >
                          <img src="/icons/trash.svg" alt="" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3 self-start md:self-auto">
                    <QuantityControl
                      qty={item.qty}
                      onDecrease={() => decrement(item.id)}
                      onIncrease={() => increment(item.id)}
                      onType={(value) => setQuantity(item.id, value)}
                    />
                    <Button className="min-w-[96px] bg-gray-900 text-white hover:bg-black">
                      Купить
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
        <aside className="h-fit rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <p className="text-lg font-semibold">Ваш заказ</p>
            </div>
            <span className="text-sm text-gray-500">
              {detailedItems.length} в корзине
            </span>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt>Товары ({summary.units})</dt>
              <dd className="font-semibold">{formatCurrency(summary.full)}</dd>
            </div>
            <div className="flex items-center justify-between text-rose-600">
              <dt>Скидка</dt>
              <dd>-{formatCurrency(summary.discount)}</dd>
            </div>
          </dl>
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Итого</span>
              <span>{formatCurrency(summary.total)}</span>
            </div>
            <Button className="mt-4 w-full bg-black text-white hover:bg-gray-900">
              Перейти к оформлению
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}

type QuantityControlProps = {
  qty: number
  onDecrease: () => void
  onIncrease: () => void
  onType: (value: number) => void
}

function QuantityControl({ qty, onDecrease, onIncrease, onType }: QuantityControlProps) {
  return (
    <div className="inline-flex items-center rounded-lg border">
      <button
        className="h-9 w-9 text-lg disabled:text-gray-300"
        onClick={onDecrease}
        disabled={qty <= 1}
      >
        -
      </button>
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(event) => onType(Number(event.target.value))}
        className="h-9 w-14 border-x text-center outline-none"
      />
      <button className="h-9 w-9 text-lg" onClick={onIncrease}>
        +
      </button>
    </div>
  )
}
