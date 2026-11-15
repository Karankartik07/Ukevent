import { loadEnvFile } from 'node:process';
try {
  loadEnvFile('.env.local');
} catch (e) {}

import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const MONGODB_URI = process.env.MONGODB_URI;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
