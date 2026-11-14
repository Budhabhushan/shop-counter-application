import type { ReactNode } from "react";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Shop Counter Application</title>
      </head>
      <body>
        <header
          style={{
            padding: 12,
            background: "#23201d",
            marginTop: "5px",
            marginBottom: "5px",
          }}
        >
          <nav style={{ display: "flex", gap: 12 }}>
            <Link href="/shop">Shop</Link>
            <Link href="/checkout">Checkout</Link>
            <Link href="/desk">Staff Desk</Link>
          </nav>
        </header>
        {children}
        <footer style={{ padding: 12, background: "#23201d" }}>
          My Footer
        </footer>
      </body>
    </html>
  );
}
