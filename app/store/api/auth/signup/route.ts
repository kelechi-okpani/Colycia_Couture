// app/api/auth/signup/route.ts
import User from '@/app/lib/models/user';
import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';


export async function POST(req: Request) {
  try {
    await dbConnect();
    const { firstName, lastName, email, password } = await req.json();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Create User
    await User.create({ 
      firstName, 
      lastName, 
      email, 
      password: hashedPassword 
    });

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}