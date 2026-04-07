import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const isAdmin = searchParams.get('isAdmin') === 'true'; // In prod, verify this via JWT/Session

    let orders;

    if (isAdmin) {
      // 1. Admin Logic: Get all orders across the entire platform
      // We populate the userId to see the customer's name/email in the admin dashboard
      orders = await Order.find({})
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 });
    } else {
      // 2. User Logic: Get only orders belonging to the specific user
      if (!userId) {
        return NextResponse.json({ error: "User ID required" }, { status: 400 });
      }

      orders = await Order.find({ userId })
        .sort({ createdAt: -1 });
    }

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("Order Fetch Error:", error.message);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}