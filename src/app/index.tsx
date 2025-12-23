import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router'
import { ProductStoreProvider } from '@/entities/product'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ProductStoreProvider>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </ProductStoreProvider>
)
