"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/app/store/hooks";
import { resetCartState } from "@/app/store/slices/cartSlice";
import Link from "next/link";
import { motion } from "framer-motion";
import { IoCheckmarkCircle, IoBagHandleOutline, IoArrowForward } from "react-icons/io5";

function SuccessContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);


// useEffect(() => {
//   const confirmOrder = async () => {
//     if (sessionId) {
//       try {
//         // Trigger the backend update
//         const response = await fetch(`/api/orders/confirm?session_id=${sessionId}`);
//         const data = await response.json();
//         if (data.success) {
//           dispatch(resetCartState());
//           setLoading(false);
//         } else {
//           // If payment isn't confirmed yet, maybe redirect or show error
//           console.error("Payment confirmation failed");
//           setLoading(false);
//         }
//       } catch (err) {
//         console.error("Error confirming order:", err);
//         setLoading(false);
//       }
//     } else {
//       router.push("/");
//     }
//   };
//   confirmOrder();
// }, [sessionId, dispatch, router]);



useEffect(() => {
  const confirmOrder = async () => {
    if (!sessionId) {
      router.push("/");
      return;
    }

    try {
      // 1. Verify payment and update order status in DB
      const response = await fetch(`/api/orders/confirm?session_id=${sessionId}`);
      const data = await response.json();

      if (data.success) {
        // 2. Clear Redux State
        dispatch(resetCartState());

        // 3. Clear LocalStorage (In case your Redux persist doesn't catch it)
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart"); // Or whatever key you use
        }

        // 4. Clear Database Cart (If the user is logged in)
        // We do this via a background fetch so it doesn't block the UI
        await fetch('/api/cart/clear', { method: 'DELETE' });

        setLoading(false);
      } else {
        console.error("Payment confirmation failed");
        setLoading(false);
        // Optional: router.push("/checkout?error=payment_failed");
      }
    } catch (err) {
      console.error("Error confirming order:", err);
      setLoading(false);
    }
  };

  confirmOrder();
}, [sessionId, dispatch, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <IoCheckmarkCircle className="text-green-500 text-8xl" />
          </motion.div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-500">Session ID:</span>
            <span className="text-gray-900 font-mono text-xs truncate ml-4 max-w-[180px]">
              {sessionId?.slice(0, 20)}...
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Status:</span>
            <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded">Paid</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            href="/profile" 
            className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all active:scale-[0.98]"
          >
            <IoBagHandleOutline className="text-xl" />
            Track My Order
          </Link>
          
          <Link 
            href="/shop" 
            className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 border border-gray-200 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            Continue Shopping
            <IoArrowForward />
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          A confirmation email has been sent to your registered address.
        </p>
      </motion.div>
    </div>
  );
}

// Wrap in Suspense because of useSearchParams()
export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}