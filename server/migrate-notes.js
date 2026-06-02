/**
 * migrate-notes.js
 * Run once: node migrate-notes.js
 *
 * - Adds `isPublic: true` to every note that is missing it
 * - Assigns a fallback `author` to notes that have none
 *   (uses the first User in the DB – adjust FALLBACK_USER_EMAIL if needed)
 *
 * Usage:
 *   MONGO_URI=mongodb://localhost:27017/notenest node migrate-notes.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./models/Note');
const User = require('./models/User'); // adjust path if needed

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/notenest';
const FALLBACK_USER_EMAIL = process.env.FALLBACK_EMAIL || null; // optional: pin to specific user

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB:', MONGO_URI);

  // ── 1. Find a fallback user for notes with no author ──────────────────────
  let fallbackUser;
  if (FALLBACK_USER_EMAIL) {
    fallbackUser = await User.findOne({ email: FALLBACK_USER_EMAIL });
  }
  if (!fallbackUser) {
    fallbackUser = await User.findOne({});
  }
  if (!fallbackUser) {
    console.error('No users found in DB. Create at least one user first.');
    process.exit(1);
  }
  console.log(`Fallback author: ${fallbackUser.username || fallbackUser.email} (${fallbackUser._id})`);

  // ── 2. Backfill missing `author` ──────────────────────────────────────────
  const authorResult = await Note.updateMany(
    { author: { $exists: false } },
    { $set: { author: fallbackUser._id } }
  );
  console.log(`author backfilled on ${authorResult.modifiedCount} notes`);

  // ── 3. Backfill missing `isPublic` ────────────────────────────────────────
  const publicResult = await Note.updateMany(
    { isPublic: { $exists: false } },
    { $set: { isPublic: true } }
  );
  console.log(`isPublic backfilled on ${publicResult.modifiedCount} notes`);

  // ── 4. Backfill missing `viewCount` ───────────────────────────────────────
  const viewResult = await Note.updateMany(
    { viewCount: { $exists: false } },
    { $set: { viewCount: 0 } }
  );
  console.log(`viewCount backfilled on ${viewResult.modifiedCount} notes`);

  // ── 5. Backfill missing timestamps ────────────────────────────────────────
  const now = new Date();
  const tsResult = await Note.updateMany(
    { createdAt: { $exists: false } },
    { $set: { createdAt: now, updatedAt: now } }
  );
  console.log(`timestamps backfilled on ${tsResult.modifiedCount} notes`);

  console.log('✅ Migration complete');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});