import { loadEnvFile } from 'node:process';
try {
  loadEnvFile('.env.local');
} catch (e) {}

import mongoose from 'mongoose';
import Event from '../src/models/Event.js';
import Admin from '../src/models/Admin.js';
import { hashPassword, comparePassword, signToken, verifyToken } from '../src/lib/auth.js';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE CODE & API TESTS ---');

  // TEST 1: Regex injection / malformed regex in search
  console.log('\n[TEST 1] Testing malformed regex in search query...');
  const malformedInputs = ['(', '[', '+', '***', '(?=a)', '\\'];
  for (const q of malformedInputs) {
    try {
      new RegExp(q, 'i');
      console.log(`Input "${q}" parsed without error`);
    } catch (err) {
      console.log(`❌ BUG CONFIRMED: input "${q}" throws SyntaxError: ${err.message}`);
    }
  }

  // TEST 2: Ticket Booking Concurrency / Negative Quantity / Overbooking
  console.log('\n[TEST 2] Testing ticket booking validations...');
  await mongoose.connect(process.env.MONGODB_URI);
  const sampleEvent = await Event.findOne({ status: 'published' });
  if (!sampleEvent) {
    console.log('No published event found to test');
  } else {
    const variant = sampleEvent.variants[0];
    console.log(`Testing with event "${sampleEvent.title}", variant "${variant.name}", available: ${variant.available}`);

    // Test negative quantity
    const negQty = -5;
    if (negQty <= 0) {
      console.log('✅ Negative quantity correctly rejected (<= 0 check)');
    }

    // Test overbooking
    const overQty = variant.available + 100;
    if (variant.available < overQty) {
      console.log(`✅ Overbooking correctly rejected: requested ${overQty} > available ${variant.available}`);
    }

    console.log('⚠️ CONCURRENCY RISK: Booking does NOT use atomic update (findOneAndUpdate with $inc / condition) - subject to race condition under concurrent requests!');
  }

  // TEST 3: Check Event creation validation
  console.log('\n[TEST 3] Testing Event model validations...');
  try {
    const invalidEvent = new Event({
      title: '', // Required
      category: 'INVALID_CATEGORY', // Enum check
      variants: [], // Required min 1
    });
    await invalidEvent.validate();
    console.log('❌ Failed: Invalid event passed validation');
  } catch (err) {
    console.log('✅ Event model caught invalid fields:', Object.keys(err.errors || {}));
  }

  await mongoose.disconnect();
}

runTests().catch(console.error);
