// app/api/auth/signup/route.ts
import dbConnect from '@/app/lib/mongodb';
import User from '@/app/lib/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { firstName, lastName, email, phone, password } = await req.json();

    // 1. Basic Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" }, 
        { status: 400 }
      );
    }

    // 2. Check if user already exists
    // We use .lean() for faster read-only performance
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" }, 
        { status: 400 }
      );
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create User
    const newUser = await User.create({ 
      firstName, 
      lastName, 
      email, 
      phone,
      password: hashedPassword 
    });

    return NextResponse.json(
      { message: "User created successfully", userId: newUser._id }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "An internal error occurred" }, 
      { status: 500 }
    );
  }
}