// app/api/products/route.ts
import dbConnect from '@/app/lib/mongodb';
import Product from '@/app/lib/models/product'; 
import { NextResponse } from 'next/server';



// READ ALL
// export async function GET() {
//   await dbConnect();
//   const products = await Product.find({}).sort({ createdAt: -1 });
//   return NextResponse.json(products);
// }

// // CREATE
// export async function POST(req: Request) {
//   await dbConnect();
//   const body = await req.json();
//   const product = await Product.create(body);
//   return NextResponse.json(product, { status: 201 });
// }

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    console.error("GET PRODUCTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message }, 
      { status: 500 }
    );
  }
}

// CREATE
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Check if body is valid JSON
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("POST PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message }, 
      { status: 500 }
    );
  }
}