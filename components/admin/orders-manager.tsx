"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { setOrderStatus, deleteOrder } from "@/app/actions/merchandise";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  size: string | null;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  delivery_notes: string | null;
  items: OrderItem[];
  total_amount: number;
  mpesa_code: string;
  status: "submitted" | "confirmed" | "fulfilled" | "rejected";
  created_at: string;
}

const statusColors: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-700",
  confirmed: "bg-campaign-blue/10 text-campaign-blue",
  fulfilled: "bg-green-100 text-green-700",
  rejected: "bg-campaign-red/10 text-campaign-red",
};

export function OrdersManager({ orders }: { orders: Order[] }) {
  const [isPending, startTransition] = useTransition();

  if (orders.length === 0) {
    return <p className="text-sm text-campaign-navy/50">No orders yet.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="admin-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-campaign-navy">
                {o.order_number}{" "}
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[o.status]}`}>
                  {o.status}
                </span>
              </p>
              <p className="text-xs text-campaign-navy/50">
                {o.buyer_name} · {o.buyer_phone}
                {o.buyer_email ? ` · ${o.buyer_email}` : ""} · {new Date(o.created_at).toLocaleString("en-KE")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                defaultValue={o.status}
                onChange={(e) => startTransition(() => setOrderStatus(o.id, e.target.value as any))}
                className="admin-field w-auto text-xs"
              >
                <option value="submitted">Submitted</option>
                <option value="confirmed">Confirmed</option>
                <option value="fulfilled">Fulfilled</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => {
                  if (confirm("Delete this order?")) startTransition(() => deleteOrder(o.id));
                }}
                className="p-1.5 text-campaign-red/70 hover:text-campaign-red"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-campaign-navy/[0.02] p-3 text-sm">
            {o.items.map((item, i) => (
              <p key={i} className="text-campaign-navy/80">
                {item.quantity}× {item.name} {item.size && `(${item.size})`} — KSh{" "}
                {(item.price * item.quantity).toLocaleString()}
              </p>
            ))}
            <p className="mt-1 font-bold text-campaign-navy">Total: KSh {o.total_amount.toLocaleString()}</p>
          </div>

          <p className="mt-2 text-sm">
            <span className="font-semibold text-campaign-navy">M-Pesa code to verify:</span>{" "}
            <span className="rounded bg-amber-50 px-2 py-0.5 font-mono font-bold text-amber-800">{o.mpesa_code}</span>
          </p>

          {o.delivery_notes && (
            <p className="mt-2 text-sm text-campaign-navy/70">
              <span className="font-semibold">Delivery notes:</span> {o.delivery_notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
