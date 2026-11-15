async function printLdJsonItem() {
  const res = await fetch('https://www.eventbrite.co.uk/d/united-kingdom--london/indian-music/', {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
  const html = await res.text();
  const jsonLdRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (data.itemListElement && data.itemListElement.length > 0) {
        console.log('Sample item structure:');
        console.log(JSON.stringify(data.itemListElement[0], null, 2));
        break;
      }
    } catch {}
  }
}

printLdJsonItem();
