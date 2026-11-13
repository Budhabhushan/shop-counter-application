import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { store } from "@/src/lib/store";
import type { CheckoutLine } from "@/src/lib/types";

export async function POST(request: Request) {
  const body = await request.json();
  if (!Array.isArray(body.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "invalid_cart" }, { status: 400 });
  }

  const lines: CheckoutLine[] = [];

  for (const line of body.lines) {
    if (
      !line ||
      typeof line.sku !== "string" ||
      !Number.isInteger(line.qty) ||
      line.qty < 1
    ) {
      return NextResponse.json({ error: "invalid_cart" }, { status: 400 });
    }
    const product = store.getProduct(line.sku);
    if (!product || !["notebook", "pen", "case"].includes(product.sku)) {
      return NextResponse.json({ error: "invalid_cart" }, { status: 400 });
    }

    lines.push({
      sku: product.sku,
      name: product.name,
      unitPriceCents: product.priceCents,
      qty: line.qty,
    });
  }

  const amountCents = lines.reduce(
    (total, line) => total + line.unitPriceCents * line.qty,
    0,
  );
  const attempt = {
    attemptId: randomUUID(),
    lines,
    amountCents,
  };

  // Save a server-side snapshot.
  store.attempts.set(attempt.attemptId, attempt);
  return NextResponse.json(attempt);
}
