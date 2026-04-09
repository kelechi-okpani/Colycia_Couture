import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';

// app/api/checkout/route.ts


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia', // Use your current version
});

export async function POST(req: Request) {
  try {
    await dbConnect();

    // FIXED: Changed 'response.json()' to 'req.json()' to match the parameter above
    const { items, formData, userId } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total including the 5000 NGN shipping fee
    const totalAmount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0) + 5000;

    // 1. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'ngn',
          product_data: { 
            name: item.name, 
            images: [item.image].filter(Boolean) // Ensure image exists
          },
          unit_amount: Math.round(item.price * 100), // Stripe uses kobo (cents)
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      // Using NEXTAUTH_URL as the base for redirects
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      metadata: { 
        userId: userId || "guest", 
        firstName: formData.firstName,
        lastName: formData.lastName 
      },
    });

    // 2. Create Order in MongoDB with 'pending' status
    // This captures the intent to buy before the user even finishes on Stripe
    await Order.create({
      userId: userId || null, // Allow for guest checkout if your schema supports it
      items: items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        image: item.image
      })),
      shippingDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.state, // Mapping state to city for your schema
        state: formData.state,
        country: formData.country || 'Nigeria',
        zipCode: formData.zipCode,
        deliveryMethod: 'Standard'
      },
      totalAmount,
      stripeSessionId: session.id,
      paymentStatus: 'pending',
      orderStatus: 'processing'
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: '2025-01-27.acacia' as any, // Use latest stable
// });

// export async function POST(req: Request) {
//   try {
//     const { items, formData, userId } = await req.json();

//     if (!items || items.length === 0) {
//       return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: items.map((item: any) => ({
//         price_data: {
//           currency: 'ngn',
//           product_data: { 
//             name: item.name, 
//             images: [item.image],
//             metadata: { productId: item.productId } // Link back to your DB
//           },
//           unit_amount: Math.round(item.price * 100), // Stripe expects kobo
//         },
//         quantity: item.quantity,
//       })),
//       mode: 'payment',
//       // Pass critical info in metadata
//       metadata: {
//         userId: userId,
//         phoneNumber: formData.phone,
//         customAddress: formData.address,
//         state: formData.state,
//         zipCode: formData.zipCode || "N/A",
//       },
//       success_url: `${process.env.NEXT_PUBLIC_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.NEXT_PUBLIC_URL}/checkout`,
//       shipping_address_collection: { allowed_countries: ['NG'] },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.error("Stripe Session Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }