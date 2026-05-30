import { ContactMessage } from "@/app/lib/models/contact";
import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const messages = await ContactMessage.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(messages);
  } catch (error:any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}