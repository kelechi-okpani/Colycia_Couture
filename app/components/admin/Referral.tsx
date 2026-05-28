'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchReferralStats } from '@/app/store/slices/referralSlice';

// --- 1. INNER COMPONENT (Data & Layout) ---
export function ReferralDashboardContent() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.referrals);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  console.log(data, "data...")

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReferralStats());
    }
  }, [status, dispatch]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const copyToClipboard = (partnerCode: string) => {
    if (typeof window !== 'undefined') {
      const fullUrl = `${window.location.origin}/?ref=${partnerCode}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedCode(partnerCode);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  if (status === 'failed') {
    return (
      <div className="max-w-7xl mx-auto p-4 border border-red-200 bg-red-50/50 rounded-sm text-xs font-medium tracking-wide text-red-800 uppercase">
        Error loading performance architecture: {error}
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 uppercase">
            REFERRAL PERFORMANCE
          </h1>
          <p className="text-gray-500 font-light text-sm">
            Monitor traffic metrics, customer conversions, and cumulative brand revenue.
          </p>
        </div>

        {/* METRIC PILL */}
        <div className="mt-4 md:mt-0 inline-flex items-center bg-white border border-gray-200 px-4 py-2 rounded-sm shadow-sm">
          <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mr-2">
            Total Active Partners:
          </span>
          <span className="text-xs font-bold text-gray-900 tracking-wider">
            {data.length}
          </span>
        </div>
      </div>

      {/* LUXURY DATA TABLE */}
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-8 py-4 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Partner / Network Architecture
                </th>
                <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Commission
                </th> 
                 <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Visits
                </th>
                <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Inquiries
                </th>
                <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Bookings
                </th>
                <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Conversion
                </th>
                <th scope="col" className="px-8 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 mb-4 text-gray-300">
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 font-light italic text-sm">
                        No active referral performance records data found.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.map((row) => {
                  const fullUrl = typeof window !== 'undefined' 
                    ? `${window.location.origin}/?ref=${row.partnerCode}` 
                    : `/?ref=${row.partnerCode}`;

                  return (
                    <tr key={row.partnerCode} className="hover:bg-gray-50/80 transition-colors">
                      {/* Partner Info & Integrated Shared Link */}
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="font-semibold text-gray-900 tracking-wide text-xs uppercase mb-1.5">
                          {row.partnerName}
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-[10px] text-gray-500 font-mono bg-gray-50 px-2 py-0.5 rounded-sm border border-gray-200/60 max-w-[260px] truncate select-all">
                            {fullUrl}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(row.partnerCode)}
                            className="text-[9px] font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 hover:bg-gray-50 px-2 py-0.5 rounded-sm transition-all"
                          >
                            {copiedCode === row.partnerCode ? 'COPIED' : 'COPY'}
                          </button>
                        </div>
                      </td>
                      
                      {/* Metrics */}
                    
                      <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-mono font-medium text-gray-800 tracking-wider">
                           {row?.commissionRate.toLocaleString()}%
                      </td>
                       <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-medium text-gray-800 tracking-wider">
                        {row.visitors.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-medium text-gray-800 tracking-wider">
                        {row.inquiries.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-medium text-gray-800 tracking-wider">
                        {row.bookings.toLocaleString()}
                      </td>
                      
                      {/* Rates */}
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="text-xs font-bold text-gray-900 tracking-wider">
                          {row.bookingConvRate.toFixed(2)}%
                        </div>
                        <div className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-0.5">
                          Bookings
                        </div>
                      </td>
                      
                      {/* Financials */}
                      <td className="px-8 py-5 whitespace-nowrap text-right text-xs font-bold text-gray-900 tracking-widest">
                        {formatCurrency(row.totalRevenue)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- 2. SKELETON COMPONENT (Matches exact UI structure perfectly) ---
export function ReferralDashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded-sm mb-3" />
          <div className="h-4 w-96 bg-gray-100 rounded-sm" />
        </div>
        <div className="h-9 w-44 bg-gray-200 rounded-sm mt-4 md:mt-0" />
      </div>

      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
        <div className="h-12 bg-gray-50 border-b border-gray-200" />
        <div className="p-8 space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded-sm" />
                <div className="h-3 w-20 bg-gray-100 rounded-sm" />
              </div>
              <div className="flex gap-12">
                <div className="h-4 w-12 bg-gray-100 rounded-sm" />
                <div className="h-4 w-12 bg-gray-100 rounded-sm" />
                <div className="h-4 w-16 bg-gray-200 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 'use client';
// import { useEffect, Suspense } from 'react';
// import { useAppDispatch, useAppSelector } from '@/app/store/store';
// import { fetchReferralStats } from '@/app/store/slices/referralSlice';

// // --- 1. INNER COMPONENT (Data & Layout) ---
// export  function ReferralDashboardContent() {
//   const dispatch = useAppDispatch();
//   const { data, status, error } = useAppSelector((state) => state.referrals);

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchReferralStats());
//     }
//   }, [status, dispatch]);

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD',
//     }).format(amount);
//   };

//   if (status === 'failed') {
//     return (
//       <div className="max-w-7xl mx-auto p-4 border border-red-200 bg-red-50/50 rounded-sm text-xs font-medium tracking-wide text-red-800 uppercase">
//         Error loading performance architecture: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-8xl mx-auto">
//       {/* PAGE HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2 uppercase">
//             REFERRAL PERFORMANCE
//           </h1>
//           <p className="text-gray-500 font-light text-sm">
//             Monitor traffic metrics, customer conversions, and cumulative brand revenue.
//           </p>
//         </div>

//         {/* METRIC PILL */}
//         <div className="mt-4 md:mt-0 inline-flex items-center bg-white border border-gray-200 px-4 py-2 rounded-sm shadow-sm">
//           <span className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mr-2">
//             Total Active Partners:
//           </span>
//           <span className="text-xs font-bold text-gray-900 tracking-wider">
//             {data.length}
//           </span>
//         </div>
//       </div>

//       {/* LUXURY DATA TABLE */}
//       <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 text-left">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-8 py-4 text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
//                   Partner / Network
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
//                   Visits
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
//                   Inquiries
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
//                   Bookings
//                 </th>
//                 <th scope="col" className="px-6 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
//                   Conversion
//                 </th>
//                 <th scope="col" className="px-8 py-4 text-right text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
//                   Revenue
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 bg-white">
//               {data.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-8 py-32 text-center">
//                     <div className="flex flex-col items-center justify-center">
//                       <div className="w-12 h-12 mb-4 text-gray-300">
//                         <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                       </div>
//                       <p className="text-gray-400 font-light italic text-sm">
//                         No active referral performance records data found.
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 data.map((row) => (
//                   <tr key={row.partnerCode} className="hover:bg-gray-50/80 transition-colors">
//                     {/* Partner Info */}
//                     <td className="px-8 py-5 whitespace-nowrap">
//                       <div className="font-semibold text-gray-900 tracking-wide text-xs uppercase">
//                         {row.partnerName}
//                       </div>
//                       <div className="text-[11px] text-gray-400 font-mono mt-1 lowercase">
//                         ?ref={row.partnerCode}
//                       </div>
//                     </td>
                    
//                     {/* Metrics */}
//                     <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-medium text-gray-800 tracking-wider">
//                       {row.visitors.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-medium text-gray-800 tracking-wider">
//                       {row.inquiries.toLocaleString()}
//                     </td>
//                     <td className="px-6 py-5 whitespace-nowrap text-right text-xs font-medium text-gray-800 tracking-wider">
//                       {row.bookings.toLocaleString()}
//                     </td>
                    
//                     {/* Rates */}
//                     <td className="px-6 py-5 whitespace-nowrap text-right">
//                       <div className="text-xs font-bold text-gray-900 tracking-wider">
//                         {row.bookingConvRate.toFixed(2)}%
//                       </div>
//                       <div className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase mt-0.5">
//                         Bookings
//                       </div>
//                     </td>
                    
//                     {/* Financials */}
//                     <td className="px-8 py-5 whitespace-nowrap text-right text-xs font-bold text-gray-900 tracking-widest">
//                       {formatCurrency(row.totalRevenue)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// // --- 2. SKELETON COMPONENT (Matches exact UI structure perfectly) ---
// export  function ReferralDashboardSkeleton() {
//   return (
//     <div className="max-w-7xl mx-auto animate-pulse">
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
//         <div>
//           <div className="h-8 w-64 bg-gray-200 rounded-sm mb-3" />
//           <div className="h-4 w-96 bg-gray-100 rounded-sm" />
//         </div>
//         <div className="h-9 w-44 bg-gray-200 rounded-sm mt-4 md:mt-0" />
//       </div>

//       <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
//         <div className="h-12 bg-gray-50 border-b border-gray-200" />
//         <div className="p-8 space-y-6">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-5 last:border-0 last:pb-0">
//               <div className="space-y-2">
//                 <div className="h-4 w-32 bg-gray-200 rounded-sm" />
//                 <div className="h-3 w-20 bg-gray-100 rounded-sm" />
//               </div>
//               <div className="flex gap-12">
//                 <div className="h-4 w-12 bg-gray-100 rounded-sm" />
//                 <div className="h-4 w-12 bg-gray-100 rounded-sm" />
//                 <div className="h-4 w-16 bg-gray-200 rounded-sm" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

