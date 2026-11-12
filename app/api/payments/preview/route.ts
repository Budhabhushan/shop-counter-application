import { NextResponse } from "next/server";
import { validatePayment } from "@/src/lib/validation";
import { store } from "@/src/lib/store";

export async function POST(request: Request) {
  const body = await request.json();

  const result = validatePayment(body);

  if (!result.success) {
    return NextResponse.json(
      {
        ok: false,
        errors: result.errors,
      },
      { status: 400 },
    );
  }

  const { email, sku, extraCode } = result.data;

  const product = store.getProduct(sku);

  if (!product) {
    return NextResponse.json(
      { ok: false, errors: { sku: "Choose an item" } },
      { status: 400 },
    );
  }

  const extra = product.extras.find((item) => item.code === extraCode);

  const totalCents = product.priceCents + (extra?.priceCents ?? 0);

  const remainingAfter =
    product.remaining === null ? null : product.remaining - 1;

  return NextResponse.json({
    ok: true,
    preview: {
      email,
      sku,
      itemName: product.name,
      extraCode,
      extraName: extra?.name ?? null,
      totalCents,
      remainingAfter,
    },
  });
}
