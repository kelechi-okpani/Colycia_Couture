"use client";
import React, { useState } from 'react';
import { IoLockClosedOutline } from 'react-icons/io5';

interface PaymentHandlerProps {
  items: any[];
  formData: any;
  userId: string | undefined;
  onValidate: () => boolean; // Added validation check
}

export default function PaymentHandler({ items, formData, userId, onValidate }: PaymentHandlerProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    // 1. Trigger the validation logic in the parent
    if (!onValidate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (items.length === 0) return;

    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, formData, userId }),
      });

      console.log(response, "...response")

      const { url, error } = await response.json();

      if (url) {
        window.location.href = url; // Redirect to Stripe
      } else {
        throw new Error(error || "Payment session failed");
      }
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading || items.length === 0}
      className="rounded-lg flex items-center justify-center gap-3 bg-black text-white px-12 py-5 font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] shadow-xl disabled:opacity-30"
    >
      {loading ? "Initializing Secure Payment..." : " Pay Now"}
    </button>
  );
}