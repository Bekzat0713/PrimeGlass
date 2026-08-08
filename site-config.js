const siteConfig = {
  name: 'Prime Glass Technologies',
  shortName: 'Prime Glass',
  domain: 'https://primeglass.kz',
  phoneDisplay: '+7 (777) 091-08-88',
  phoneHref: '+77770910888',
  whatsapp: '77770910888',
  email: 'primeglasstech@outlook.com',
  city: 'Алматы',
  region: 'Казахстан',
  schedule: 'Понедельник–пятница, 09:00–18:00',
  address: 'Алматы, Казахстан',
  telegram: null,
  mapCoordinates: null,
  catalogUrl: null,
  analytics: {
    googleTagManagerId: process.env.GTM_ID || '',
    googleAnalyticsId: process.env.GA4_ID || 'G-LH761EGRGM',
    yandexMetrikaId: process.env.YM_ID || '110987197',
    metaPixelId: process.env.META_PIXEL_ID || ''
  }
};

module.exports = siteConfig;
