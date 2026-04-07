"use client";

import { useState, useEffect, Suspense } from "react"; // 1. Added Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearMessages } from "@/app/store/slices/authSlice";

// 2. Move your existing logic into a separate internal component
function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { loading, error, successMessage } = useAppSelector((state) => state.auth);
  const token = searchParams.get("token");

  useEffect(() => {
    dispatch(clearMessages());
    if (!token) {
      setLocalError("Invalid or missing reset token. Please request a new link.");
    }
  }, [token, dispatch]);

  const validate = () => {
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return false;
    }
    setLocalError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Your submission logic here
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {(error || localError) && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded text-center">
            {error || localError}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border border-green-100 text-green-700 text-xs py-3 px-4 rounded text-center">
            {successMessage} Redirecting to login...
          </div>
        )}

        <div className="flex flex-col">
          <input
            type="password"
            required
            placeholder="New Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (localError) setLocalError("");
            }}
            className={`w-full px-4 py-3 border ${localError && password.length < 6 ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
          />
        </div>

        <div className="flex flex-col">
          <input
            type="password"
            required
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (localError === "Passwords do not match.") setLocalError("");
            }}
            className={`w-full px-4 py-3 border ${localError === "Passwords do not match." ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
          />
        </div>
      </div>

      <div className="pt-4 flex justify-center">
        <button 
          type="submit"
          disabled={loading || !token}
          className="w-full md:w-2/3 bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:bg-neutral-400"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
}

// 3. Keep the layout in the main export and wrap the form in Suspense
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="about-bg-watermark" aria-hidden="true" />

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-neutral-100 p-8 md:p-16 z-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">Create New Password</h1>
          <p className="text-sm text-neutral-500 font-light">Enter your new security credentials below.</p>
        </div>

        {/* This Suspense boundary fixes the build error */}
        <Suspense fallback={<div className="text-center text-xs text-neutral-400">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}