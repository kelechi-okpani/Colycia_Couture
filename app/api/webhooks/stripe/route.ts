import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    await dbConnect();

    // 1. Fetch the actual line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    
    // 2. Reconstruct the items array for your DB
    const orderItems = lineItems.data.map((item) => ({
      productId: item.price?.product, // This is the Stripe Product ID
      name: item.description,
      price: item.amount_total / 100,
      quantity: item.quantity,
      size: "Standard", // You can pass sizes through line_item metadata if needed
      image: "" // Optional: Fetch from session if stored in metadata
    }));

    // 3. Extract metadata saved during checkout
    const { userId, phoneNumber, customAddress, state } = session.metadata || {};
    const customer = session.customer_details;

    try {
      await Order.create({
        userId,
        items: orderItems,
        totalAmount: (session.amount_total || 0) / 100,
        shippingDetails: {
          firstName: customer?.name?.split(' ')[0] || "Customer",
          lastName: customer?.name?.split(' ')[1] || "",
          phone: phoneNumber,
          address: customAddress || customer?.address?.line1,
          city: customer?.address?.city || "",
          state: state || customer?.address?.state,
          country: 'Nigeria'
        },
        paymentStatus: 'paid',
        orderStatus: 'processing',
        stripeSessionId: session.id
      });
      
      console.log(`Order successfully created for User: ${userId}`);
    } catch (dbError) {
      console.error("Database Save Error:", dbError);
      return NextResponse.json({ error: "Database save failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}