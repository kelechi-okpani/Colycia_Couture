// app/api/user/cart/route.ts
import User from '@/app/lib/models/user';
import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  await dbConnect();
  const { userId, productId, quantity, size, action } = await req.json();

  try {
    let update;
    if (action === 'add') {
      update = { $push: { cart: { productId, quantity, size } } };
    } else if (action === 'remove') {
      update = { $pull: { cart: { productId } } };
    } else if (action === 'clear') {
      update = { $set: { cart: [] } };
    }

    const user = await User.findByIdAndUpdate(userId, update, { new: true }).populate('cart.productId');
    return NextResponse.json(user.cart);
  } catch (error) {
    return NextResponse.json({ error: "Cart update failed" }, { status: 500 });
  }
}