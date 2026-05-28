// app/api/admin/referrals/route.ts
import dbConnect from '@/app/lib/mongodb';
import { ReferralEvent, Partner } from '@/app/lib/models/referral';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; 

export async function GET() {
  try {
    await dbConnect();

    // 1. Fetch ALL registered partners first (The source of truth)
    // Using .lean() converts Mongoose documents to standard JSON objects faster
    const allPartners = await Partner.find({}).lean();

    // 2. Run your exact same aggregation to calculate metrics for active links
    const activeStats = await ReferralEvent.aggregate([
      {
        $group: {
          _id: "$partnerCode",
          visitors: { 
            $sum: { $cond: [{ $eq: ["$eventType", "visit"] }, 1, 0] } 
          },
          inquiries: { 
            $sum: { $cond: [{ $eq: ["$eventType", "inquiry"] }, 1, 0] } 
          },
          bookings: { 
            $sum: { $cond: [{ $eq: ["$eventType", "booking"] }, 1, 0] } 
          },
          totalRevenue: { $sum: "$revenue" }
        }
      },
      {
        $project: {
          partnerCode: "$_id",
          _id: 0,
          visitors: 1,
          inquiries: 1,
          bookings: 1,
          totalRevenue: 1,
          inquiryConvRate: {
            $cond: [
              { $eq: ["$visitors", 0] }, 0, 
              { $multiply: [{ $divide: ["$inquiries", "$visitors"] }, 100] }
            ]
          },
          bookingConvRate: {
            $cond: [
              { $eq: ["$visitors", 0] }, 0, 
              { $multiply: [{ $divide: ["$bookings", "$visitors"] }, 100] }
            ]
          }
        }
      }
    ]);

    // 3. Merge the data: Map over all partners and attach stats or fallback to 0
    const finalData = allPartners.map(partner => {
      // Find matching stats for this specific partner
      const stats = activeStats.find(stat => stat.partnerCode === partner.code);

      return {
        partnerCode: partner.code,
        partnerName: partner.name,
        commissionRate: partner.commissionRate,
        // If stats exist, use them. Otherwise, default to 0.
        visitors: stats?.visitors || 0,
        inquiries: stats?.inquiries || 0,
        bookings: stats?.bookings || 0,
        inquiryConvRate: stats?.inquiryConvRate || 0,
        bookingConvRate: stats?.bookingConvRate || 0,
        totalRevenue: stats?.totalRevenue || 0,
      };
    });

    // 4. Sort the final merged array (Highest revenue first, then highest visitors)
    finalData.sort((a, b) => b.totalRevenue - a.totalRevenue || b.visitors - a.visitors);

    return NextResponse.json(finalData);
  } catch (error: any) {
    console.error("Referral Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import dbConnect from '@/app/lib/mongodb';
// import { ReferralEvent, Partner } from '@/app/lib/models/referral';
// import { NextResponse } from 'next/server';


// export async function GET(req: Request) {
//   try {
//     await dbConnect();

//     // MongoDB Aggregation Pipeline to calculate all metrics in one query
//     const dashboardStats = await ReferralEvent.aggregate([
//       {
//         $group: {
//           _id: "$partnerCode",
//           visitors: { 
//             $sum: { $cond: [{ $eq: ["$eventType", "visit"] }, 1, 0] } 
//           },
//           inquiries: { 
//             $sum: { $cond: [{ $eq: ["$eventType", "inquiry"] }, 1, 0] } 
//           },
//           bookings: { 
//             $sum: { $cond: [{ $eq: ["$eventType", "booking"] }, 1, 0] } 
//           },
//           totalRevenue: { $sum: "$revenue" }
//         }
//       },
//       {
//         $project: {
//           partnerCode: "$_id",
//           _id: 0,
//           visitors: 1,
//           inquiries: 1,
//           bookings: 1,
//           totalRevenue: 1,
//           // Handle division by zero for conversion rates
//           inquiryConvRate: {
//             $cond: [
//               { $eq: ["$visitors", 0] }, 0, 
//               { $multiply: [{ $divide: ["$inquiries", "$visitors"] }, 100] }
//             ]
//           },
//           bookingConvRate: {
//             $cond: [
//               { $eq: ["$visitors", 0] }, 0, 
//               { $multiply: [{ $divide: ["$bookings", "$visitors"] }, 100] }
//             ]
//           }
//         }
//       },
//       { $sort: { totalRevenue: -1 } } // Sort by highest revenue
//     ]);

//     // Optional: Attach actual Partner names to the codes
//     const partnerCodes = dashboardStats.map(stat => stat.partnerCode);
//     const partners = await Partner.find({ code: { $in: partnerCodes } });

//     const finalData = dashboardStats.map(stat => {
//       const partnerDetails = partners.find(p => p.code === stat.partnerCode);
//       return {
//         ...stat,
//         partnerName: partnerDetails?.name || "Unknown Partner",
//       };
//     });

//     return NextResponse.json(finalData);
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }