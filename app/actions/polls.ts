"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ---------- public: cast a vote ----------
export async function castVote(pollId: string, optionId: string, voterToken: string) {
  const supabase = createClient();

  const { error } = await supabase.from("poll_votes").insert({
    poll_id: pollId,
    option_id: optionId,
    voter_token: voterToken,
  });

  if (error) {
    // Unique constraint violation = this device already voted on this poll.
    if (error.code === "23505") {
      return { status: "error" as const, message: "This device has already voted on this poll." };
    }
    return { status: "error" as const, message: "Something went wrong. Please try again." };
  }

  revalidatePath("/polls");
  return { status: "success" as const };
}

export async function getPollResults(pollId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_poll_results", { p_poll_id: pollId });
  if (error) return [];
  return data as { option_id: string; label: string; votes: number }[];
}

// ---------- admin: manage polls ----------
export async function createPoll(formData: FormData) {
  const question = (formData.get("question") as string)?.trim();
  if (!question) return;

  const supabase = createClient();
  await supabase.from("polls").insert({ question });

  revalidatePath("/admin/polls");
}

export async function setPollStatus(id: string, status: "draft" | "active" | "closed") {
  const supabase = createClient();
  const { error } = await supabase.from("polls").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/polls");
  revalidatePath("/polls");
}

export async function deletePoll(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("polls").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/polls");
  revalidatePath("/polls");
}

export async function addPollOption(pollId: string, label: string) {
  if (!label.trim()) return;

  const supabase = createClient();
  await supabase.from("poll_options").insert({ poll_id: pollId, label: label.trim() });

  revalidatePath("/admin/polls");
  revalidatePath("/polls");
}

export async function deletePollOption(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("poll_options").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/polls");
  revalidatePath("/polls");
}
