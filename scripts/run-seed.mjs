import { loadEnvFile } from 'node:process';
try {
  loadEnvFile('.env.local');
} catch (e) {
  console.log("Note: could not load .env.local:", e.message);
}

async function run() {
  console.log("Starting DB seed with environment variables...");
  const { seedInitialData } = await import('../src/lib/seed.js');
  try {
    await seedInitialData(true);
    console.log("✨ Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

run();
