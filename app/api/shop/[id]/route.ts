import dbConnect from '@/app/lib/mongodb';
import Product from '@/app/lib/models/product';
import { NextResponse, NextRequest } from 'next/server';


type RouteContext = {
  params: Promise<{ id: string }>; // In Next.js 15, params is a Promise
};


export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Define params as a Promise
) {
  try {
    await dbConnect();
    
    // CRITICAL FIX: Unwrapping the params promise
    const { id } = await params; 
    
    const product = await Product.findById(id);
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Invalid Product ID format" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  await dbConnect();
  const { id } = await params; // You MUST await the params
  const body = await req.json();
  
  const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true });
  return NextResponse.json(updatedProduct);
}


export async function DELETE(req: NextRequest, { params }: RouteContext) {
  await dbConnect();
  const { id } = await params; // You MUST await the params
  
  await Product.findByIdAndDelete(id);
  return NextResponse.json({ message: "Product deleted" });
}


// UPDATE & DELETE (Using a dynamic ID)
// app/api/admin/products/[id]/route.ts


// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();
//   const body = await req.json();
//   const updatedProduct = await Product.findByIdAndUpdate(params.id, body, { new: true });
//   return NextResponse.json(updatedProduct);
// }

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   await dbConnect();
//   await Product.findByIdAndDelete(params.id);
//   return NextResponse.json({ message: "Product deleted" });
// }