import { Routes, Route } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { CatalogPage } from '@/pages/catalog'
import { CartPage } from '@/pages/cart'
import { Footer } from '@/widgets/footer'

export function AppRouter() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </main>
      <Footer /> {}
    </div>
  )
}
