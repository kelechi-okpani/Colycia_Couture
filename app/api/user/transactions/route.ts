// app/api/user/transactions/route.ts
import Order from '@/app/lib/models/order';
import dbConnect from '@/app/lib/mongodb';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  const transactions = await Order.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(transactions);
}