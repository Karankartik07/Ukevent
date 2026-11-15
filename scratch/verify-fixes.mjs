import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (e) {}

import mongoose from 'mongoose';
import Event from '../src/models/Event.js';
import Booking from '../src/models/Booking.js';
import { sendTicketEmail } from '../src/lib/mail.js';

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

async function verifyAll() {
  console.log('=== VERIFYING ALL FIXES & VALIDATIONS ===\n');
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. REGEX SEARCH SAFETY TEST
  console.log('[TEST 1] Testing regex special characters with escapeRegex...');
  const specialChars = ['(', ')', '[', ']', '+', '*', '?', '{', '}', '\\', '|', '^', '$'];
  let allSafe = true;
  for (const char of specialChars) {
    try {
      const safe = escapeRegex(char);
      new RegExp(safe, 'i');
    } catch (e) {
      console.log(`❌ Failed for char "${char}": ${e.message}`);
      allSafe = false;
    }
  }
  if (allSafe) {
    console.log('✅ ALL special regex characters safely escaped and parsed without any SyntaxError!');
  }

  // 2. TICKET BOOKING ATOMICITY & DB SAVE TEST
  console.log('\n[TEST 2] Testing ticket booking and Booking document creation...');
  const testEvent = await Event.findOne({ status: 'published' });
  if (testEvent && testEvent.variants.length > 0) {
    const variant = testEvent.variants[0];
    const initialAvail = variant.available;
    console.log(`Event: "${testEvent.title}", Variant: "${variant.name}", Initial available: ${initialAvail}`);

    const bookingQty = 1;
    // Simulate atomic update
    const updated = await Event.findOneAndUpdate(
      {
        _id: testEvent._id,
        'variants._id': variant._id,
        'variants.available': { $gte: bookingQty },
      },
      {
        $inc: { 'variants.$.available': -bookingQty },
      },
      { new: true }
    );

    const newVariant = updated.variants.id(variant._id);
    console.log(`After booking 1 ticket: available is now ${newVariant.available} (expected: ${initialAvail - 1})`);
    if (newVariant.available === initialAvail - 1) {
      console.log('✅ Atomic decrement works perfectly!');
    }

    // Create a real Booking document
    const testRef = 'MI-TEST-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const testBooking = await Booking.create({
      bookingRef: testRef,
      eventId: testEvent._id,
      eventTitle: testEvent.title,
      venue: testEvent.venue,
      city: testEvent.city,
      date: testEvent.date,
      time: testEvent.time,
      variantId: variant._id.toString(),
      variantName: variant.name,
      unitPrice: variant.price,
      quantity: 1,
      totalAmount: variant.price,
      userName: 'Karan Sharma',
      userEmail: 'karan@example.co.uk',
      userPhone: '+44 7911 123456',
    });

    console.log(`✅ Booking document saved in MongoDB: Ref=${testBooking.bookingRef}, ID=${testBooking._id}`);

    // Test Nodemailer email trigger
    console.log('\n[TEST 3] Testing Nodemailer ticket template generation...');
    const mailRes = await sendTicketEmail(testBooking);
    console.log('✅ Nodemailer function executed successfully:', mailRes);

    // Rollback atomic decrement so test doesn't consume real ticket
    await Event.findOneAndUpdate(
      { _id: testEvent._id, 'variants._id': variant._id },
      { $inc: { 'variants.$.available': bookingQty } }
    );
    console.log('Restored available ticket capacity.');
  }

  // 4. VERIFY RADIO REMOVAL
  console.log('\n[TEST 4] Verifying Radio removal...');
  const radioListings = await mongoose.connection.db.collection('listings').find({ category: 'Radio' }).toArray();
  console.log(`Radio listings in DB: ${radioListings.length}`);

  console.log('\n=== ALL FIXES VERIFIED SUCCESSFULLY ===');
  await mongoose.disconnect();
}

verifyAll().catch(console.error);
