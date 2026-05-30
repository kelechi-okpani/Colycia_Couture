"use client";

/* ----------------------------------
   COOKIE HELPERS
---------------------------------- */
function getCookie(name: string) {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp("(^| )" + name + "=([^;]+)")
  );

  return match?.[2] || null;
}

function setCookie(name: string, value: string, days: number) {
  const maxAge = days * 24 * 60 * 60;

  document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

/* ----------------------------------
   VISITOR ID
---------------------------------- */
export function getVisitorId() {
  if (typeof window === "undefined") return null;

  let visitorId = getCookie("colycia_vid");

  if (!visitorId) {
    visitorId = crypto.randomUUID();
    setCookie("colycia_vid", visitorId, 365);
  }

  return visitorId;
}

/* ----------------------------------
   PARTNER CODE
---------------------------------- */
export function getPartnerCode() {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (!ref) return null;

  return ref.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
}

/* ----------------------------------
   CLIENT TRACKER (HTTP ONLY)
---------------------------------- */
export async function trackReferralEvent(data: {
  eventType: "visit" | "product_view" | "add_to_cart" | "checkout" | "purchase";
  partnerCode?: string;
  visitorId?: string;
  revenue?: number;
  orderId?: string;
  metadata?: any;
}) {
  try {
    const visitorId = data.visitorId || getVisitorId();
    const partnerCode = data.partnerCode || getPartnerCode();

    if (!visitorId || !partnerCode) return;

    await fetch("/api/referrals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partnerCode,
        visitorId,
        eventType: data.eventType,
        revenue: data.revenue ?? 0,
        orderId: data.orderId,
        metadata: data.metadata ?? {},
      }),
    });
  } catch (err) {
    console.error("Referral tracking failed:", err);
  }
}

/* -------------------------
   CONVENIENCE HELPERS
-------------------------- */

export const trackVisit = () =>
  trackReferralEvent({
    eventType: "visit",
  });

export const trackProductView = (
  productId: string,
  product?: any
) =>
  trackReferralEvent({
    eventType: "product_view",
    metadata: {
      productId,
      name: product?.name,
      price: product?.price,
    },
  });

export const trackAddToCart = (
  productId: string,
  product?: any
) =>
  trackReferralEvent({
    eventType: "add_to_cart",
    metadata: {
      productId,
      name: product?.name,
      price: product?.price,
    },
  });

export const trackCheckout = (
  orderId: string
) =>
  trackReferralEvent({
    eventType: "checkout",
    orderId,
  });

export const trackPurchase = (
  orderId: string,
  revenue: number
) =>
  trackReferralEvent({
    eventType: "purchase",
    orderId,
    revenue,
  });