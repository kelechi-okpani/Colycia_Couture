import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dbConnect from "@/app/lib/mongodb";
import User from "../models/user";




export async function seedAdmin() {
  try {
    const adminEmail = "admin@colyciacouture.com";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      "Admin@cc123456",
      12
    );

    const admin = await User.create({
      firstName: "Colycia",
      lastName: "Admin",
      email: adminEmail,
      phone: "08000000000",
      password: hashedPassword,
      role: "admin",
    });

    console.log(
      "✅ Admin created successfully:",
      admin.email
    );
  } catch (error) {
    console.error(
      "❌ Failed to seed admin:",
      error
    );
  }
}