import { createClient } from "@/lib/supabase/server";
import { MessagesInbox } from "@/components/admin/messages-inbox";

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl font-bold text-campaign-navy">Messages</h1>
      <p className="mb-8 text-sm text-campaign-navy/60">Submissions from the public Contact form.</p>
      <MessagesInbox messages={(messages ?? []) as any} />
    </div>
  );
}
