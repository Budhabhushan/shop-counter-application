import Link from "next/link";
import { notFound } from "next/navigation";
import { getCatalog } from "@/src/lib/catalog";

interface Props {
  params: Promise<{ sku: string }>;
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
    <main className="mx-auto max-w-3xl p-20 border-2 mt-10">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="mt-4">Price: ${(product.priceCents / 100).toFixed(0)}</p>
      <p>
        {product.remaining === null
          ? "Not stock-limited"
          : `${product.remaining} left`}
      </p>
      <h2 className="mt-5 font-semibold">Extras</h2>
      {product.extras.length === 0 ? (
        <p className="mb-10">None</p>
      ) : (
        product.extras.map((extra) => (
          <p key={extra.code} className="mb-10">
            {extra.name}: ${(extra.priceCents / 100).toFixed(0)}
          </p>
        ))
      )}
      <Link href={`/shop`} className="mt-10">
        Go to Shop Page
      </Link>
    </main>
  );
}
