import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any, // Use latest stable
});

export async function POST(req: Request) {
  try {
    const { items, formData, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'ngn',
          product_data: { 
            name: item.name, 
            images: [item.image],
            metadata: { productId: item.productId } // Link back to your DB
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects kobo
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      // Pass critical info in metadata
      metadata: {
        userId: userId,
        phoneNumber: formData.phone,
        customAddress: formData.address,
        state: formData.state,
        zipCode: formData.zipCode || "N/A",
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
      shipping_address_collection: { allowed_countries: ['NG'] },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Session Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}