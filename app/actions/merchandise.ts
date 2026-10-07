"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------- products ----------
export async function createProduct(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const price = parseFloat(formData.get("price") as string);
  if (!name || isNaN(price)) return;

  const sizesRaw = (formData.get("sizes") as string)?.trim();
  const sizes = sizesRaw ? sizesRaw.split(",").map((s) => s.trim()).filter(Boolean) : null;

  const supabase = createClient();
  await supabase.from("products").insert({
    name,
    slug: `${slugify(name)}-${Date.now().toString(36)}`,
    description: (formData.get("description") as string) || null,
    price,
    image_url: (formData.get("image_url") as string) || null,
    sizes,
  });

  revalidatePath("/admin/merchandise");
  revalidatePath("/shop");
}

export async function updateProduct(id: string, formData: FormData) {
  const sizesRaw = (formData.get("sizes") as string)?.trim();
  const sizes = sizesRaw ? sizesRaw.split(",").map((s) => s.trim()).filter(Boolean) : null;

  const supabase = createClient();
  await supabase
    .from("products")
    .update({
      name: (formData.get("name") as string)?.trim(),
      description: (formData.get("description") as string) || null,
      price: parseFloat(formData.get("price") as string),
      image_url: (formData.get("image_url") as string) || null,
      sizes,
    })
    .eq("id", id);

  revalidatePath("/admin/merchandise");
  revalidatePath("/shop");
}

export async function toggleProductActive(id: string, is_active: boolean) {
  const supabase = createClient();
  await supabase.from("products").update({ is_active }).eq("id", id);
  revalidatePath("/admin/merchandise");
  revalidatePath("/shop");
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/merchandise");
  revalidatePath("/shop");
}

// ---------- orders ----------
export async function setOrderStatus(id: string, status: "submitted" | "confirmed" | "fulfilled" | "rejected") {
  const supabase = createClient();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
}

export async function setOrderNotes(id: string, admin_notes: string) {
  const supabase = createClient();
  await supabase.from("orders").update({ admin_notes }).eq("id", id);
  revalidatePath("/admin/orders");
}

export async function deleteOrder(id: string) {
  const supabase = createClient();
  await supabase.from("orders").delete().eq("id", id);
  revalidatePath("/admin/orders");
}
