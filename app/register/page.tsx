"use client";

import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-neutral-100 p-8 md:p-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">Create an Account</h1>
          <p className="text-sm text-neutral-500 font-light">
            Already have an account?{" "}
            <Link href="/login" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors">
              sign in
            </Link>
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light"
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-neutral-200 focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 border-neutral-300 rounded accent-neutral-900 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-neutral-500 font-light cursor-pointer select-none">
              Remember Me
            </label>
          </div>

          <div className="pt-4 flex justify-center">
            <button className="w-full md:w-2/3 bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98]">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}