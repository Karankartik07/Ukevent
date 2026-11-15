import connectDB from '../src/lib/mongodb.js';
import Event from '../src/models/Event.js';

async function fixLinks() {
  await connectDB();
  console.log('Connected to DB');

  const updates = [
    {
      match: 'London South Asian Sufi & Ghazal Night',
      url: 'https://www.eventbrite.co.uk/d/united-kingdom--london/indian-music/',
    },
    {
      match: 'Diljit Dosanjh - Dil-Luminati UK Arena Showcase',
      url: 'https://www.ticketmaster.co.uk/search?q=diljit+dosanjh',
    },
    {
      match: 'Birmingham South Asian Street Food & Craft Bazaar',
      url: 'https://allevents.in/birmingham/food',
    },
    {
      match: 'Manchester Desi Comedy & Standup Gala',
      url: 'https://www.eventbrite.co.uk/d/united-kingdom--manchester/comedy/',
    },
  ];

  for (const item of updates) {
    const res = await Event.updateOne(
      { title: { $regex: new RegExp(item.match, 'i') } },
      { $set: { ticketUrl: item.url } }
    );
    console.log(`Updated "${item.match}": matched ${res.matchedCount}, modified ${res.modifiedCount}`);
  }

  const all = await Event.find({}).lean();
  console.log('\nCurrent events in DB:');
  all.forEach((e) => console.log('-', e.title, '=>', e.ticketUrl));

  process.exit(0);
}

fixLinks().catch((err) => {
  console.error(err);
  process.exit(1);
});
