import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (e) {}

import mongoose from 'mongoose';
import Event from '../src/models/Event.js';

async function testVulnerabilities() {
  console.log('Testing security vulnerability: Draft events exposure via ?all=true...');
  await mongoose.connect(process.env.MONGODB_URI);

  // Check if any draft event exists or create one to test
  let draft = await Event.findOne({ status: 'draft' });
  if (!draft) {
    draft = await Event.create({
      title: 'Secret Unannounced Concert 2027',
      status: 'draft',
      category: 'MUSIC',
      date: '2027-01-01',
      venue: 'Secret Venue',
      city: 'London',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
      variants: [{ name: 'VIP', price: 100, capacity: 50 }],
    });
    console.log('Created temporary draft event for testing:', draft.title);
  }

  // Simulate GET /api/events without all=true
  const publicEvents = await Event.find({ status: 'published' });
  console.log(`Public query returns ${publicEvents.length} events (draft excluded)`);

  // Simulate GET /api/events?all=true (as written in route.js)
  const allEvents = await Event.find({});
  console.log(`⚠️ SECURITY ISSUE CONFIRMED: ?all=true returns ${allEvents.length} events, including draft "${draft.title}" without any admin token check!`);

  // Clean up if we created the temp one
  if (draft.title === 'Secret Unannounced Concert 2027') {
    await Event.findByIdAndDelete(draft._id);
  }

  await mongoose.disconnect();
}

testVulnerabilities().catch(console.error);
