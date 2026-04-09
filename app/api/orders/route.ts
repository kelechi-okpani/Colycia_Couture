import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('isAdmin') === 'true';

    // 1. If Admin, return all orders
    if (isAdmin) {
      const orders = await Order.find({}).sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }

    // 2. Validate userId format
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "A valid User ID is required to fetch orders." }, 
        { status: 400 } // Send 400 (Bad Request) instead of 500
      );
    }

    // 3. Fetch user-specific orders
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(orders);

  } catch (error: any) {
    console.error("Order Fetch Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}