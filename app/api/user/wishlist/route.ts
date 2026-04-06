// app/api/user/wishlist/route.ts


import Wishlist from '@/app/lib/models/wishlist';
import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

// GET: Fetch user's wishlist
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const wishlist = await Wishlist.findOne({ userId }).populate('products');
    
    return NextResponse.json(wishlist ? wishlist.products : []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Toggle product in wishlist (Add if not there, remove if it is)
export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist if it doesn't exist
      wishlist = await Wishlist.create({ userId, products: [productId] });
    } else {
      // Toggle logic
      const productIndex = wishlist.products.indexOf(productId);
      
      if (productIndex > -1) {
        // Product exists, remove it
        wishlist.products.splice(productIndex, 1);
      } else {
        // Product doesn't exist, add it
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findOne({ userId }).populate('products');
    return NextResponse.json(updatedWishlist.products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Clear entire wishlist
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { userId } = await req.json();
    
    await Wishlist.findOneAndUpdate({ userId }, { $set: { products: [] } });
    
    return NextResponse.json({ message: "Wishlist cleared" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}