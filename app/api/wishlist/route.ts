import dbConnect from '@/app/lib/mongodb';
import User from '@/app/lib/models/user';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Fetch wishlist directly from the User document
    const user = await User.findById(userId).populate('wishlist');
    return NextResponse.json(user ? user.wishlist : []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, productId } = await req.json();

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Use .toString() check to find the index of the product ID in the array
    const productIndex = user.wishlist.findIndex((id: any) => id.toString() === productId);
    
    if (productIndex > -1) {
      // It exists -> This is the "Delete/Remove" part of the toggle
      user.wishlist.splice(productIndex, 1);
    } else {
      // Doesn't exist -> This is the "Add" part
      user.wishlist.push(productId);
    }
    
    await user.save();
    
    // Return the full populated product objects so the UI can render them
    const updatedUser = await User.findById(userId).populate('wishlist');
    return NextResponse.json(updatedUser.wishlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}