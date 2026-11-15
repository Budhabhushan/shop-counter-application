import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/src/lib/catalog";

interface Props {
  params: Promise<{ sku: string }>;
}

export async function generateStaticParams() {
  const products = await getCatalog();
  return products.map(({ sku }) => ({ sku }));
}

export async function generateMetadata({ params }: Props) {
  const { sku } = await params;
  const products = await getCatalog();

  const product = products.find((item) => item.sku === sku);

  if (!product) {
    return {
      title: "Product Not Found | Shop counter",
    };
  }
  return {
    title: `${product.name} | Shop counter`,
    description: `View ${product.name}, its price, stock availability and available extras`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { sku } = await params;

  const products = await getCatalog();

  const product = products.find((item) => item.sku === sku);

  if (!product) {
    notFound();
  }
  return (
    <main className="mx-auto mt-10 mb-16 max-w-3xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm sm:p-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
        {product.name}
      </h1>
      <p className="mt-4 text-lg font-medium text-zinc-900">
        Price: ${(product.priceCents / 100).toFixed(0)}
      </p>
      <p className="text-zinc-500">
        {product.remaining === null
          ? "Not stock-limited"
          : `${product.remaining} left`}
      </p>
      <div className="mt-8 border-t border-zinc-200 pt-6"></div>
      <h2 className="mt-5 font-semibold text-zinc-900">Extras</h2>
      {product.extras.length === 0 ? (
        <p className="mt-1 text-zinc-500">None</p>
      ) : (
        product.extras.map((extra) => (
          <p key={extra.code} className="mt-1 text-zinc-700">
            {extra.name}: ${(extra.priceCents / 100).toFixed(0)}
          </p>
        ))
      )}
      <Link
        href={`/shop`}
        className="mt-10 inline-block rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Go to Shop Page
      </Link>
    </main>
  );
}
