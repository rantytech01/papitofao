"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createNavItem(formData: FormData) {
  const supabase = createClient();
  const { count } = await supabase.from("navigation_items").select("*", { count: "exact", head: true });

  const { error } = await supabase.from("navigation_items").insert({
    label: String(formData.get("label") || ""),
    url: String(formData.get("url") || ""),
    is_external: formData.get("is_external") === "on",
    open_in_new_tab: formData.get("open_in_new_tab") === "on",
    is_visible: true,
    display_order: count ?? 0,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/navigation");
  return { ok: true };
}

export async function updateNavItem(id: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("navigation_items")
    .update({
      label: String(formData.get("label") || ""),
      url: String(formData.get("url") || ""),
      is_external: formData.get("is_external") === "on",
      open_in_new_tab: formData.get("open_in_new_tab") === "on",
    })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin/navigation");
  return { ok: true };
}

export async function toggleNavVisibility(id: string, visible: boolean) {
  const supabase = createClient();
  await supabase.from("navigation_items").update({ is_visible: visible }).eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/navigation");
}

export async function deleteNavItem(id: string) {
  const supabase = createClient();
  await supabase.from("navigation_items").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin/navigation");
}

export async function reorderNavItem(id: string, direction: "up" | "down") {
  const supabase = createClient();
  const { data: items } = await supabase.from("navigation_items").select("id, display_order").order("display_order");
  if (!items) return;

  const index = items.findIndex((i) => i.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;

  const a = items[index];
  const b = items[swapWith];
  await Promise.all([
    supabase.from("navigation_items").update({ display_order: b.display_order }).eq("id", a.id),
    supabase.from("navigation_items").update({ display_order: a.display_order }).eq("id", b.id),
  ]);
  revalidatePath("/");
  revalidatePath("/admin/navigation");
}
