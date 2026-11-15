async function testExtract() {
  const res = await fetch('https://www.eventbrite.co.uk/d/united-kingdom--london/indian-music/', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  const html = await res.text();
  console.log('Status:', res.status, 'HTML length:', html.length);

  // Find all ld+json
  const jsonLdRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      console.log('Found LD+JSON type:', data['@type']);
      if (data.itemListElement) {
        console.log('Items found in itemListElement:', data.itemListElement.length);
        data.itemListElement.slice(0, 5).forEach((item, i) => {
          console.log(`[${i + 1}]`, item.name || item.item?.name, '->', item.url || item.item?.url);
        });
      }
    } catch {
      // ignore
    }
  }

  // Regex for direct /e/ links
  const links = [...html.matchAll(/https:\/\/www\.eventbrite\.co\.uk\/e\/[a-zA-Z0-9\-]+tickets-\d+/g)].map(
    (m) => m[0]
  );
  const uniqueLinks = [...new Set(links)];
  console.log('Direct event /e/ links found:', uniqueLinks.length);
  uniqueLinks.slice(0, 5).forEach((l) => console.log('Exact Event Link:', l));
}

testExtract();
