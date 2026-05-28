import dbConnect from '@/app/lib/mongodb';
import { Partner } from '@/app/lib/models/referral';
import { NextResponse } from 'next/server';


export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, code, commissionRate } = body;

    // Basic validation
    if (!name || !code) {
      return NextResponse.json({ error: "Name and tracking code are required." }, { status: 400 });
    }

    // Ensure the code format is URL-safe (lowercase, no spaces)
    const formattedCode = code.toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Check if the code already exists to prevent duplicates
    const existingPartner = await Partner.findOne({ code: formattedCode });
    if (existingPartner) {
      return NextResponse.json({ error: "This tracking code is already in use." }, { status: 409 });
    }

    // Create the new partner
    const newPartner = await Partner.create({
      name,
      code: formattedCode,
      commissionRate: commissionRate || 0,
    });

    return NextResponse.json({ 
      success: true, 
      partner: newPartner 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}