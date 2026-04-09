import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';
import User from '@/app/lib/models/user';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';


export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Valid User ID required" }, { status: 400 });
    }

    // 1. Fetch the actual user from the DB to check their role
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Logic based on role
    let orders;
    if (user.role === 'admin') {
      // Admins see everything
      orders = await Order.find({}).sort({ createdAt: -1 });
    } else {
      // Regular users only see their own
      orders = await Order.find({ userId }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ success: true, orders });

  } catch (error: any) {
    console.error("Order Fetch Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// export async function GET(req: Request) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get('userId');
//     const isAdmin = searchParams.get('isAdmin') === 'true';

//     // 1. If Admin, return all orders
//     if (isAdmin) {
//       const orders = await Order.find({}).sort({ createdAt: -1 });
//       return NextResponse.json(orders);
//     }

//     // 2. Validate userId format
//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return NextResponse.json(
//         { error: "A valid User ID is required to fetch orders." }, 
//         { status: 400 } // Send 400 (Bad Request) instead of 500
//       );
//     }

//     // 3. Fetch user-specific orders
//     const orders = await Order.find({ userId }).sort({ createdAt: -1 });
//     return NextResponse.json(orders);

//   } catch (error: any) {
//     console.error("Order Fetch Error:", error.message);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }