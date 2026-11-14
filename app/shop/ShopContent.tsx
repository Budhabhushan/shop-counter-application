import Link from "next/link";
import { getCatalog } from "@/src/lib/catalog";
import SearchSort from "@/src/components/shop/SearchSort";

type SearchParams = Promise<{
  q?: string;
  sort?: string;
}>;
export default async function ShopContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q = "", sort = "name" } = await searchParams;
  const products = await getCatalog();

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") {
        return a.priceCents - b.priceCents;
      }

      if (sort === "price-desc") {
        return b.priceCents - a.priceCents;
      }

      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <div className="mx-auto w-full max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 sm:p-8">
          <SearchSort q={q} sort={sort} />

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length === 0 ? (
              <p>No items match</p>
            ) : (
              filteredProducts.map((product) => (
                <Link
                  key={product.sku}
                  href={`/shop/${product.sku}`}
                  className="group flex min-h-44 flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-500 hover:bg-zinc-900 hover:shadow-xl hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-zinc-100 transition-colors group-hover:text-white">
                      {product.name}
                    </h2>
                    <p className="mt-3 text-2xl font-bold tracking-tight text-white">
                      ${(product.priceCents / 100).toFixed(0)}
                    </p>
                  </div>
                  <p className="mt-5 text-sm font-medium text-zinc-400">
                    {product.remaining === null
                      ? "Not stock-limited"
                      : `${product.remaining} left`}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
