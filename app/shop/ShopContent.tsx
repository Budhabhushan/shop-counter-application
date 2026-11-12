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
      if (sort === "pasc") {
        return a.priceCents - b.priceCents;
      }

      if (sort === "pdesc") {
        return b.priceCents - a.priceCents;
      }

      return a.name.localeCompare(b.name);
    });

  return (
    <>
      <SearchSort q={q} sort={sort} />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg: grid-cols-3">
        {filteredProducts.length === 0 ? (
          <p>No items match</p>
        ) : (
          filteredProducts.map((product) => (
            <Link
              key={product.sku}
              href={`/shop/${product.sku}`}
              className="rounded-xl border p-5 hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p>${(product.priceCents / 100).toFixed(0)}</p>
              <p>
                {product.remaining === null
                  ? "Not stock-limited"
                  : `${product.remaining} left`}
              </p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
