// app/api/referrals/event/route.ts
import dbConnect from '@/app/lib/mongodb';
import { ReferralEvent, Partner } from '@/app/lib/models/referral'; // <-- Added Partner model
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Convert to lowercase immediately so "Vogue" and "vogue" are treated the same
    const partnerCode = body.partnerCode?.toLowerCase(); 
    const { eventType, revenue, referenceId } = body;

    if (!partnerCode || !eventType) {
      return NextResponse.json({ error: "Missing required tracking fields" }, { status: 400 });
    }

    // 1. VALIDATION: Check if this partner actually exists in the database
    const partnerExists = await Partner.findOne({ code: partnerCode });
    if (!partnerExists) {
      return NextResponse.json({ error: "Invalid partner code" }, { status: 404 });
    }

    // Capture IP address for basic de-duplication (Next.js specific)
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

    // 2. ANTI-SPAM: If it's a 'visit', check if this IP already visited today
    if (eventType === 'visit') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingVisit = await ReferralEvent.findOne({
        partnerCode,
        eventType: 'visit',
        ipAddress,
        createdAt: { $gte: today }
      });

      if (existingVisit) {
        // Return 200 so the frontend fetch doesn't throw an error, 
        // but we safely skip writing a duplicate to the DB.
        return NextResponse.json({ message: "Visit already counted today", skipped: true });
      }
    }

    // 3. LOGGING: Record the verified event
    const newEvent = await ReferralEvent.create({
      partnerCode,
      eventType,
      revenue: revenue || 0,
      referenceId: referenceId || null,
      ipAddress
    });

    return NextResponse.json({ success: true, eventId: newEvent._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import dbConnect from '@/app/lib/mongodb';
// import { ReferralEvent } from '@/app/lib/models/referral';
// import { NextResponse } from 'next/server';


// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     const body = await req.json();
//     const { partnerCode, eventType, revenue, referenceId } = body;

//     if (!partnerCode || !eventType) {
//       return NextResponse.json({ error: "Missing required tracking fields" }, { status: 400 });
//     }

//     // Capture IP address for basic de-duplication (Next.js specific)
//     const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';

//     // Optional: If it's a 'visit', check if this IP already visited today to prevent spam
//     if (eventType === 'visit') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
      
//       const existingVisit = await ReferralEvent.findOne({
//         partnerCode,
//         eventType: 'visit',
//         ipAddress,
//         createdAt: { $gte: today }
//       });

//       if (existingVisit) {
//         return NextResponse.json({ message: "Visit already counted today" });
//       }
//     }

//     const newEvent = await ReferralEvent.create({
//       partnerCode,
//       eventType,
//       revenue: revenue || 0,
//       referenceId: referenceId || null,
//       ipAddress
//     });

//     return NextResponse.json({ success: true, eventId: newEvent._id });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }