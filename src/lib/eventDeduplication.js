/**
 * Event Deduplication Utility
 * Prevents duplicate events across Ticketmaster, Eventbrite, AllEvents.in, and MeraIndia.
 */

/**
 * Normalizes title string for duplicate comparison:
 * - Lowercases and trims
 * - Strips common event fluff ('live in concert', 'revolution tour', 'tour 2026', 'presents', etc.)
 * - Removes non-alphanumeric characters
 */
export function normalizeEventTitle(title = '') {
  if (!title || typeof title !== 'string') return '';

  let clean = title.toLowerCase();

  // Remove common noise words / suffixes that vary between platforms
  const noisePatterns = [
    /\blive in concert\b/gi,
    /\blive concert\b/gi,
    /\bconcert tour\b/gi,
    /\bconcert\b/gi,
    /\blive\b/gi,
    /\btour \d{4}\b/gi,
    /\btour\b/gi,
    /\buk tour\b/gi,
    /\bpresents?:?\b/gi,
    /\bofficial\b/gi,
    /\btickets\b/gi,
    /\bexclusive\b/gi,
    /\bannual\b/gi,
    /\bshowcase\b/gi,
    /\buk 20\d{2}\b/gi,
    /\b20\d{2}\b/gi,
  ];

  noisePatterns.forEach((pattern) => {
    clean = clean.replace(pattern, ' ');
  });

  // Remove non-alphanumeric characters (keep letters and digits)
  clean = clean.replace(/[^a-z0-9\s]/g, ' ');

  // Collapse consecutive whitespaces
  clean = clean.replace(/\s+/g, ' ').trim();

  return clean;
}

/**
 * Normalizes city name (e.g., 'London, UK' -> 'london')
 */
export function normalizeCity(city = '') {
  if (!city || typeof city !== 'string') return '';
  return city
    .toLowerCase()
    .replace(/,.*$/, '') // strip country/postcode suffix
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Normalizes date to YYYY-MM-DD
 */
export function normalizeDate(dateStr = '') {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const trimmed = dateStr.trim();

  // If already YYYY-MM-DD
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  // Parse generic date if possible
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return trimmed.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Computes overlap and similarity between two titles using Overlap Coefficient (Szymkiewicz–Simpson)
 * and Jaccard index.
 */
export function computeTitleSimilarity(titleA, titleB) {
  const normA = normalizeEventTitle(titleA);
  const normB = normalizeEventTitle(titleB);

  if (normA === normB && normA.length > 0) return 1.0;
  if (!normA || !normB) return 0;

  // Substring check (one completely contained in the other)
  if (normA.includes(normB) || normB.includes(normA)) {
    return 0.9;
  }

  const wordsA = new Set(normA.split(' ').filter((w) => w.length > 2));
  const wordsB = new Set(normB.split(' ').filter((w) => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersectionCount = 0;
  wordsA.forEach((w) => {
    if (wordsB.has(w)) intersectionCount++;
  });

  const minSize = Math.min(wordsA.size, wordsB.size);
  const overlapCoefficient = minSize > 0 ? intersectionCount / minSize : 0;

  const unionCount = new Set([...wordsA, ...wordsB]).size;
  const jaccard = unionCount > 0 ? intersectionCount / unionCount : 0;

  // Weighted blend: overlap coefficient (0.7) + jaccard (0.3)
  return overlapCoefficient * 0.7 + jaccard * 0.3;
}

/**
 * Checks whether two events represent the same real-world event
 */
export function areEventsDuplicate(eventA, eventB) {
  if (!eventA || !eventB) return false;

  // 1. Direct external ID match (if same platform)
  if (
    eventA.sourcePlatform &&
    eventB.sourcePlatform &&
    eventA.sourcePlatform === eventB.sourcePlatform &&
    eventA.sourceEventId &&
    eventB.sourceEventId &&
    eventA.sourceEventId === eventB.sourceEventId
  ) {
    return true;
  }

  // 2. Exact ticket URL match
  if (
    eventA.ticketUrl &&
    eventB.ticketUrl &&
    eventA.ticketUrl.trim().toLowerCase() === eventB.ticketUrl.trim().toLowerCase() &&
    eventA.ticketUrl.trim() !== '#' &&
    eventA.ticketUrl.trim() !== ''
  ) {
    return true;
  }

  // 3. City comparison
  const cityA = normalizeCity(eventA.city);
  const cityB = normalizeCity(eventB.city);
  const citiesMatch = !cityA || !cityB || cityA === cityB;

  if (!citiesMatch) return false;

  // 4. Date comparison (must match on calendar date)
  const dateA = normalizeDate(eventA.date);
  const dateB = normalizeDate(eventB.date);
  const datesMatch = !dateA || !dateB || dateA === dateB;

  if (!datesMatch) return false;

  // 5. Title similarity threshold (>= 0.60 with same date and city is a duplicate)
  const similarity = computeTitleSimilarity(eventA.title, eventB.title);
  return similarity >= 0.6;
}

/**
 * Deduplicates an array of events:
 * If an event appears on multiple platforms (e.g. Ticketmaster + Eventbrite),
 * keeps the canonical one, preserving the lowest starting price and direct ticket link.
 *
 * @param {Array} eventsList
 * @returns {Array} Deduplicated unique events
 */
export function deduplicateEvents(eventsList = []) {
  if (!Array.isArray(eventsList)) return [];

  const unique = [];

  for (const candidate of eventsList) {
    const existingIndex = unique.findIndex((item) => areEventsDuplicate(item, candidate));

    if (existingIndex === -1) {
      // Brand new unique event
      unique.push(candidate);
    } else {
      // Duplicate found! Keep the richer one / merge source info
      const existing = unique[existingIndex];

      const platformPriority = {
        TICKETMASTER: 4,
        EVENTBRITE: 3,
        ALLEVENTS: 2,
        MERAINDIA: 1,
        OTHER: 0,
      };

      const existingScore = platformPriority[existing.sourcePlatform?.toUpperCase()] || 0;
      const candidateScore = platformPriority[candidate.sourcePlatform?.toUpperCase()] || 0;

      if (candidateScore > existingScore) {
        unique[existingIndex] = {
          ...candidate,
          isDuplicateMerged: true,
          mergedSources: [existing.sourcePlatform, candidate.sourcePlatform].filter(Boolean),
        };
      } else {
        unique[existingIndex] = {
          ...existing,
          isDuplicateMerged: true,
          mergedSources: [existing.sourcePlatform, candidate.sourcePlatform].filter(Boolean),
        };
      }
    }
  }

  return unique;
}
