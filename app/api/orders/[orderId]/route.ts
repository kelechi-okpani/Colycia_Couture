import dbConnect from '@/app/lib/mongodb';
import Order from '@/app/lib/models/order';
import User from '@/app/lib/models/user';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> } // 1. Update type to Promise
) {
  try {
    await dbConnect();

    // 2. Await params before destructuring
    const { orderId } = await params; 
    
    const { status, adminId } = await req.json();

    // Debugging: Log the adminId to see what's being sent
    console.log("Verifying Admin ID:", adminId);

    // 3. Security Check
    const admin = await User.findById(adminId);
    
    if (!admin || admin.role !== 'admin') {
      console.log("Security Denied: User role is", admin?.role);
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // 4. Update the order status
    // Note: Ensure the field name matches your model (orderStatus vs status)
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true } 
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("PATCH Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}