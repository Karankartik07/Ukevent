import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const MONGODB_URI = "mongodb+srv://karankartik134_db_user:ckiUL5loCaASJWvq@cluster0.rosczfu.mongodb.net/meraindia?retryWrites=true&w=majority";

cloudinary.config({
  cloud_name: "o31b8mid",
  api_key: "265763766552385",
  api_secret: "spandgbeXSySclw0HNPxRdHlrSs",
  secure: true,
});

async function testAll() {
  console.log("Testing MongoDB connection...");
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    console.log("✅ MongoDB Connected successfully!");
    console.log("Database name:", mongoose.connection.name);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }

  console.log("\nTesting Cloudinary connection...");
  try {
    const res = await cloudinary.api.ping();
    console.log("✅ Cloudinary Connected successfully! Ping status:", res.status);
  } catch (err) {
    console.error("❌ Cloudinary error:", err.message);
  }
}

testAll();
