import dbConnect from "@/app/lib/mongodb";
import {
  Partner,
  ReferralEvent,
} from "@/app/lib/models/referral";
import { NextResponse } from "next/server";

const ALLOWED_EVENTS = [
  "visit",
  "product_view",
  "add_to_cart",
  "checkout",
  "purchase",
] as const;

type EventType =
  (typeof ALLOWED_EVENTS)[number];

export async function POST(
  req: Request
) {
  try {
    await dbConnect();

    const body = await req.json();

    const partnerCode = String(
      body.partnerCode || ""
    )
      .toLowerCase()
      .trim();

    const visitorId = String(
      body.visitorId || ""
    ).trim();

    const eventType = String(
      body.eventType || ""
    ).trim() as EventType;

    const revenue = Number(
      body.revenue ?? 0
    );

    const orderId = body.orderId
      ? String(body.orderId).trim()
      : undefined;

    const metadata =
      body.metadata ?? {};

    // ----------------------------
    // VALIDATION
    // ----------------------------
    if (
      !partnerCode ||
      !visitorId ||
      !eventType
    ) {
      return NextResponse.json(
        {
          error:
            "partnerCode, visitorId and eventType are required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !ALLOWED_EVENTS.includes(
        eventType
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid event type",
        },
        {
          status: 400,
        }
      );
    }

    // ----------------------------
    // PARTNER CHECK
    // ----------------------------
    const partner =
      await Partner.findOne({
        code: partnerCode,
        active: true,
      }).lean();

    if (!partner) {
      return NextResponse.json(
        {
          error: "Partner not found",
        },
        {
          status: 404,
        }
      );
    }

    // ----------------------------
    // CHECKOUT DEDUP
    // ----------------------------
    if (
    (eventType === "checkout" ||
    eventType === "purchase") &&
     !orderId

    ) {
      const exists =
        await ReferralEvent.findOne({
          eventType: "checkout",
          orderId,
        }).lean();

      if (exists) {
        return NextResponse.json({
          success: true,
          skipped: true,
          message:
            "Checkout already recorded",
        });
      }
    }

    // ----------------------------
    // PURCHASE DEDUP
    // ----------------------------
    if (
      eventType === "purchase" &&
      orderId
    ) {
      const exists =
        await ReferralEvent.findOne({
          eventType: "purchase",
          orderId,
        }).lean();

      if (exists) {
        return NextResponse.json({
          success: true,
          skipped: true,
          message:
            "Purchase already recorded",
        });
      }
    }

    // ----------------------------
    // CREATE EVENT
    // ----------------------------
    const event =
      await ReferralEvent.create({
        partnerCode,
        visitorId,
        eventType,
        revenue,
        orderId,
        metadata,
      });

    return NextResponse.json(
      {
        success: true,
        eventId: event._id,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "Referral Event Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}




// import dbConnect from "@/app/lib/mongodb";
// import { Partner, ReferralEvent } from "@/app/lib/models/referral";
// import { NextResponse } from "next/server";

// const ALLOWED_EVENTS = [
//   "visit",
//   "product_view",
//   "add_to_cart",
//   "checkout",
//   "purchase",
// ] as const;

// type EventType = (typeof ALLOWED_EVENTS)[number];

// export async function POST(req: Request) {
//   try {
//     await dbConnect();

//     const body = await req.json();

//     const partnerCode = String(body.partnerCode || "").toLowerCase().trim();
//     const visitorId = String(body.visitorId || "").trim();
//     const eventType = String(body.eventType || "").trim() as EventType;

//     const revenue = Number(body.revenue || 0);
//     const orderId = body.orderId ? String(body.orderId).trim() : undefined;
//     const metadata = body.metadata ?? {};

//     // ---------------- VALIDATION ----------------
//     if (!partnerCode || !visitorId || !eventType) {
//       return NextResponse.json(
//         { error: "partnerCode, visitorId and eventType are required" },
//         { status: 400 }
//       );
//     }

//     if (!ALLOWED_EVENTS.includes(eventType)) {
//       return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
//     }

//     // ---------------- CHECK PARTNER ----------------
//     const partner = await Partner.findOne({
//       code: partnerCode,
//       active: true,
//     });

//     if (!partner) {
//       return NextResponse.json(
//         { error: "Partner not found" },
//         { status: 404 }
//       );
//     }

//     // ---------------- VISIT DEDUP (DAILY ONLY) ----------------
//     if (eventType === "visit") {
//       const startOfDay = new Date();
//       startOfDay.setHours(0, 0, 0, 0);

//       const exists = await ReferralEvent.findOne({
//         partnerCode,
//         visitorId,
//         eventType: "visit",
//         createdAt: { $gte: startOfDay },
//       });

//       if (exists) {
//         return NextResponse.json({
//           success: true,
//           skipped: true,
//           message: "Visit already tracked today",
//         });
//       }
//     }

//     if (eventType === "product_view") {
//       const exists = await ReferralEvent.findOne({
//         partnerCode,
//         visitorId,
//         eventType: "product_view",
//         "metadata.productId": metadata?.productId,
//       });

//       if (exists) return;
//     }
    

//     // ---------------- ORDER DEDUP ----------------
//     if (["checkout", "purchase"].includes(eventType) && orderId) {
//       const exists = await ReferralEvent.findOne({
//         eventType,
//         orderId,
//       });

//       if (exists) {
//         return NextResponse.json({
//           success: true,
//           skipped: true,
//           message: `${eventType} already recorded`,
//         });
//       }
//     }

//     // ---------------- CREATE EVENT ----------------
//     const event = await ReferralEvent.create({
//       partnerCode,
//       visitorId,
//       eventType,
//       revenue,
//       orderId,
//       metadata,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         event,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("Referral Event Error:", error);

//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }