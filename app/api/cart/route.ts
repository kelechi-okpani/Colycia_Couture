import dbConnect from '@/app/lib/mongodb';
import User from '@/app/lib/models/user';
import { NextResponse } from 'next/server';

/**
 * Formats populated cart items for the Redux state.
 * Ensures we don't crash if a product was deleted from the DB.
 */
const formatCart = (cart: any[]) => {
  return cart
    .filter((item) => item.productId && typeof item.productId === 'object') 
    .map((item) => ({
      // productId: item.productId._id.toString(),
      productId: item.productId?._id || item.productId,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
      size: item.size,
    }));
};

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    // We only need the cart for this specific route
    const user = await User.findById(userId).populate('cart.productId'); 

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Consistent return: Just the formatted cart array
    return NextResponse.json(formatCart(user.cart));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId, productId, quantity, size, action } = await req.json();

    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    let updatedUser;

    switch (action) {
      case 'add':
        // Try to update existing item first
        updatedUser = await User.findOneAndUpdate(
          { _id: userId, "cart.productId": productId, "cart.size": size },
          { $inc: { "cart.$.quantity": quantity || 1 } },
          { new: true }
        ).populate('cart.productId');

        // If no existing item was found, push a new one
        if (!updatedUser) {
          updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { cart: { productId, quantity: quantity || 1, size } } },
            { new: true }
          ).populate('cart.productId');
        }
        break;

      case 'update':
        updatedUser = await User.findOneAndUpdate(
          { _id: userId, "cart.productId": productId, "cart.size": size },
          { $set: { "cart.$.quantity": quantity } },
          { new: true }
        ).populate('cart.productId');
        break;

      case 'remove':
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { cart: { productId, size } } },
          { new: true }
        ).populate('cart.productId');
        break;

      case 'clear':
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { $set: { cart: [] } },
          { new: true }
        );
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      cart: formatCart(updatedUser.cart)
    });

  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}