export function socialImageHead(site) {
  const image = new URL('/schooner-social-preview.png', site).href
  const alt = 'A schooner crosses a dark sea beside the words: Your machines. Your tools. Your workflow.'
  return [
    { tag: 'meta', attrs: { property: 'og:site_name', content: 'Schooner' } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:type', content: 'image/png' } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: alt } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: alt } },
  ]
}
