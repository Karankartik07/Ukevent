import { loadEnvFile } from 'node:process';
try { loadEnvFile('.env.local'); } catch (e) {}

import mongoose from 'mongoose';

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI);
  const res = await mongoose.connection.db.collection('listings').updateMany(
    { category: 'Radio' },
    {
      $set: {
        category: 'Shopping',
        title: 'Shopping & Bazaars',
        subtitle: 'Ethnic Fashion & Jewellery',
        description: 'Silk sarees, bridal lehengas, gold jewellery, and handicraft emporiums in Wembley, Southall, and Leicester.',
      },
    }
  );
  console.log(`Updated ${res.modifiedCount} legacy Radio listings to Shopping!`);
  await mongoose.disconnect();
}

migrate().catch(console.error);
