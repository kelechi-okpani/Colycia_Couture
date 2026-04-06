// app/api/admin/products/route.ts
import Product from '@/app/lib/models/product';
import User from '@/app/lib/models/user';
import dbConnect from '@/app/lib/mongodb';
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

// UPDATE & DELETE (Using a dynamic ID)
// app/api/admin/products/[id]/route.ts
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const updatedProduct = await Product.findByIdAndUpdate(params.id, body, { new: true });
  return NextResponse.json(updatedProduct);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Product deleted" });
}