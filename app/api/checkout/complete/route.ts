import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { store } from "@/src/lib/store";

export async function POST(request: Request) {
  const body = await request.json();

  const attempt = store.attempts.get(body.attemptId);

  if (!attempt) {
    return NextResponse.json({ error: "invalid_attempt" }, { status: 404 });
  }

  // Return exisitng order for repeated completion.
  const existingOrder = store.orders.get(body.attemptId);

  if (existingOrder) {
    return NextResponse.json(existingOrder);
  }
  const order = {
    orderId: randomUUID(),
    attemptId: attempt.attemptId,
    lines: attempt.lines.map((line) => ({ ...line })),
    amountCents: attempt.amountCents,
  };
  store.orders.set(body.attemptId, order);

  return NextResponse.json(order);
}
