import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (e) {}

import mongoose from 'mongoose';
import Event from '../src/models/Event.js';

async function testExternalBookingLinks() {
  console.log('--- Testing External Booking Link Fields ---');
  await mongoose.connect(process.env.MONGODB_URI);

  // 1. Update existing events to have sample ticket URLs if empty
  const events = await Event.find({});
  console.log(`Found ${events.length} events in database.`);

  for (const ev of events) {
    if (!ev.ticketUrl) {
      ev.ticketUrl = 'https://www.ticketmaster.co.uk';
      ev.openInNewTab = true;
      await ev.save();
      console.log(`Updated event "${ev.title}" with ticketUrl: ${ev.ticketUrl}`);
    }
  }

  // 2. Validate Event schema accepts ticketUrl and openInNewTab
  const testEv = new Event({
    title: 'Test External Link Event',
    category: 'MUSIC',
    date: '2026-12-31',
    venue: 'O2 Arena',
    city: 'London',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819',
    ticketUrl: 'https://www.axs.com/uk',
    openInNewTab: true,
    variants: [{ name: 'Standard', price: 50, capacity: 100 }],
  });

  await testEv.validate();
  console.log('✅ Event model validation passed with ticketUrl and openInNewTab!');

  await mongoose.disconnect();
  console.log('--- All tests passed! ---');
}

testExternalBookingLinks().catch(console.error);
