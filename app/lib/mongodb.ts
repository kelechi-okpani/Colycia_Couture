import mongoose from "mongoose";
import "@/app/lib/models/user";
import "@/app/lib/models/product";

import { seedAdmin } from "./scripts/seedAdmin";

const MONGODB_URI:any = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,

    };
    
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (mongooseInstance) => {
        console.log("✅ MongoDB Connected");

        await seedAdmin();

        console.log("✅ Seed finished");

        return mongooseInstance;
      });
    
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

export default dbConnect;


// import mongoose from 'mongoose';
// import '@/app/lib/models/user';
// import '@/app/lib/models/product';


// const MONGODB_URI:any = process.env.MONGODB_URI
// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
// }

// let cached = (global as any).mongoose;

// if (!cached) {
//   cached = (global as any).mongoose = { conn: null, promise: null };
// }

// async function dbConnect() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     const opts = { bufferCommands: false };
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log("✅ MongoDB Connected");
//       return mongoose;
//     });
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default dbConnect;