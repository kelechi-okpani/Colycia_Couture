import dbConnect from "@/app/lib/mongodb";
import {
  Partner,
  ReferralEvent,
} from "@/app/lib/models/referral";

import { NextResponse } from "next/server";

export const dynamic =
  "force-dynamic";

export async function GET() {
  try {
    await dbConnect();

    const partners =
      await Partner.find({})
        .lean()
        .sort({
          createdAt: -1,
        });

  const stats = await ReferralEvent.aggregate([
  {
    $group: {
      _id: "$partnerCode",

      visits: {
        $sum: {
          $cond: [
            { $eq: ["$eventType", "visit"] },
            1,
            0,
          ],
        },
      },

      productViews: {
        $sum: {
          $cond: [
            { $eq: ["$eventType", "product_view"] },
            1,
            0,
          ],
        },
      },

      addToCart: {
        $sum: {
          $cond: [
            { $eq: ["$eventType", "add_to_cart"] },
            1,
            0,
          ],
        },
      },

      checkouts: {
        $sum: {
          $cond: [
            { $eq: ["$eventType", "checkout"] },
            1,
            0,
          ],
        },
      },

      purchases: {
        $sum: {
          $cond: [
            { $eq: ["$eventType", "purchase"] },
            1,
            0,
          ],
        },
      },

      totalRevenue: {
        $sum: {
          $cond: [
            { $eq: ["$eventType", "purchase"] },
            "$revenue",
            0,
          ],
        },
      },

      uniqueVisitors: {
        $addToSet: "$visitorId",
      },
    },
  },

  {
    $project: {
      partnerCode: "$_id",

      visits: 1,
      productViews: 1,
      addToCart: 1,
      checkouts: 1,
      purchases: 1,
      totalRevenue: 1,

      uniqueVisitors: {
        $size: "$uniqueVisitors",
      },

      visitToCartRate: {
        $cond: [
          { $eq: ["$visits", 0] },
          0,
          {
            $multiply: [
              {
                $divide: [
                  "$addToCart",
                  "$visits",
                ],
              },
              100,
            ],
          },
        ],
      },

      cartToCheckoutRate: {
        $cond: [
          { $eq: ["$addToCart", 0] },
          0,
          {
            $multiply: [
              {
                $divide: [
                  "$checkouts",
                  "$addToCart",
                ],
              },
              100,
            ],
          },
        ],
      },

      checkoutToPurchaseRate: {
        $cond: [
          { $eq: ["$checkouts", 0] },
          0,
          {
            $multiply: [
              {
                $divide: [
                  "$purchases",
                  "$checkouts",
                ],
              },
              100,
            ],
          },
        ],
      },

      overallConversionRate: {
        $cond: [
          { $eq: ["$visits", 0] },
          0,
          {
            $multiply: [
              {
                $divide: [
                  "$purchases",
                  "$visits",
                ],
              },
              100,
            ],
          },
        ],
      },
    },
  },
  ]);


  const counts = await ReferralEvent.aggregate([
  {
    $group: {
      _id: "$eventType",
      count: { $sum: 1 },
    },
  },
]);

console.log(counts);


    const finalData =
      partners.map(
        (partner: any) => {
          const stat =
            stats.find(
              (item) =>
                item.partnerCode ===
                partner.code
            );

          const revenue =
            stat?.totalRevenue ||
            0;

          const commission =
            revenue *
            (partner.commissionRate /
              100);

         return {
            partnerCode: partner.code,

            partnerName: partner.name,

            commissionRate:
              partner.commissionRate,

            visits:
              stat?.visits || 0,

            uniqueVisitors:
              stat?.uniqueVisitors || 0,

            productViews:
              stat?.productViews || 0,

            addToCart:
              stat?.addToCart || 0,

            checkouts:
              stat?.checkouts || 0,

            purchases:
              stat?.purchases || 0,

            totalRevenue: revenue,

            commissionEarned:
              commission,

            visitToCartRate:
              stat?.visitToCartRate || 0,

            cartToCheckoutRate:
              stat?.cartToCheckoutRate || 0,

            checkoutToPurchaseRate:
              stat?.checkoutToPurchaseRate || 0,

            overallConversionRate:
              stat?.overallConversionRate || 0,
          };
        }
      );

    finalData.sort(
      (a, b) =>
        b.totalRevenue -
        a.totalRevenue
    );

    return NextResponse.json(
      finalData
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}



