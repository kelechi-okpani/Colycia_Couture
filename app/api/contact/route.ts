import { ContactMessage } from "@/app/lib/models/contact";
import dbConnect from "@/app/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const { firstName, lastName, email, phone, message } = body;

    // ---------------- VALIDATION ----------------
    if (!firstName || !lastName || !email || !phone || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (message.length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    const contact = await ContactMessage.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      { success: true, contact },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact Error:", error);

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}