"use client";

import { useState, useTransition } from "react";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { createProduct, updateProduct, toggleProductActive, deleteProduct } from "@/app/actions/merchandise";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  sizes: string[] | null;
  is_active: boolean;
}

function ProductRow({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="border-b border-campaign-navy/10 py-3">
      <div className="flex items-center justify-between">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 text-left">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className="font-medium text-campaign-navy">{product.name}</span>
          <span className="text-sm text-campaign-navy/50">KSh {product.price.toLocaleString()}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              product.is_active ? "bg-green-100 text-green-700" : "bg-campaign-navy/10 text-campaign-navy/60"
            }`}
          >
            {product.is_active ? "active" : "hidden"}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startTransition(() => toggleProductActive(product.id, !product.is_active))}
            className="admin-btn-secondary px-2 py-1 text-xs"
          >
            {product.is_active ? "Hide" : "Show"}
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this product?")) startTransition(() => deleteProduct(product.id));
            }}
            className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {open && (
        <form
          action={(fd) => startTransition(async () => { await updateProduct(product.id, fd); })}
          className="mt-4 grid gap-3 rounded-lg bg-campaign-navy/[0.02] p-4 sm:grid-cols-2"
        >
          <div>
            <label className="admin-label">Name</label>
            <input name="name" defaultValue={product.name} className="admin-field" />
          </div>
          <div>
            <label className="admin-label">Price (KSh)</label>
            <input name="price" type="number" step="0.01" defaultValue={product.price} className="admin-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">Description</label>
            <textarea name="description" defaultValue={product.description ?? ""} rows={2} className="admin-field" />
          </div>
          <div>
            <label className="admin-label">Image URL</label>
            <input name="image_url" defaultValue={product.image_url ?? ""} className="admin-field" />
          </div>
          <div>
            <label className="admin-label">Sizes (comma-separated, optional)</label>
            <input name="sizes" defaultValue={(product.sizes ?? []).join(", ")} placeholder="S, M, L, XL" className="admin-field" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={isPending} className="admin-btn-primary">Save Product</button>
          </div>
        </form>
      )}
    </div>
  );
}

export function ProductsManager({ products }: { products: Product[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      <form
        action={(fd) => startTransition(async () => {
          await createProduct(fd);
          (document.getElementById("product-add-form") as HTMLFormElement)?.reset();
        })}
        id="product-add-form"
        className="mb-6 grid gap-2 border-b border-campaign-navy/10 pb-6 sm:grid-cols-2"
      >
        <input name="name" placeholder="Product name" required className="admin-field" />
        <input name="price" type="number" step="0.01" placeholder="Price (KSh)" required className="admin-field" />
        <input name="image_url" placeholder="Image URL" className="admin-field" />
        <input name="sizes" placeholder="Sizes: S, M, L, XL (optional)" className="admin-field" />
        <textarea name="description" placeholder="Description" className="admin-field sm:col-span-2" rows={2} />
        <button type="submit" disabled={isPending} className="admin-btn-primary sm:col-span-2 w-fit">+ Add Product</button>
      </form>

      {products.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No products yet.</p>
      ) : (
        <div>{products.map((p) => <ProductRow key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
