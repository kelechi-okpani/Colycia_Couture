"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { forgotPassword, clearMessages } from "@/app/store/slices/authSlice";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState("");
  
  const dispatch = useAppDispatch();
  const { loading, error, successMessage } = useAppSelector((state) => state.auth);

  // Clear messages when user enters the page
  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const validate = () => {
    // Basic email regex
    const emailRegex = /\S+@\S+\.\S+/;
    if (!email) {
      setLocalError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setLocalError("Please enter a valid email address");
      return false;
    }
    setLocalError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    dispatch(forgotPassword(email));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Keeping your brand watermark consistent */}
      <div className="about-bg-watermark" aria-hidden="true" />

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-neutral-100 p-8 md:p-16 z-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">Recover Password</h1>
          <p className="text-sm text-neutral-500 font-light">
            Remembered it?{" "}
            <Link href="/auth/login" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors">
              back to login
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Error handling for both local validation and backend feedback */}
            {(error || localError) && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded text-center">
                {error || localError}
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-100 text-green-700 text-xs py-3 px-4 rounded text-center">
                {successMessage}
              </div>
            )}
            
            <div className="flex flex-col">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localError) setLocalError(""); // Clear local error while typing
                }}
                placeholder="Enter your registered email"
                className={`w-full px-4 py-3 border ${localError ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-2/3 bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:bg-neutral-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}