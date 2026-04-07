import dbConnect from '@/app/lib/mongodb';
import User from '@/app/lib/models/user';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      // Security: Don't reveal if a user exists or not
      return NextResponse.json({ 
        message: "If an account exists, a reset link has been sent." 
      }, { status: 200 });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // Generate the URL for your frontend
    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/reset-password?token=${resetToken}`;
    console.log("Reset URL:", resetUrl); // For your terminal testing

    return NextResponse.json({ 
      success: true,
      message: "Reset link generated",
      token: resetToken // Only for development/testing
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}