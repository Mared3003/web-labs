import { ProductCard, catalogGroups } from '@/entities/product'

export default function CatalogPage() {
  return (
    <div className="space-y-6">
      {catalogGroups.map((group) => (
        <section key={group.id}>
          <h2 className="mb-3 text-2xl font-bold">{group.title}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {group.items.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
