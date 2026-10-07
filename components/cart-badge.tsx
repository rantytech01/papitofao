"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCart, getCartCount, onCartChange } from "@/lib/cart";

export function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getCartCount(getCart()));
    update();
    return onCartChange(update);
  }, []);

  if (count === 0) return null;

  return (
    <Link
      href="/shop/checkout"
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-campaign-red px-5 py-3 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
    >
      🛒 {count} item{count === 1 ? "" : "s"} · Checkout
    </Link>
  );
}
