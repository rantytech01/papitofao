"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getCart, getCartTotal, updateCartQuantity, clearCart, type CartItem } from "@/lib/cart";
import { submitOrder, type SubmitOrderState } from "@/app/actions/orders";
import { SuccessCelebration } from "@/components/success-celebration";
import { TurnstileWidget } from "@/components/turnstile-widget";

interface Settings {
  mpesa_paybill: string | null;
  mpesa_till: string | null;
  mpesa_account_name: string | null;
  payment_instructions: string | null;
}

export function CheckoutForm({ settings }: { settings: Settings | null }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SubmitOrderState | null>(null);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = getCartTotal(cart);

  function handleQuantityChange(productId: string, size: string | null, quantity: number) {
    updateCartQuantity(productId, size, quantity);
    setCart(getCart());
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await submitOrder(
        cart.map((c) => ({ productId: c.productId, size: c.size, quantity: c.quantity })),
        formData
      );
      setResult(res);
      if (res.status === "success") clearCart();
    });
  }

  if (result?.status === "success") {
    return (
      <SuccessCelebration
        message="Order received! 🎉"
        subMessage={`Order ${result.orderNumber} — we'll confirm your payment and be in touch about delivery.`}
      />
    );
  }

  if (cart.length === 0) {
    return (
      <div className="rounded-xl border border-campaign-navy/10 bg-white p-8 text-center">
        <p className="text-campaign-navy/60">Your cart is empty.</p>
        <Link href="/shop" className="mt-3 inline-block font-semibold text-campaign-blue hover:underline">
          ← Back to the shop
        </Link>
      </div>
    );
  }

  const hasPaymentInfo = settings?.mpesa_paybill || settings?.mpesa_till;

  return (
    <div className="space-y-8">
      {/* Cart summary */}
      <div className="rounded-xl border border-campaign-navy/10 bg-white p-5">
        <p className="mb-3 font-display text-lg font-bold text-campaign-navy">Your Order</p>
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={`${item.productId}-${item.size}`} className="flex items-center justify-between gap-3 text-sm">
              <div>
                <p className="font-medium text-campaign-navy">
                  {item.name} {item.size && <span className="text-campaign-navy/50">({item.size})</span>}
                </p>
                <p className="text-campaign-navy/50">KSh {item.price.toLocaleString()} each</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, item.size, parseInt(e.target.value) || 0)}
                  className="w-16 rounded-md border border-campaign-navy/20 px-2 py-1 text-center text-sm"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-campaign-navy/10 pt-3 font-bold text-campaign-navy">
          <span>Total</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment instructions */}
      <div className="rounded-xl bg-campaign-blue/5 p-5">
        <p className="mb-2 font-display text-lg font-bold text-campaign-navy">1. Pay via M-Pesa</p>
        {hasPaymentInfo ? (
          <div className="space-y-1 text-sm text-campaign-navy/80">
            {settings?.mpesa_paybill && (
              <p>
                <span className="font-semibold">Paybill:</span> {settings.mpesa_paybill}
              </p>
            )}
            {settings?.mpesa_till && (
              <p>
                <span className="font-semibold">Till Number:</span> {settings.mpesa_till}
              </p>
            )}
            {settings?.mpesa_account_name && (
              <p>
                <span className="font-semibold">Account Name:</span> {settings.mpesa_account_name}
              </p>
            )}
            <p>
              <span className="font-semibold">Amount:</span> KSh {total.toLocaleString()}
            </p>
            {settings?.payment_instructions && <p className="mt-2 text-campaign-navy/60">{settings.payment_instructions}</p>}
          </div>
        ) : (
          <p className="text-sm text-campaign-red">
            Payment details haven't been set up yet — an admin needs to add the Paybill/Till number in Site Settings
            before checkout can work.
          </p>
        )}
      </div>

      {/* Buyer details + M-Pesa code */}
      <form action={handleSubmit} className="space-y-4">
        <p className="font-display text-lg font-bold text-campaign-navy">2. Confirm your order</p>

        <input name="buyer_name" required placeholder="Full name" className="checkout-input" />
        <input name="buyer_phone" required placeholder="Phone number" className="checkout-input" />
        <input name="buyer_email" type="email" placeholder="Email (optional)" className="checkout-input" />
        <textarea
          name="delivery_notes"
          placeholder="Delivery address / where to find you (optional)"
          rows={3}
          className="checkout-input"
        />
        <input
          name="mpesa_code"
          required
          placeholder="M-Pesa confirmation code (e.g. QFG7H8X9YZ)"
          className="checkout-input uppercase"
        />

        {/* Honeypot: hidden from real visitors */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="order-website">Website</label>
          <input id="order-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <TurnstileWidget action="order" />

        <button
          type="submit"
          disabled={isPending || !hasPaymentInfo}
          className="w-full rounded-full bg-campaign-red px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
        >
          {isPending ? "Submitting..." : "Submit Order"}
        </button>

        {result?.status === "error" && <p className="text-sm font-medium text-campaign-red">{result.message}</p>}

        <style jsx>{`
          .checkout-input {
            width: 100%;
            border: 1px solid rgba(7, 27, 58, 0.15);
            border-radius: 0.5rem;
            padding: 0.65rem 0.9rem;
            font-size: 0.95rem;
          }
          .checkout-input:focus {
            outline: 2px solid #ed1111;
            outline-offset: 1px;
          }
        `}</style>
      </form>
    </div>
  );
}
