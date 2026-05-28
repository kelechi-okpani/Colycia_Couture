'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ReferralTracker() {
  const searchParams = useSearchParams();
  const trackedRef = useRef(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    
    if (ref && !trackedRef.current) {
      trackedRef.current = true;

      // Persist targeting code securely for 30 days
      document.cookie = `colycia_ref=${ref}; max-age=${30 * 24 * 60 * 60}; path=/; Secure; SameSite=Lax`;
      
      // Dispatch database logging query completely decoupled from state
      fetch('/api/referrals/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerCode: ref, eventType: 'visit' }),
      }).catch(err => console.error("Referral tracking payload execution failed:", err));
    }
  }, [searchParams]);

  return null;
}