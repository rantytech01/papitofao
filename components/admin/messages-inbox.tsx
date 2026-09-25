"use client";

import { useTransition } from "react";
import { Trash2, Mail, MailOpen, Archive } from "lucide-react";
import { setMessageStatus, deleteMessage } from "@/app/actions/messages";

interface Message {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  subject: string | null;
  message: string;
  status: "unread" | "read" | "archived";
  created_at: string;
}

export function MessagesInbox({ messages }: { messages: Message[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card">
      {messages.length === 0 ? (
        <p className="text-sm text-campaign-navy/50">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-lg border p-4 ${m.status === "unread" ? "border-campaign-blue/30 bg-campaign-blue/[0.03]" : "border-campaign-navy/10"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-campaign-navy">
                    {m.name} {m.subject && <span className="text-campaign-navy/50">— {m.subject}</span>}
                  </p>
                  <p className="text-xs text-campaign-navy/50">
                    {[m.phone, m.email].filter(Boolean).join(" · ")} · {new Date(m.created_at).toLocaleString("en-KE")}
                  </p>
                  <p className="mt-2 text-sm text-campaign-navy/80">{m.message}</p>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  {m.status !== "read" && (
                    <button onClick={() => startTransition(() => setMessageStatus(m.id, "read"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue" title="Mark read">
                      <MailOpen size={16} />
                    </button>
                  )}
                  {m.status !== "unread" && (
                    <button onClick={() => startTransition(() => setMessageStatus(m.id, "unread"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue" title="Mark unread">
                      <Mail size={16} />
                    </button>
                  )}
                  {m.status !== "archived" && (
                    <button onClick={() => startTransition(() => setMessageStatus(m.id, "archived"))} className="p-1.5 text-campaign-navy/60 hover:text-campaign-blue" title="Archive">
                      <Archive size={16} />
                    </button>
                  )}
                  <button onClick={() => { if (confirm("Delete this message?")) startTransition(() => deleteMessage(m.id)); }} className="p-1.5 text-campaign-red/70 hover:text-campaign-red">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
