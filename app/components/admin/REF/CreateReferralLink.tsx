'use client';

import { useState } from 'react';

export default function CreateReferralLink({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [commission, setCommission] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateRandomCode = () => {
    const randomString = Math.random().toString(36).substring(2, 8);
    setCode(randomString);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedLink(null);
    setCopied(false);

    try {
      const res = await fetch('/api/admin/referrals/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          code, 
          commissionRate: Number(commission) 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create partner architecture');

      const fullUrl = `${window.location.origin}/?ref=${data.partner.code}`;
      setGeneratedLink(fullUrl);
      
      setName('');
      setCode('');
      setCommission('');
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-8 mb-10 max-w-3xl">
      <h2 className="text-sm font-bold text-gray-900 mb-6 tracking-widest uppercase">
        PRODUCE PARTNER LINK
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
              Partner / Entity Designation
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., VOGUE EDITORIAL"
              className="w-full rounded-sm border border-gray-200 bg-gray-50/30 px-4 py-2.5 text-xs font-medium tracking-wide uppercase placeholder:text-gray-300 focus:bg-white focus:outline-none focus:border-gray-900 transition-all"
            />
          </div>

          {/* Code */}
          <div>
            <label className="block text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
              Custom Tracking Token
            </label>
            <div className="flex">
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g., VOGUE26"
                className="w-full rounded-l-sm border border-gray-200 bg-gray-50/30 px-4 py-2.5 text-xs font-medium tracking-wide uppercase placeholder:text-gray-300 focus:bg-white focus:outline-none focus:border-gray-900 transition-all"
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="bg-gray-900 border border-gray-900 text-white rounded-r-sm px-4 text-[10px] font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors"
              >
                GEN
              </button>
            </div>
          </div>
        </div>

        {/* Commission Rate & Action */}
        <div className="flex flex-col sm:flex-row items-end gap-6 pt-2">
          <div className="w-full sm:w-1/3">
            <label className="block text-[11px] font-semibold tracking-widest text-gray-400 uppercase mb-2">
              Commission Rate %
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              placeholder="15"
              className="w-full rounded-sm border border-gray-200 bg-gray-50/30 px-4 py-2.5 text-xs font-medium tracking-wide placeholder:text-gray-300 focus:bg-white focus:outline-none focus:border-gray-900 transition-all"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-2/3 bg-gray-900 text-white font-bold text-[11px] tracking-widest py-3 px-6 rounded-sm uppercase hover:bg-gray-800 disabled:opacity-30 transition-all"
          >
            {loading ? 'Processing System...' : 'Generate Architecture Link'}
          </button>
        </div>
      </form>

      {/* Messaging Layouts */}
      {error && (
        <div className="mt-6 p-4 border border-red-100 bg-red-50/50 text-red-800 text-[11px] font-medium tracking-wide uppercase rounded-sm">
          {error}
        </div>
      )}

      {generatedLink && (
        <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-sm">
          <p className="text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-3">
            DEPLOYMENT PATH GENERATED:
          </p>
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <code className="flex-1 block p-3 bg-white border border-gray-200 rounded-sm text-xs text-gray-700 font-mono break-all select-all">
              {generatedLink}
            </code>
            <button
              onClick={copyToClipboard}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 text-[11px] font-bold tracking-widest uppercase rounded-sm transition-colors whitespace-nowrap"
            >
              {copied ? 'COPIED TO CLIPBOARD' : 'COPY PATH'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}