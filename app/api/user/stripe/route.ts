// app/api/checkout/stripe/route.ts
import Stripe from 'stripe';
import Order from '@/app/lib/models/order';
import dbConnect from '@/app/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

export async function POST(req: Request) {
  await dbConnect();
  const { items, shippingDetails, userId, totalAmount } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map((item: any) => ({
      price_data: {
        currency: 'ngn', // Match your NGN UI
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Stripe uses cents/kobo
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    metadata: { userId, orderId: "" } // We'll update this via Webhook
  });

  // Create Order/Transaction Record
  await Order.create({
    userId,
    items,
    shippingDetails,
    totalAmount,
    stripeSessionId: session.id,
    paymentStatus: 'pending'
  });

  return Response.json({ url: session.url });
}