"use client";

import { useState } from "react";
import Image from "next/image";
import { addToCart } from "@/lib/cart";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sizes: string[] | null;
}

export function ProductCard({ product }: { product: Product }) {
  const hasSizes = product.sizes && product.sizes.length > 0;
  const [size, setSize] = useState<string | null>(hasSizes ? product.sizes![0] : null);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      size,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-campaign-navy/10 bg-white">
      <div className="relative aspect-square w-full bg-campaign-navy/5">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-campaign-navy/30">No image</div>
        )}
      </div>

      <div className="p-4">
        <p className="font-display text-base font-bold text-campaign-navy">{product.name}</p>
        {product.description && <p className="mt-1 text-sm text-campaign-navy/60">{product.description}</p>}
        <p className="mt-2 text-lg font-extrabold text-campaign-red">KSh {product.price.toLocaleString()}</p>

        {hasSizes && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.sizes!.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${
                  size === s
                    ? "border-campaign-blue bg-campaign-blue/10 text-campaign-blue"
                    : "border-campaign-navy/20 text-campaign-navy/70"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleAdd}
          className="mt-3 w-full rounded-full bg-campaign-navy px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-campaign-blue"
        >
          {added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
