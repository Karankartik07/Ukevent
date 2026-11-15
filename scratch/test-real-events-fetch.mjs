async function testFetchRealEventbrite() {
  const feeds = [
    'https://www.eventbrite.co.uk/d/united-kingdom--london/indian-music/',
    'https://www.eventbrite.co.uk/d/united-kingdom--london/bollywood/',
    'https://www.eventbrite.co.uk/d/united-kingdom--birmingham/indian/',
  ];

  const events = [];

  for (const url of feeds) {
    try {
      console.log('Fetching feed:', url);
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      const html = await res.text();
      const jsonLdRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
      let match;
      while ((match = jsonLdRegex.exec(html)) !== null) {
        try {
          const data = JSON.parse(match[1]);
          if (Array.isArray(data.itemListElement)) {
            data.itemListElement.forEach((entry) => {
              const item = entry.item || entry;
              if (item.name && item.url && item.url.includes('/e/')) {
                events.push({
                  title: item.name,
                  description: item.description || '',
                  date: item.startDate ? item.startDate.split('T')[0] : '2026-11-21',
                  time: item.startDate && item.startDate.includes('T') ? item.startDate.split('T')[1].slice(0, 5) : '19:00',
                  venue: item.location?.name || 'London Venue',
                  city: item.location?.address?.addressLocality || 'London',
                  address: item.location?.address?.streetAddress || '',
                  imageUrl: item.image || '',
                  ticketUrl: item.url,
                  sourcePlatform: 'EVENTBRITE',
                  sourceEventId: item.url.match(/tickets-(\d+)/)?.[1] || '',
                  priceDisplay: 'Check Tickets',
                });
              }
            });
          }
        } catch {}
      }
    } catch (e) {
      console.error('Error fetching feed:', e.message);
    }
  }

  console.log('\nTotal real events collected:', events.length);
  events.slice(0, 6).forEach((ev, i) => {
    console.log(`\n--- Real Event #${i + 1} ---`);
    console.log('Title:', ev.title);
    console.log('Date:', ev.date, '| Time:', ev.time);
    console.log('Venue:', ev.venue, '| City:', ev.city);
    console.log('Ticket URL:', ev.ticketUrl);
    console.log('Image:', ev.imageUrl ? 'YES' : 'NO');
  });
}

testFetchRealEventbrite();
