import { Suspense } from "react";
import ShopContent from "./ShopContent";
// import SearchSort from "@/src/components/shop/SearchSort";

interface Props {
  searchParams: Promise<{
    q?: string;
    sort: string;
  }>;
}
export default async function ShopPage({ searchParams }: Props) {
  // const { q = "", sort = "name" } = await searchParams;

  // const products = await getCatalog();

  // const filtered = products.filter((product) =>
  //   product.name.toLowerCase().includes(q.toLowerCase()),
  // );

  // if (sort === "pasc") {
  //   filtered.sort((a, b) => a.priceCents - b.priceCents);
  // } else if (sort === "pdesc") {
  //   filtered.sort((a, b) => b.priceCents - a.priceCents);
  // } else {
  //   filtered.sort((a, b) => a.name.localeCompare(b.name));
  // }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-6 text-3xl font-bold">Shop Catalogue</h1>
      <Suspense fallback={<p>Loading products...</p>}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
      {/* <SearchSort q={q} sort={sort} />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg: grid-cols-3">
        {filtered.length === 0 ? (
          <p>No items match</p>
        ) : (
          filtered.map((product) => (
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
      </div> */}
    </main>
  );
}
