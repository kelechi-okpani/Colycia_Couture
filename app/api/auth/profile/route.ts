// app/api/user/profile/route.ts
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/lib/models/user';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // CRITICAL: You must populate both wishlist and cart.productId
    const user = await User.findById(userId)
      .select('-password') 
      .populate('wishlist') 
      .populate('cart.productId'); 

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Map the internal _id to id for frontend consistency if needed
    const userData = {
      ...user.toObject(),
      id: user._id.toString(),
    };

    return NextResponse.json(userData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}