import { Link, NavLink } from 'react-router-dom'
import { SearchBar } from './SearchBar'

export function Header() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto grid h-14 max-w-[1180px] grid-cols-[auto_1fr_auto] items-center gap-3 px-5">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/home.svg" alt="" className="h-5 w-5" />
          <span className="font-semibold">Магазин</span>
        </Link>

        <div className="justify-self-center w-full max-w-[560px]">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <button className="icon-btn" aria-label="Избранное">
            <img src="/icons/heart.svg" alt="" className="h-5 w-5" />
          </button>
          <NavLink to="/cart" className="icon-btn" aria-label="Корзина">
            <img src="/icons/cart.svg" alt="" className="h-5 w-5" />
          </NavLink>
        </div>
      </nav>
    </header>
  )
}
