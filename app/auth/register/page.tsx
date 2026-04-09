"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearMessages, signupUser } from "@/app/store/slices/authSlice";


export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, error, successMessage } = useAppSelector((state) => state.auth);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  // Client-side Validation State
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (formData.firstName.length < 2) errors.firstName = "First name is too short";
    if (formData.lastName.length < 2) errors.lastName = "Last name is too short";
    if (formData.phone.length < 2) errors.phone = "Phone number is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Invalid email address";
    if (formData.password.length < 6) errors.password = "Password must be at least 6 characters";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear specific error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await dispatch(signupUser(formData));
    if (signupUser.fulfilled.match(result)) {
      // Small delay so user can see the success message
      setTimeout(() => router.push("/auth/login"), 2000);
    }
  };


  const handlePhone = (e:any) => {
  const { name, value } = e.target;

  if (name === "phone") {
    // Only update if the value is digits
    const sanitizedValue = value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="about-bg-watermark" aria-hidden="true" />
      
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm border border-neutral-100 p-8 md:p-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2">Create an Account</h1>
          <p className="text-sm text-neutral-500 font-light">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-neutral-900 underline underline-offset-4 hover:text-neutral-600 transition-colors">
              sign in
            </Link>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Global Backend Error */}
          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}
          {/* Global Success Message */}
          {successMessage && <p className="text-green-600 text-xs text-center font-medium">{successMessage}</p>}

          <div className="space-y-4">
            <div className="group">
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${formErrors.firstName ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
              />
              {formErrors.firstName && <span className="text-[10px] text-red-500 mt-1">{formErrors.firstName}</span>}
            </div>

            <div className="group">
              <input
                name="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${formErrors.lastName ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
              />
              {formErrors.lastName && <span className="text-[10px] text-red-500 mt-1">{formErrors.lastName}</span>}
            </div>

             <div className="group">
            <input
              name="phone"
              type="text" // Use "text" or "tel" instead of "phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => {
                // Regex: replace anything that is NOT a digit (0-9) with an empty string
                const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                
                // Call your existing handleChange with a fake event object or update state directly
                handlePhone({
                  target: {
                    name: 'phone',
                    value: onlyNums
                  }
                });
              }}
              className={`w-full px-4 py-3 border ${formErrors.phone ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
            />
              {formErrors.phone && <span className="text-[10px] text-red-500 mt-1">{formErrors.phone}</span>}
            </div>


            <div className="group">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
              />
              {formErrors.email && <span className="text-[10px] text-red-500 mt-1">{formErrors.email}</span>}
            </div>

            <div className="group">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${formErrors.password ? 'border-red-400' : 'border-neutral-200'} focus:outline-none focus:border-neutral-900 transition-all placeholder:text-neutral-400 font-light`}
              />
              {formErrors.password && <span className="text-[10px] text-red-500 mt-1">{formErrors.password}</span>}
            </div>
          </div>

          {/* <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 border-neutral-300 rounded accent-neutral-900 cursor-pointer"
            />
            <label htmlFor="remember" className="text-xs text-neutral-500 font-light cursor-pointer select-none">
              Remember Me
            </label>
          </div> */}

          <div className="pt-4 flex justify-center">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-2/3 bg-black text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:bg-neutral-500 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}