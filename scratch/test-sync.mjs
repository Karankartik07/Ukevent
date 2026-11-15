import connectDB from '../src/lib/mongodb.js';
import Event from '../src/models/Event.js';
import { areEventsDuplicate, deduplicateEvents } from '../src/lib/eventDeduplication.js';

async function testSync() {
  await connectDB();
  console.log('Connected to MongoDB');

  const SAMPLE_EXTERNAL_FEEDS = [
    {
      title: 'Diljit Dosanjh - Dil-Luminati UK Arena Showcase',
      subtitle: 'Live UK Stadium Concert',
      description: 'Punjabi global sensation Diljit Dosanjh brings the iconic Dil-Luminati Tour back to London Wembley with grand production, dancers, and high-energy bhangra hits.',
      category: 'MUSIC',
      date: '2026-11-21',
      time: '19:30',
      displayMonth: 'NOV',
      displayDay: '21',
      venue: 'OVO Arena Wembley',
      city: 'London',
      address: 'Arena Square, Engineers Way, London HA9 0AA',
      imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80',
      ticketUrl: 'https://www.ticketmaster.co.uk/event/diljit-dosanjh-london',
      openInNewTab: true,
      sourcePlatform: 'TICKETMASTER',
      sourceEventId: 'tm_uk_diljit_20261121',
      priceDisplay: 'from £45.00',
      isFeatured: true,
      status: 'published',
      variants: [
        { name: 'Standard Seating', price: 45, capacity: 500, description: 'Tiered arena seat' },
        { name: 'VIP Golden Circle', price: 120, capacity: 150, description: 'Floor standing front stage' },
      ],
    },
    {
      title: 'London South Asian Sufi & Ghazal Night',
      subtitle: 'Soulful acoustic diaspora evening',
      description: 'An enchanting evening of soulful qawwalis, ghazals, and acoustic diaspora melodies in Central London.',
      category: 'MUSIC',
      date: '2026-11-18',
      time: '19:00',
      displayMonth: 'NOV',
      displayDay: '18',
      venue: 'Cadogan Hall',
      city: 'London',
      address: '5 Sloane Terrace, London SW1X 9DQ',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
      ticketUrl: 'https://www.eventbrite.co.uk/e/london-sufi-ghazal-night-tickets',
      openInNewTab: true,
      sourcePlatform: 'EVENTBRITE',
      sourceEventId: 'eb_uk_sufi_20261118',
      priceDisplay: '£22.50',
      isFeatured: true,
      status: 'published',
      variants: [
        { name: 'General Admission', price: 22.5, capacity: 200, description: 'Hall entry' },
      ],
    },
    {
      title: 'Birmingham South Asian Street Food & Craft Bazaar',
      subtitle: 'Free Community Entry & Festive Markets',
      description: 'Authentic South Asian street delicacies, chaats, artisanal shawls, jewellery, and festive shopping across Digbeth.',
      category: 'FOOD',
      date: '2026-11-22',
      time: '11:00',
      displayMonth: 'NOV',
      displayDay: '22',
      venue: 'The Custard Factory, Digbeth',
      city: 'Birmingham',
      address: 'Gibb St, Deritend, Birmingham B9 4AA',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
      ticketUrl: 'https://allevents.in/birmingham/south-asian-food-bazaar',
      openInNewTab: true,
      sourcePlatform: 'ALLEVENTS',
      sourceEventId: 'ae_bham_food_20261122',
      priceDisplay: 'FREE ENTRY',
      isFeatured: false,
      status: 'published',
      variants: [
        { name: 'Free RSVP Pass', price: 0, capacity: 1000, description: 'Complimentary gate entry' },
      ],
    },
    {
      title: 'Manchester Desi Comedy & Standup Gala',
      subtitle: 'Hilarious comedy from top diaspora comedians',
      description: 'Top British-Asian comedians take over Manchester for an evening of relentless laughs, culture, and storytelling.',
      category: 'COMMUNITY',
      date: '2026-11-19',
      time: '20:00',
      displayMonth: 'NOV',
      displayDay: '19',
      venue: 'The Dancehouse',
      city: 'Manchester',
      address: '10A Oxford Rd, Manchester M1 5QA',
      imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=1200&auto=format&fit=crop&q=80',
      ticketUrl: 'https://www.eventbrite.co.uk/e/manchester-desi-comedy-tickets',
      openInNewTab: true,
      sourcePlatform: 'EVENTBRITE',
      sourceEventId: 'eb_mcr_comedy_20261119',
      priceDisplay: 'from £16.00',
      isFeatured: false,
      status: 'published',
      variants: [
        { name: 'Standard Seat', price: 16, capacity: 180, description: 'Row seating' },
      ],
    },
  ];

  const existingEvents = await Event.find({}).lean();
  console.log('Existing events in DB before sync:', existingEvents.length);

  let inserted = 0;
  let duplicates = 0;

  for (const candidate of SAMPLE_EXTERNAL_FEEDS) {
    const isDup = existingEvents.some((ex) => areEventsDuplicate(ex, candidate));
    if (isDup) {
      console.log('Duplicate detected, skipping:', candidate.title);
      duplicates++;
      continue;
    }

    await Event.create({
      title: candidate.title,
      subtitle: candidate.subtitle,
      description: candidate.description,
      category: candidate.category,
      date: candidate.date,
      time: candidate.time,
      displayMonth: candidate.displayMonth,
      displayDay: candidate.displayDay,
      venue: candidate.venue,
      city: candidate.city,
      address: candidate.address,
      imageUrl: candidate.imageUrl,
      ticketUrl: candidate.ticketUrl,
      openInNewTab: candidate.openInNewTab,
      sourcePlatform: candidate.sourcePlatform,
      sourceEventId: candidate.sourceEventId,
      priceDisplay: candidate.priceDisplay,
      isFeatured: candidate.isFeatured,
      status: candidate.status,
      variants: candidate.variants,
    });
    inserted++;
    console.log('Inserted new event:', candidate.title, `(${candidate.sourcePlatform})`);
  }

  console.log(`Sync test complete. Inserted: ${inserted}, Duplicates skipped: ${duplicates}`);
  process.exit(0);
}

testSync().catch((err) => {
  console.error(err);
  process.exit(1);
});
