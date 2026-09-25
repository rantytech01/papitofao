import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-campaign-navy/[0.02]">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6 md:p-8">{children}</div>
    </div>
  );
}
