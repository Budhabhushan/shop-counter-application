import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Shop Counter Application</title>
      </head>
      <body className="flex min-h-screen flex-col">
        <header
          style={{
            padding: 12,
            background: "#23201d",
            marginTop: "5px",
            marginBottom: "5px",
          }}
        >
          <nav style={{ display: "flex", gap: 12, color: "white" }}>
            <Link href="/shop">Shop</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/desk">Staff Desk</Link>
          </nav>
        </header>
        <div className="flex-1">{children}</div>
        <footer
          style={{ padding: 12, background: "#23201d" }}
          className="text-white"
        >
          My Footer
        </footer>
      </body>
    </html>
  );
}
