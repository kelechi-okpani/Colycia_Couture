'use client';

import { useAppDispatch } from '@/app/store/store';
import { fetchReferralStats } from '@/app/store/slices/referralSlice';
import CreateReferralLink from '@/app/components/admin/REF/CreateReferralLink';
import { ReferralDashboardContent } from '@/app/components/admin/Referral';
import { Suspense } from 'react';


export default function ReferralAdminPage() {
  const dispatch = useAppDispatch();

  return (
    <main className="p-8 max-w-8xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tighter mb-2">
          PARTNER NETWORK
        </h1>
        <p className="text-gray-500 font-light text-sm uppercase tracking-widest">
          ADMINISTRATION / ARCHITECTURE
        </p>
      </div>

      {/* When the form succeeds, we trigger the Redux thunk 
         to re-fetch the data automatically. 
      */}
      <CreateReferralLink onSuccess={() => dispatch(fetchReferralStats())} />

      {/* <div className="mt-12">
        <ReferralDashboard />
      </div> */}

          <Suspense fallback={<div>Loading...... </div>}>
              <ReferralDashboardContent />
        </Suspense>
    </main>
  );
}

