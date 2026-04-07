import Stripe from 'stripe';
import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2023-10-16' as any 
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { items, shippingDetails, userId, totalAmount } = await req.json();

    // 1. First, create the Order in 'pending' status
    // This gives us an internal ID to track the payment
    const newOrder = await Order.create({
      userId,
      items,
      shippingDetails,
      totalAmount,
      paymentStatus: 'pending'
    });

    // 2. Prepare Line Items for Stripe
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: 'ngn',
        product_data: { 
          name: item.name,
          images: item.image ? [item.image] : [], // Useful for the Stripe Checkout UI
          metadata: { productId: item.productId, size: item.size }
        },
        // Stripe expects integers. 98,500 becomes 9850000 kobo
        unit_amount: Math.round(item.price * 100), 
      },
      quantity: item.quantity,
    }));

    // 3. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
      customer_email: shippingDetails.email, // Auto-fills email for the user
      metadata: { 
        userId: userId.toString(), 
        orderId: newOrder._id.toString() // Crucial for Webhooks
      }
    });

    // 4. Update the Order with the Stripe Session ID
    newOrder.stripeSessionId = session.id;
    await newOrder.save();

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("STRIPE_ERROR:", error);
    return NextResponse.json(
      { error: "Could not initiate payment session" }, 
      { status: 500 }
    );
  }
}