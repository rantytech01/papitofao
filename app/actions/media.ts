"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function recordMediaUpload(input: {
  filename: string;
  url: string;
  storage_path: string;
  type: string;
  category?: string;
  alt_text?: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.from("media_library").insert({
    filename: input.filename,
    url: input.url,
    storage_path: input.storage_path,
    type: input.type,
    category: input.category || null,
    alt_text: input.alt_text || null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function deleteMediaItem(id: string) {
  const supabase = createClient();
  await supabase.from("media_library").delete().eq("id", id);
  revalidatePath("/admin/media");
}
