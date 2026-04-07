// app/api/products/route.ts
import dbConnect from '@/app/lib/mongodb';
import Product from '@/app/lib/models/product'; 
import { NextResponse } from 'next/server';



// READ ALL
export async function GET() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 });
  return NextResponse.json(products);
}

// CREATE
export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}

