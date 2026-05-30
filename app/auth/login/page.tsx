"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearMessages, loginUser } from "@/app/store/slices/authSlice";




export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });

  // Clear any existing auth errors when mounting the page
  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const validate = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
      isValid = false;
    }
    if (formData.password.length < 1) {
      errors.password = "Password is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setFormData({ ...formData, [e.target.type]: e.target.value });
  //   if (formErrors[e.target.type as keyof typeof formErrors]) {
  //     setFormErrors({ ...formErrors, [e.target.type]: "" });
  //   }
  // };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!validate()) return;

  //   const result = await dispatch(loginUser(formData));
  //   console.log(result, "result")
  //   // console.log(result?.meta?.requestStatus === "fulfilled", "fulfilled ...result")
  //   // if (loginUser.fulfilled.match(result)) {
  //   if (result?.meta?.requestStatus === "fulfilled") {
  //     router.push("/profile"); // Redirect to home or dashboard on success
  //   }
  // };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  if (formErrors[name as keyof typeof formErrors]) {
    setFormErrors(prev => ({ ...prev, [name]: "" }));
  }
};

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const result = await dispatch(loginUser(formData)).unwrap();
  
    console.log("Login successful:", result);
    // Check user role
    if (result.role === "admin") {
      // router.push("/admin");
      router.replace("/admin");
      return;
    }

    // Default user redirect
    router.replace("/profile");
    // router.push("/profile");
  } catch (err) {
    console.error("Failed to login:", err);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="about-bg-watermark" aria-hidden="true" />

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-neutral-100 p-8 md:p-16 z-10">
        {/* <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">Log in</h1>
          <p className="text-sm text-neutral-500 font-light">
            Don’t have an account?{" "}
            <Link href="/auth/register" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors">
              sign up
            </Link>
          </p>
        </div> */}

        <div className="text-center mb-10">
    <h1 className="text-xl md:text-2xl font-bold uppercase tracking-wider text-neutral-900 mb-2">Log in</h1>
    <p className="text-xs text-neutral-400 uppercase tracking-wider">
      Don’t have an account?{" "}
      <Link href="/auth/register" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors font-bold">
        sign up
      </Link>
    </p>

    {/* --- CONTINUE SHOPPING ACCENT BUTTON --- */}
    <div className="mt-6 pt-5 border-t border-neutral-100 flex justify-center">
      <Link 
        href="/shop" 
        className="group inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors duration-200"
      >
        <svg 
          className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Continue Shopping
      </Link>
    </div>
  </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs py-3 px-4 rounded text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="flex flex-col">
              <input
              name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
              />
              {formErrors.email && <span className="text-[10px] text-red-500 mt-1 ml-1">{formErrors.email}</span>}
            </div>

            <div className="flex flex-col">
              <input
              name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full px-4 py-3 border ${formErrors.password ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
              />
              {formErrors.password && <span className="text-[10px] text-red-500 mt-1 ml-1">{formErrors.password}</span>}
            </div>

            <div className="flex justify-start">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-neutral-500 underline underline-offset-4 hover:text-neutral-900 transition-colors font-light"
              >
                forgot password?
              </Link>
            </div>
          </div>

          <div className="pt-4 flex justify-center">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-2/3 bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:bg-neutral-400"
            >
              {loading ? "please wait..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}