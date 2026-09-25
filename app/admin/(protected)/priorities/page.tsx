import { createClient } from "@/lib/supabase/server";
import { SimpleSectionManager } from "@/components/admin/simple-section-manager";
import { createPriority, updatePriority, setPriorityStatus, deletePriority } from "@/app/actions/priorities";

export default async function AdminPrioritiesPage() {
  const supabase = createClient();
  const { data: items } = await supabase.from("priorities").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Priorities</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Example categories: Youth, Education, Healthcare, Infrastructure. Do not publish unapproved claims.
      </p>
      <SimpleSectionManager
        items={items ?? []}
        fields={["category", "short_description", "full_description", "image_url", "icon"]}
        createAction={createPriority}
        updateAction={updatePriority}
        statusAction={setPriorityStatus}
        deleteAction={deletePriority}
        addFormId="priorities-add-form"
      />
    </div>
  );
}
