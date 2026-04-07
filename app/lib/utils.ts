import { NextResponse } from "next/server";

/**
 * Standardized Error Response
 */
export const sendError = (message: string, status: number = 500) => {
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      timestamp: new Date().toISOString() 
    }, 
    { status }
  );
};

/**
 * Standardized Success Response
 */
export const sendSuccess = (data: any, status: number = 200) => {
  // Ensure we don't nest the data inside another 'data' key unless it's already there
  const responseBody = typeof data === 'object' && data !== null 
    ? { success: true, ...data } 
    : { success: true, data };

  return NextResponse.json(responseBody, { status });
};

/**
 * App Constants
 */
export const CATEGORIES = ['AGBADA', 'KAFTANS', 'SHIRTS', 'SUITS'] as const;
export type CategoryType = (typeof CATEGORIES)[number];

export const SHIPPING_FEES = {
  STANDARD: 0,
  EXPRESS: 5000, // ₦5,000 for express delivery
} as const;

export const CURRENCY = {
  CODE: 'NGN',
  SYMBOL: '₦',
} as const;

/**
 * Helper to format currency consistently across the site
 */
export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};