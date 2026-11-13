import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
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

  const { email, sku, extraCode, externalChargeId } = result.data;

  // Idempotency: return original payment.
  const existing = store.payments.find(
    (payment) => payment.externalChargeId === externalChargeId,
  );

  if (existing) {
    return NextResponse.json(
      { replayed: true, payment: existing },
      { status: 200 },
    );
  }

  const product = store?.getProduct(sku);

  if (!product) {
    return NextResponse.json(
      { ok: false, errors: { sku: "Choose an item" } },
      { status: 400 },
    );
  }

  if (product.remaining !== null && product.remaining <= 0) {
    return NextResponse.json(
      { ok: false, errors: { sku: "Sold out" } },
      { status: 409 },
    );
  }
  const extra = product.extras.find((item) => item.code === extraCode);

  const totalCents = product.priceCents + (extra?.priceCents ?? 0);

  const payment = {
    email,
    sku,
    itemName: product.name,
    extraCode,
    externalChargeId,
    totalCents,
  };

  // Record payment and deduct stock.
  if (product.remaining !== null) {
    product.remaining -= 1;
  }

  store.payments.push(payment);

  // Invalid cached catalogue.
  revalidateTag("catalog", { expire: 0 });

  return NextResponse.json({ replayed: false, payment }, { status: 201 });
}
