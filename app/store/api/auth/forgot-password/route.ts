// app/api/auth/forgot-password/route.ts
import User from '@/app/lib/models/user';
import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // For security, you might say "If an account exists, an email was sent"
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a plain-text token to send to user and a hashed version for the DB
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set expiry for 1 hour
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    // Logic for sending email would go here (e.g., using Resend or Nodemailer)
    // const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;

    return NextResponse.json({ 
      message: "Reset token generated", 
      token: resetToken // Returning it for testing; in production, send via email only
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}