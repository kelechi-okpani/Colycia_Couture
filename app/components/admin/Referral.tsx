'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchReferralStats } from '@/app/store/slices/referralSlice';
import { IoTimeOutline } from 'react-icons/io5';
import Pagination from '../ui/Pagination';

export function ReferralDashboardContent() {
  const dispatch = useAppDispatch();
  const { data = [], status, error } = useAppSelector(
    (state) => state.referrals
  );
    const [page, setPage] = useState(1);
    const limit = 10;
   const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchReferralStats());
    }
  }, [status, dispatch]);


  const totalPages = Math.ceil(data.length / limit);
  const paginatedOrders = data.slice(
    (page - 1) * limit,
    page * limit
  );


  const formatCurrency = (amount?: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount ?? 0);
  };

  const copyToClipboard = (partnerCode: string) => {
    if (typeof window === 'undefined') return;

    const fullUrl = `${window.location.origin}/?ref=${partnerCode}`;
    navigator.clipboard.writeText(fullUrl);

    setCopiedCode(partnerCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (status === 'failed') {
    return (
      <div className="max-w-7xl mx-auto p-4 border border-red-200 bg-red-50/50 rounded-sm text-xs font-medium text-red-800 uppercase">
        Error loading referral data: {error}
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase">
            REFERRAL PERFORMANCE
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor traffic metrics and revenue.
          </p>
        </div>

        <div className="mt-4 md:mt-0 inline-flex items-center bg-white border px-4 py-2">
          <span className="text-[11px] uppercase text-gray-400 mr-2">
            Total Partners:
          </span>
          <span className="text-xs font-bold text-gray-900">
            {data.length}
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left ">
          <thead className="bg-gray-200 font-bold">
      <tr>
        <th className="px-8 py-4 text-[11px] uppercase text-gray-400">
          Partner
        </th>

        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          commission Rate%
        </th> 
        
        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Visits
        </th>

        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Product Views
        </th>

        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Cart
        </th>

        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Checkouts
        </th>

        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Purchases
        </th>

   <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
      visit To Cart Rate %
    </th>

   <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
     cart To Checkout Rate % 
    </th>

  <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
     checkout To Purchase Rate % 
    </th>



        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Revenue
        </th>

        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Commission
        </th>

        <th className="px-6 py-4 text-right text-[11px] uppercase text-gray-400">
          Conversion
        </th>
      </tr>
            </thead>

            <tbody className="divide-y">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-gray-400">
                    No referral data found
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((row:any) => (
                // data.map((row:any) => (
                  <tr key={row.partnerCode} className="hover:bg-gray-100 cursor-pointer">
                    {/* Partner */}
                    <td className="px-8 py-5">
                      <div className="text-xs font-semibold uppercase">
                        {row.partnerName ?? 'Unknown'}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-[10px] text-gray-500">
                          {`${window.location.origin}/?ref=${row.partnerCode}`}
                        </code>

                        <button
                          onClick={() => copyToClipboard(row.partnerCode)}
                          className="text-[10px] uppercase text-gray-400 cursor-pointer"
                        >
                          {copiedCode === row.partnerCode
                            ? 'Copied'
                            : 'Copy'}
                        </button>
                      </div>
                    </td>
<td className="px-6 py-5 text-right text-xs">
  {row.commissionRate}%
</td>

<td className="px-6 py-5 text-right text-xs">
  {row.visits}
</td>

<td className="px-6 py-5 text-right text-xs">
  {row.productViews}
</td>

<td className="px-6 py-5 text-right text-xs">
  {row.addToCart}
</td>

<td className="px-6 py-5 text-right text-xs">
  {row.checkouts}
</td>

<td className="px-6 py-5 text-right text-xs font-medium">
  {row.purchases}
</td>

<td className="px-6 py-5 text-right text-xs font-medium">
  {Number(row.visitToCartRate || 0).toFixed(2)}%
</td>

<td className="px-6 py-5 text-right text-xs font-medium">
  {Number(row.cartToCheckoutRate || 0).toFixed(2)}%
</td>

<td className="px-6 py-5 text-right text-xs font-medium">
  {Number(row.checkoutToPurchaseRate || 0).toFixed(2)}%
</td>

<td className="px-6 py-5 text-right text-xs font-medium">
  {formatCurrency(row.totalRevenue)}
</td>

<td className="px-6 py-5 text-right text-xs font-medium text-green-600">
  {formatCurrency(row.commissionEarned)}
</td>

<td className="px-6 py-5 text-right text-xs">
  {Number(row.conversionRate || 0).toFixed(2)}%
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

             <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                      />
                  
                  {(paginatedOrders.length === 0) && (
                    <div className="py-20 text-center space-y-3">
                       <IoTimeOutline size={40} className="mx-auto text-neutral-200" />
                       <p className="text-neutral-400 text-sm italic">No orders found in this category.</p>
                    </div>
                  )}
        </div>
      </div>
    </div>
  );
}
