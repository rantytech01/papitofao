import { createClient } from "@/lib/supabase/server";
import { SimpleSectionManager } from "@/components/admin/simple-section-manager";
import { createVisionSection, updateVisionSection, setVisionStatus, deleteVisionSection } from "@/app/actions/vision";

export default async function AdminVisionPage() {
  const supabase = createClient();
  const { data: items } = await supabase.from("vision_sections").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Vision</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Add vision statements. Use neutral placeholders until the campaign provides approved content.
      </p>
      <SimpleSectionManager
        items={items ?? []}
        fields={["title", "description", "image_url", "icon"]}
        createAction={createVisionSection}
        updateAction={updateVisionSection}
        statusAction={setVisionStatus}
        deleteAction={deleteVisionSection}
        addFormId="vision-add-form"
      />
    </div>
  );
}
