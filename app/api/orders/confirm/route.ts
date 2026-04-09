// app/api/orders/confirm/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) return NextResponse.json({ error: "Missing session ID" }, { status: 400 });

  try {
    await dbConnect();

    // 1. Retrieve the session from Stripe to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // 2. Update the order in MongoDB
      const updatedOrder = await Order.findOneAndUpdate(
        { stripeSessionId: sessionId },
        { 
          paymentStatus: 'paid',
          orderStatus: 'processing' 
        },
        { new: true }
      );

      return NextResponse.json({ success: true, order: updatedOrder });
    }

    return NextResponse.json({ success: false, message: "Payment not verified" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}