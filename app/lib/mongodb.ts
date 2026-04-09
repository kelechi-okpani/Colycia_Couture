import mongoose from 'mongoose';
import '@/app/lib/models/user';
import '@/app/lib/models/product';


const MONGODB_URI:any = process.env.MONGODB_URI || "mongodb+srv://Colycia:9dztgdgub7lKfr5V@colycia.qwe1apn.mongodb.net/?appName=Colycia";

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;