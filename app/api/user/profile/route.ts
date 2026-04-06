// app/api/user/profile/route.ts
import User from '@/app/lib/models/user';
import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';


export async function PUT(req: Request) {
  await dbConnect();
  const { userId, ...updateData } = await req.json();

  // Prevent password updates through this route
  delete updateData.password;

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
  return NextResponse.json(updatedUser);
}