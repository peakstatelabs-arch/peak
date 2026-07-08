"use client";

import Link from "next/link";
import { useCart } from "@/app/lib/CartContext";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="cart-link">
      Cart{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}
