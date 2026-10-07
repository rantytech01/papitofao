"use server";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, isHoneypotTripped, getRequestIp } from "@/lib/form-protection";
import { verifyTurnstile } from "@/lib/turnstile";

export type SubmitOrderState = {
  status: "idle" | "success" | "error";
  message?: string;
  orderNumber?: string;
};

interface CartItemInput {
  productId: string;
  size: string | null;
  quantity: number;
}

export async function submitOrder(
  cartItems: CartItemInput[],
  formData: FormData
): Promise<SubmitOrderState> {
  if (isHoneypotTripped(formData)) {
    // Pretend success so bots don't learn to leave this field blank.
    return { status: "success", orderNumber: "PAP-0000" };
  }

  if (!cartItems || cartItems.length === 0) {
    return { status: "error", message: "Your cart is empty." };
  }

  const buyer_name = (formData.get("buyer_name") as string)?.trim();
  const buyer_phone = (formData.get("buyer_phone") as string)?.trim();
  const buyer_email = ((formData.get("buyer_email") as string) || "").trim() || null;
  const delivery_notes = ((formData.get("delivery_notes") as string) || "").trim() || null;
  const mpesa_code = (formData.get("mpesa_code") as string)?.trim().toUpperCase();

  if (!buyer_name || !buyer_phone) {
    return { status: "error", message: "Name and phone number are required." };
  }
  if (!mpesa_code) {
    return { status: "error", message: "Please enter the M-Pesa confirmation code from your payment SMS." };
  }

  const rateLimit = await checkRateLimit("order", { deviceMax: 5, ipMax: 15, windowMinutes: 60 });
  if (!rateLimit.allowed) {
    return { status: "error", message: rateLimit.reason };
  }

  const turnstileOk = await verifyTurnstile(formData.get("cf-turnstile-response"), getRequestIp(), {
    expectedAction: "order",
  });
  if (!turnstileOk) {
    return { status: "error", message: "Verification failed. Please try again." };
  }

  const supabase = createClient();

  // Re-fetch real prices server-side — never trust client-supplied prices.
  const productIds = [...new Set(cartItems.map((c) => c.productId))];
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, is_active")
    .in("id", productIds);

  if (productsError || !products) {
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const items: { product_id: string; name: string; price: number; size: string | null; quantity: number }[] = [];
  let total = 0;

  for (const cartItem of cartItems) {
    const product = productMap.get(cartItem.productId);
    if (!product || !product.is_active) {
      return { status: "error", message: "One of the items in your cart is no longer available. Please refresh your cart." };
    }
    const quantity = Math.max(1, Math.min(50, Math.floor(cartItem.quantity)));
    items.push({
      product_id: product.id,
      name: product.name,
      price: product.price,
      size: cartItem.size,
      quantity,
    });
    total += product.price * quantity;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      buyer_name,
      buyer_phone,
      buyer_email,
      delivery_notes,
      items,
      total_amount: total,
      mpesa_code,
    })
    .select("order_number")
    .single();

  if (error || !order) {
    console.error("submitOrder error:", error);
    return { status: "error", message: "Something went wrong submitting your order. Please try again." };
  }

  return { status: "success", orderNumber: order.order_number };
}
