/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";

const products = [
  { sku: "notebook", name: "Field notebook", price: 1500 },
  { sku: "pen", name: "Gel pen", price: 400 },
  { sku: "case", name: "Slip case", price: 2200 },
];
type Line = {
  sku: string;
  qty: number;
};

type Snapshot = {
  attemptId: string;
  lines: {
    sku: string;
    name: string;
    unitPriceCents: number;
    qty: number;
  }[];
  amountCents: number;
};

export default function Cart() {
  const [cart, setCart] = useState<Line[]>([]);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const total = useMemo(() => {
    return cart.reduce((sum, line) => {
      const product = products.find((item) => item.sku === line.sku);

      return sum + (product?.price ?? 0) * line.qty;
    }, 0);
  }, [cart]);

  function addItem(sku: string) {
    setCart((prev) => {
      const existing = prev.find((item) => item.sku === sku);

      if (existing) {
        return prev.map((item) =>
          item.sku === sku ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { sku, qty: 1 }];
    });
  }

  function changeQty(sku: string, amount: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.sku === sku ? { ...item, qty: item.qty + amount } : item,
        )
        .filter((item) => item.qty > 0),
    );
  }

  function removeItem(sku: string) {
    setCart((prev) => prev.filter((item) => item.sku !== sku));
  }

  async function pay() {
    setError("");
    if (cart.length === 0) {
      setError("Add an item before paying");
      return;
    }

    const response = await fetch("/api/checkout/begin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: cart.map((item) => ({
          ...item,
          unitPriceCents: 1,
        })),
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError("Unable to begin payment");
      return;
    }
    setSnapshot(data);
    setOrder(null);
  }

  async function completePayment() {
    if (!snapshot) return;

    const response = await fetch("/api/checkout/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId: snapshot.attemptId }),
    });
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      setError("Unable to complete payment");
      return;
    }
    setOrder(data);
  }

  const cartChanged = snapshot
    ? JSON.stringify([...cart].sort((a, b) => a.sku.localeCompare(b.sku))) !==
      JSON.stringify(
        [...snapshot.lines]
          .map((line) => ({
            sku: line.sku,
            qty: line.qty,
          }))
          .sort((a, b) => a.sku.localeCompare(b.sku)),
      )
    : false;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-bold">Products</h2>
        {products.map((product) => {
          const line = cart.find((item) => item.sku === product.sku);
          return (
            <div
              key={product.sku}
              className="flex items-center justify-between border-b py-4"
            >
              <div>
                <p>{product.name}</p>
                <p>${product.price / 100}</p>
              </div>
              <button
                onClick={() => addItem(product.sku)}
                className="rounded bg-blue-600 px-4 py-2 text-white ml-60"
                aria-label="Add"
              >
                Add
              </button>
              {line && (
                <div className="flex items-center gap-2">
                  <button
                    aria-label={`Decrease ${product.name}`}
                    onClick={() => changeQty(product.sku, 1)}
                  >
                    -
                  </button>
                  <span>{line.qty}</span>
                  <button
                    aria-label={`Increase ${product.name}`}
                    onClick={() => changeQty(product.sku, 1)}
                  >
                    +
                  </button>
                  <button onClick={() => removeItem(product.sku)}>
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </section>
      <section>
        <h2 className="font-bold">Cart Total</h2>
        <p>${total / 100}</p>
      </section>
      <button
        onClick={pay}
        className="rounded bg-blue-600 py-2 text-white w-100"
      >
        Pay
      </button>
      {error && <p role="alert"> {error}</p>}
      {snapshot && (
        <section
          aria-label="Payment in progress"
          className="rounded-xl border p-5"
        >
          <h2 className="text-xl font-bold">Payment in porgress</h2>
          {snapshot.lines.map((line) => (
            <p key={line.sku}>
              {line.name} × {line.qty}
            </p>
          ))}
          <h3 className="mt-4 font-bold"> Amount due</h3>
          <p>${snapshot.amountCents / 100}</p>

          {cartChanged && (
            <p role="status">
              Your cart changed after payment started. You will be charged the
              amount below.
            </p>
          )}
          <button
            onClick={completePayment}
            className="mt-4 rounded bg-green-600 px-5 py-2 text-white"
          >
            Complete payment
          </button>
        </section>
      )}
      {order && (
        <section className="rounded-xl border p-5">
          <h2 className="text-2xl font-bold">Order placed</h2>
          {order.lines.map((line: any) => (
            <p key={line.sku}>
              {line.name} x {line.qty}
            </p>
          ))}
          <h3 className="font-bold">Amount charged</h3>
          <p>${order.amountCents / 100}</p>
        </section>
      )}
    </div>
  );
}
