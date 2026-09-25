import { createClient } from "@/lib/supabase/server";
import { SimpleSectionManager } from "@/components/admin/simple-section-manager";
import {
  createCommunitySection,
  updateCommunitySection,
  setCommunityStatus,
  deleteCommunitySection,
} from "@/app/actions/community";

export default async function AdminCommunityPage() {
  const supabase = createClient();
  const { data: items } = await supabase.from("community_sections").select("*").order("display_order");

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Community</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">
        Do not invent community statistics or project achievements — enter only approved content.
      </p>
      <SimpleSectionManager
        items={items ?? []}
        fields={["description", "image_url"]}
        createAction={createCommunitySection}
        updateAction={updateCommunitySection}
        statusAction={setCommunityStatus}
        deleteAction={deleteCommunitySection}
        addFormId="community-add-form"
      />
    </div>
  );
}
