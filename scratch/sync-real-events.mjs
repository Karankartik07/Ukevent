import connectDB from '../src/lib/mongodb.js';
import Event from '../src/models/Event.js';

async function updateRealEvents() {
  await connectDB();
  console.log('Connected to MongoDB');

  // Remove placeholder "London South Asian Sufi & Ghazal Night"
  await Event.deleteMany({
    title: { $regex: /Sufi & Ghazal Night|Desi Comedy & Standup Gala/i },
  });

  const REAL_EVENTS = [
    {
      title: 'London Thumakda - Bollywood Dance & Dine in Style',
      subtitle: 'Indian Bengalis in UK presents live Bollywood Gala',
      description: 'Groove to top Bollywood beats and savor delicious treats at London Thumakda – dance, dine, and celebrate at Indian Gymkhana Club.',
      category: 'MUSIC',
      date: '2026-11-21',
      time: '18:00',
      displayMonth: 'NOV',
      displayDay: '21',
      venue: 'Indian Gymkhana Club',
      city: 'London',
      address: 'Thornbury Ave, Osterley, Isleworth TW7 4NQ',
      imageUrl: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1194408721%2F3014844070034%2F1%2Foriginal.20260926-065635?crop=focalpoint&fit=crop&w=512&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=6581f08aca45c5aab632024005612fc0',
      ticketUrl: 'https://www.eventbrite.co.uk/e/indian-bengalis-in-uk-presents-london-thumakda-dance-and-dine-in-style-tickets-2002325803379',
      openInNewTab: true,
      sourcePlatform: 'EVENTBRITE',
      sourceEventId: '2002325803379',
      priceDisplay: 'from £25.00',
      isFeatured: true,
      status: 'published',
      variants: [
        { name: 'Standard Ticket', price: 25, capacity: 150, description: 'Direct Eventbrite Entry' },
      ],
    },
    {
      title: "Bollywood Unplugged Friday's at Farzi London",
      subtitle: 'Acoustic Bollywood Melodies & Fine Indian Dining',
      description: 'Join us at Farzi London for an intimate evening of unplugged Bollywood acoustic music and modern Indian cuisine in the heart of London Haymarket.',
      category: 'MUSIC',
      date: '2026-11-27',
      time: '19:00',
      displayMonth: 'NOV',
      displayDay: '27',
      venue: 'FARZI CAFE - London',
      city: 'London',
      address: '8 Haymarket, London SW1Y 4BP',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
      ticketUrl: 'https://www.eventbrite.co.uk/e/bollywood-unplugged-fridays-at-farzi-london-tickets-2004544738273',
      openInNewTab: true,
      sourcePlatform: 'EVENTBRITE',
      sourceEventId: '2004544738273',
      priceDisplay: 'from £15.00',
      isFeatured: true,
      status: 'published',
      variants: [
        { name: 'General Entry', price: 15, capacity: 100, description: 'Official Eventbrite Ticket' },
      ],
    },
    {
      title: "BOLLYXMAS: The UK's Only Christmas Bollywood Daytimer!",
      subtitle: 'Daytime Bollywood & Festive Party in Central London',
      description: 'Celebrate the festive season with non-stop Bollywood, Punjabi pop, and festive beats at Fire Nightclub Vauxhall.',
      category: 'MUSIC',
      date: '2026-12-05',
      time: '15:00',
      displayMonth: 'DEC',
      displayDay: '05',
      venue: 'Fire Nightclub, Vauxhall',
      city: 'London',
      address: 'South Lambeth Rd, London SW8 1RT',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
      ticketUrl: 'https://www.eventbrite.co.uk/e/bollyxmas-the-uks-only-christmas-bollywood-daytimer-tickets-2004666866562',
      openInNewTab: true,
      sourcePlatform: 'EVENTBRITE',
      sourceEventId: '2004666866562',
      priceDisplay: 'from £9.38',
      isFeatured: true,
      status: 'published',
      variants: [
        { name: 'Early Bird Entry', price: 9.38, capacity: 250, description: 'Live Eventbrite Entry' },
      ],
    },
  ];

  for (const ev of REAL_EVENTS) {
    const existing = await Event.findOne({ ticketUrl: ev.ticketUrl });
    if (!existing) {
      await Event.create(ev);
      console.log('Inserted real event:', ev.title);
    } else {
      await Event.updateOne({ ticketUrl: ev.ticketUrl }, { $set: ev });
      console.log('Updated existing real event:', ev.title);
    }
  }

  const all = await Event.find({ status: 'published' }).sort({ date: 1 }).lean();
  console.log('\nAll Live Published Events:');
  all.forEach((e) => console.log('-', e.title, `(${e.sourcePlatform}) =>`, e.ticketUrl));

  process.exit(0);
}

updateRealEvents().catch((err) => {
  console.error(err);
  process.exit(1);
});
