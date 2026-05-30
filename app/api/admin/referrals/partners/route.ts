import dbConnect from "@/app/lib/mongodb";
import { Partner } from "@/app/lib/models/referral";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const name = body.name?.trim();
    const code = body.code?.trim();
    const commissionRate = Number(body.commissionRate || 0);

    if (!name || !code) {
      return NextResponse.json(
        {
          error: "Name and referral code are required",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number.isNaN(commissionRate) ||
      commissionRate < 0 ||
      commissionRate > 100
    ) {
      return NextResponse.json(
        {
          error:
            "Commission rate must be between 0 and 100",
        },
        {
          status: 400,
        }
      );
    }

    const formattedCode = code
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "");

    const existingPartner =
      await Partner.findOne({
        code: formattedCode,
      });

    if (existingPartner) {
      return NextResponse.json(
        {
          error:
            "Referral code already exists",
        },
        {
          status: 409,
        }
      );
    }

    const partner =
      await Partner.create({
        name,
        code: formattedCode,
        commissionRate,
        active: true,
      });

    return NextResponse.json(
      {
        success: true,
        partner,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(error);

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