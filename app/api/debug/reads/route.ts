import { NextResponse } from "next/server";
import { store } from "@/src/lib/store";

// export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    catalogReads: store.getReads(),
  });
}
