'use client';

import { useState } from 'react';

type Props = {
  onSuccess?: () => void;
};

export default function CreateReferralLink({ onSuccess }: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [commission, setCommission] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // -------------------------
  // Helpers
  // -------------------------
  const sanitizeCode = (value: string) =>
    value.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');

  const generateRandomCode = () => {
    const random =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 8)
        : Math.random().toString(36).substring(2, 10);

    setCode(random.toLowerCase());
  };

  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  // -------------------------
  // Submit
  // -------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);
    setGeneratedLink(null);
    setCopied(false);

    try {
      const cleanedCode = sanitizeCode(code);
      const commissionRate = Number(commission);

      if (!name.trim()) throw new Error('Partner name is required');
      if (!cleanedCode) throw new Error('Referral code is required');
      if (isNaN(commissionRate))
        throw new Error('Commission must be a valid number');
      if (commissionRate < 0 || commissionRate > 100)
        throw new Error('Commission must be between 0 and 100');

      const res = await fetch('/api/admin/referrals/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          code: cleanedCode,
          commissionRate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to create referral partner');
      }

      const baseUrl = getBaseUrl();
      const fullUrl = `${baseUrl}/?ref=${data.partner.code}`;

      setGeneratedLink(fullUrl);

      // reset only AFTER success
      setName('');
      setCode('');
      setCommission('');

      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // Copy
  // -------------------------
  const copyToClipboard = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy link');
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-8 mb-10 max-w-3xl">
      <h2 className="text-sm font-bold text-gray-900 mb-6 tracking-widest uppercase">
        PRODUCE PARTNER LINK
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NAME */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-2">
              Partner Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-4 py-2 text-xs uppercase"
              placeholder="VOGUE EDITORIAL"
              required
            />
          </div>

          {/* CODE */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-2">
              Referral Code
            </label>

            <div className="flex">
              <input
                value={code}
                onChange={(e) => setCode(sanitizeCode(e.target.value))}
                className="w-full border px-4 py-2 text-xs uppercase"
                placeholder="vogue26"
                required
              />

              <button
                type="button"
                onClick={generateRandomCode}
                className="bg-black text-white px-3 text-xs cursor-pointer"
              >
                GENERATE 
              </button>
            </div>
          </div>
        </div>

        {/* COMMISSION */}
        <div className="w-full sm:w-1/3">
          <label className="block text-[11px] font-semibold uppercase text-gray-400 mb-2">
            Commission %
          </label>

          <input
            type="number"
            min={0}
            max={100}
            value={commission}
            onChange={(e) => setCommission(e.target.value)}
            className="w-full border px-4 py-2 text-xs"
            placeholder="15"
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 text-xs font-bold uppercase disabled:opacity-40 cursor-pointer"
        >
          {loading ? 'Creating...' : 'CREATE Referral Link'}
        </button>
      </form>

      {/* ERROR */}
      {error && (
        <div className="mt-6 p-3 bg-red-50 text-red-700 text-xs uppercase border border-red-200">
          {error}
        </div>
      )}

      {/* RESULT */}
      {generatedLink && (
        <div className="mt-8 p-5 bg-gray-50 border">
          <p className="text-xs font-bold uppercase text-gray-500 mb-2">
            Referral Link
          </p>

          <div className="flex gap-3">
            <code className="flex-1 text-xs break-all bg-white border p-2">
              {generatedLink}
            </code>

            <button
              onClick={copyToClipboard}
              className="bg-black text-white px-4 text-xs"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}