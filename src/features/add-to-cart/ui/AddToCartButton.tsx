import { useCart } from '../model/store'

export function AddToCartButton({ id }) {
  const { add, remove, has } = useCart()
  const inCart = has(id)
  return (
    <button
      onClick={() => (inCart ? remove(id) : add(id))}
      className={`h-8 rounded border px-3 text-sm transition
        ${inCart ? 'bg-gray-300 border-gray-400' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}`}
      aria-pressed={inCart}
    >
      {inCart ? 'В корзине' : 'В корзину'}
    </button>
  )
}
