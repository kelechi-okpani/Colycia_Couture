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
      productId: item.productId._id.toString(),
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

    if (!userId) return NextResponse.json({ error: "User ID is required" }, { status: 400 });

    switch (action) {
      case 'add':
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Check if the exact product AND size combination exists
        const existingItem = user.cart.find(
          (item: any) => item.productId.toString() === productId && item.size === size
        );

        if (existingItem) {
          await User.updateOne(
            { _id: userId, "cart.productId": productId, "cart.size": size },
            { $inc: { "cart.$.quantity": quantity || 1 } }
          );
        } else {
          await User.findByIdAndUpdate(userId, {
            $push: { cart: { productId, quantity: quantity || 1, size } }
          });
        }
        break;

      case 'update':
        await User.updateOne(
          { _id: userId, "cart.productId": productId, "cart.size": size },
          { $set: { "cart.$.quantity": quantity } }
        );
        break;

      case 'remove':
        await User.findByIdAndUpdate(userId, {
          $pull: { cart: { productId, size } }
        });
        break;

      case 'clear':
        await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Refresh and populate to return the new state
    const updatedUser = await User.findById(userId).populate('cart.productId');
    return NextResponse.json(formatCart(updatedUser.cart));

  } catch (error: any) {
    console.error("Cart API Error:", error);
    return NextResponse.json({ error: "Cart sync failed" }, { status: 500 });
  }
}