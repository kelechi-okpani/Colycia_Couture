"use client";

import { getPartnerCode, getVisitorId, trackReferralEvent } from "@/app/lib/referrals/referralTracker";
import { useEffect } from "react";

export default function ReferralTracker() {
  useEffect(() => {
    const partnerCode = getPartnerCode();
    if (!partnerCode) return;

    const visitorId = getVisitorId();
    if (!visitorId) return;

    const sessionKey = `ref_tracked_${partnerCode}`;

    const alreadyTracked = sessionStorage.getItem(sessionKey);

    if (alreadyTracked) return;

    sessionStorage.setItem(sessionKey, "true");

    trackReferralEvent({
      eventType: "visit",
    });
  }, []);

  return null;
}


// 'use client';

// import { useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';

// function getCookie(name: string) {
//   if (typeof document === 'undefined') return null;

//   const match = document.cookie.match(
//     new RegExp('(^| )' + name + '=([^;]+)')
//   );

//   return match?.[2] || null;
// }

// function setCookie(name: string, value: string, days: number) {
//   const maxAge = days * 24 * 60 * 60;

//   document.cookie = `${name}=${value}; max-age=${maxAge}; path=/; SameSite=Lax`;
// }

// export default function ReferralTracker() {
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const ref = searchParams.get('ref');

//     if (!ref) return;

//     const cleanRef = ref.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
//     if (!cleanRef) return;

//     // 1. stable visitor id
//     let visitorId = getCookie('colycia_vid');

//     if (!visitorId) {
//       visitorId = crypto.randomUUID();
//       setCookie('colycia_vid', visitorId, 365);
//     }

//     // 2. store referral
//     setCookie('colycia_ref', cleanRef, 90);

//     // 3. IMPORTANT FIX: don't block first visit in dev
//     const sessionKey = `ref_tracked_${cleanRef}`;

//     const alreadyTracked = sessionStorage.getItem(sessionKey);

//     // allow tracking if NOT yet tracked
//     if (!alreadyTracked) {
//       sessionStorage.setItem(sessionKey, 'true');

//       console.log('🔥 Tracking referral visit:', {
//         partnerCode: cleanRef,
//         visitorId,
//       });

//       fetch('/api/referrals', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           partnerCode: cleanRef,
//           visitorId,
//           eventType: 'visit',
//         }),
//       })
//         .then(async (res) => {
//           const data = await res.json();
//           console.log('📊 Referral response:', data);
//         })
//         .catch((err) => {
//           console.error('Referral tracking failed:', err);
//         });
//     }
//   }, [searchParams]);

//   return null;
// }