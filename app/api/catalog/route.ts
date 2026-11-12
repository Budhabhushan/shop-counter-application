import { NextResponse } from "next/server";
import { store } from "@/src/lib/store";

export const dynamic = "dynamic-items";

export async function GET() {
  const products = store.getProducts();

  return NextResponse.json(products, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
