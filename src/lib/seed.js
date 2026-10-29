import connectDB from './mongodb.js';
import Admin from '../models/Admin.js';
import Event from '../models/Event.js';
import Listing from '../models/Listing.js';
import { hashPassword } from './auth.js';

export async function seedInitialData(force = false) {
  await connectDB();

  // 1. Seed Admin
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0 || force) {
    const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@meraindia.co.uk';
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@12345';
    const hashedPassword = await hashPassword(defaultPassword);

    await Admin.findOneAndUpdate(
      { email: defaultEmail },
      {
        name: 'MeraIndia Administrator',
        email: defaultEmail,
        password: hashedPassword,
        role: 'superadmin',
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Default admin created/verified: ${defaultEmail}`);
  }

  // 2. Seed Events if empty
  const eventCount = await Event.countDocuments();
  if (eventCount === 0 || force) {
    if (force) {
      await Event.deleteMany({});
    }

    const sampleEvents = [
      {
        title: 'Sonu Nigam - Revolution Tour UK',
        slug: 'sonu-nigam-revolution-tour-uk',
        subtitle: 'Sonu Nigam Revolution',
        description: 'Bollywood’s golden voice Sonu Nigam returns to the UK for a spectacular live arena concert featuring his greatest romantic, classical, and pop hits with a full symphonic orchestra.',
        category: 'MUSIC',
        date: '2026-08-23',
        time: '18:30',
        displayMonth: 'AUG',
        displayDay: '23',
        venue: 'OVO Arena Wembley',
        city: 'London',
        address: 'Arena Square, Engineers Way, Wembley Park, London HA9 0AA',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        tags: ['Bollywood', 'Concert', 'Live Music', 'Wembley'],
        variants: [
          {
            name: 'Standard Seating',
            price: 45,
            currency: 'GBP',
            capacity: 350,
            available: 280,
            description: 'Upper tier reserved seating with excellent arena views.',
          },
          {
            name: 'Gold Circle Tier',
            price: 85,
            currency: 'GBP',
            capacity: 150,
            available: 90,
            description: 'Lower tier prime viewing with fast-track arena entry.',
          },
          {
            name: 'VIP Front Row & Hospitality',
            price: 150,
            currency: 'GBP',
            capacity: 40,
            available: 18,
            description: 'Front 3 rows seating, souvenir lanyard, and lounge access.',
          },
        ],
      },
      {
        title: 'Ilaiyaraaja 50 - Golden Jubilee Tour',
        slug: 'ilaiyaraaja-50-golden-jubilee-tour',
        subtitle: '50 Years of Music Excellence',
        description: 'Celebrate the maestro Isaignani Ilaiyaraaja live in concert with an 85-piece symphony orchestra, legendary playback singers, and half a century of timeless film melodies.',
        category: 'MUSIC',
        date: '2026-07-11',
        time: '19:00',
        displayMonth: 'JUL',
        displayDay: '11',
        venue: 'The O2 Arena',
        city: 'London',
        address: 'Peninsula Square, London SE10 0DX',
        imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1000&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        tags: ['South Indian', 'Orchestra', 'Ilaiyaraaja', 'The O2'],
        variants: [
          {
            name: 'Balcony Reserved',
            price: 38,
            currency: 'GBP',
            capacity: 250,
            available: 195,
            description: 'Level 4 seating with panoramic acoustic balance.',
          },
          {
            name: 'Orchestra Stalls',
            price: 70,
            currency: 'GBP',
            capacity: 180,
            available: 120,
            description: 'Ground floor seating closest to the live orchestra.',
          },
          {
            name: 'Platinum Jubilee Pass',
            price: 130,
            currency: 'GBP',
            capacity: 50,
            available: 22,
            description: 'Prime central block seats + commemorative booklet.',
          },
        ],
      },
      {
        title: 'Atif Aslam Live in Concert UK',
        slug: 'atif-aslam-live-in-concert-uk',
        subtitle: 'Borderless World Presents Atif Aslam',
        description: 'The global music sensation Atif Aslam brings soulful sufi, rock, and heartfelt Bollywood chartbusters to London in an electrifying stadium showcase.',
        category: 'MUSIC',
        date: '2026-06-14',
        time: '19:30',
        displayMonth: 'JUN',
        displayDay: '14',
        venue: 'The O2 Arena',
        city: 'London',
        address: 'Peninsula Square, London SE10 0DX',
        imageUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1000&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        tags: ['Atif Aslam', 'Sufi', 'Bollywood', 'Live Concert'],
        variants: [
          {
            name: 'Standard Ticket',
            price: 42,
            currency: 'GBP',
            capacity: 400,
            available: 310,
            description: 'Standard reserved seating inside the arena.',
          },
          {
            name: 'Silver Floor Standing',
            price: 65,
            currency: 'GBP',
            capacity: 200,
            available: 140,
            description: 'Floor standing area close to stage catwalk.',
          },
          {
            name: 'VIP Golden Circle',
            price: 120,
            currency: 'GBP',
            capacity: 60,
            available: 25,
            description: 'Enclosed front stage pit with early access.',
          },
        ],
      },
      {
        title: 'London Diwali Grand Mela & Fireworks',
        slug: 'london-diwali-grand-mela-and-fireworks',
        subtitle: 'UK Biggest Festival of Lights Gathering',
        description: 'Over 30,000 community members gather for live Garba, classical Kuchipudi, artisanal handicraft bazaars, mouthwatering street foods, and an epic laser light & fireworks finale.',
        category: 'FESTIVAL',
        date: '2026-11-01',
        time: '12:00',
        displayMonth: 'NOV',
        displayDay: '01',
        venue: 'Trafalgar Square & Byron Park',
        city: 'London',
        address: 'Trafalgar Square, Westminster, London WC2N 5DN',
        imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        tags: ['Diwali', 'Festival of Lights', 'Food Stall', 'Family'],
        variants: [
          {
            name: 'Free Public Entry Pass',
            price: 0,
            currency: 'GBP',
            capacity: 1000,
            available: 820,
            description: 'General public admission to the festival grounds.',
          },
          {
            name: 'VIP Family Tent Pass',
            price: 25,
            currency: 'GBP',
            capacity: 120,
            available: 78,
            description: 'Covered seating marquee, mithai gift box, and prime view of fireworks.',
          },
        ],
      },
      {
        title: 'UK South Asian Eid Bazaar & Food Fair',
        slug: 'uk-south-asian-eid-bazaar-food-fair',
        subtitle: 'Celebration of Cuisine, Modest Fashion & Culture',
        description: 'Discover 150+ designer stalls featuring hand-embroidered kurtas, bridal lehengas, authentic Lucknowi biryanis, Karachi street snacks, and family fun games.',
        category: 'FESTIVAL',
        date: '2026-06-18',
        time: '11:00',
        displayMonth: 'JUN',
        displayDay: '18',
        venue: 'NEC Birmingham Hall 5',
        city: 'Birmingham',
        address: 'National Exhibition Centre, North Ave, Birmingham B40 1NT',
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        tags: ['Eid', 'Fashion', 'Halal Food', 'Birmingham'],
        variants: [
          {
            name: 'Single Day Entry',
            price: 10,
            currency: 'GBP',
            capacity: 600,
            available: 480,
            description: 'Full day access to shopping bazaar and food courts.',
          },
          {
            name: 'VIP Weekend Shopper Pass',
            price: 22,
            currency: 'GBP',
            capacity: 100,
            available: 64,
            description: 'Priority valet parking + goodie bag + lounge pass.',
          },
        ],
      },
      {
        title: 'Holi Festival of Colours UK 2026',
        slug: 'holi-festival-of-colours-uk-2026',
        subtitle: 'Music, Joy, Organic Gulal & Dhol Beats',
        description: 'Immerse in joyful powder countdowns every hour with top UK Asian DJs, Punjabi Dhol drummers, live street food vendors, and vibrant dancing under the sky.',
        category: 'FESTIVAL',
        date: '2026-03-28',
        time: '13:00',
        displayMonth: 'MAR',
        displayDay: '28',
        venue: 'Queen Elizabeth Olympic Park',
        city: 'London',
        address: 'Olympic Park, London E20 2ST',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80',
        isFeatured: true,
        status: 'published',
        tags: ['Holi', 'Colours', 'Party', 'London'],
        variants: [
          {
            name: 'Entry + 2 Organic Colour Bags',
            price: 18,
            currency: 'GBP',
            capacity: 500,
            available: 390,
            description: 'Includes wristband and two 100g bags of certified natural skin-safe colour.',
          },
          {
            name: 'Squad Bundle (4 Tickets + 10 Colours)',
            price: 60,
            currency: 'GBP',
            capacity: 100,
            available: 72,
            description: 'Best value for groups of friends and families.',
          },
        ],
      },
    ];

    await Event.insertMany(sampleEvents);
    console.log(`✅ Seeded ${sampleEvents.length} events successfully.`);
  }

  // 3. Seed Cultural Listings if empty
  const listingCount = await Listing.countDocuments();
  if (listingCount === 0 || force) {
    if (force) {
      await Listing.deleteMany({});
    }

    const sampleListings = [
      {
        title: 'Festivals',
        category: 'Festivals',
        subtitle: 'UK Celebrations & Melas',
        description: 'Diwali, Eid, Holi, Vaisakhi, and Navratri cultural gatherings across London, Birmingham, and Leicester.',
        imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=600&auto=format&fit=crop&q=80',
        city: 'UK Wide',
      },
      {
        title: 'Restaurants',
        category: 'Restaurants',
        subtitle: 'Indian Dining & Street Food',
        description: 'Authentic regional thalis, Michelin-starred cuisine, chaat bazaars, and Punjabi tandoor across the UK.',
        imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
        city: 'London & Midlands',
      },
      {
        title: 'Travel',
        category: 'Travel',
        subtitle: 'Holidays & Heritage Tours',
        description: 'Trusted South Asian travel agencies, heritage tours to India, visa guidance, and spiritual journeys.',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&auto=format&fit=crop&q=80',
        city: 'UK Wide',
      },
      {
        title: 'Education',
        category: 'Education',
        subtitle: 'Language & Arts Academies',
        description: 'Hindi, Punjabi, Tamil, Gujarati weekend classes, classical Bharatnatyam, Kathak, and Tabla institutions.',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
        city: 'London & Leicester',
      },
      {
        title: 'Community',
        category: 'Community',
        subtitle: 'Charities & Networking',
        description: 'Diaspora welfare societies, business forums, youth mentoring, and women leadership networks.',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
        city: 'UK Wide',
      },
      {
        title: 'Radio',
        category: 'Radio',
        subtitle: 'Music & Community Broadcasts',
        description: '24/7 South Asian radio stations, Bollywood golden hits, news, and UK diaspora podcasts.',
        imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
        city: 'Digital DAB & Web',
      },
    ];

    await Listing.insertMany(sampleListings);
    console.log(`✅ Seeded ${sampleListings.length} cultural listings successfully.`);
  }

  return { success: true };
}
