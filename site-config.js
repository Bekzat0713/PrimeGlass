const siteConfig = {
  name: 'Prime Glass Technologies',
  shortName: 'Prime Glass',
  domain: 'https://primeglass.kz',
  phoneDisplay: '+7 (777) 091-08-88',
  phoneHref: '+77770910888',
  whatsapp: '77770910888',
  email: 'primeglasstech@outlook.com',
  city: 'Актау',
  region: 'Казахстан',
  schedule: 'Понедельник–пятница, 09:00–18:00',
  address: null, // TODO: подтвердить точный адрес
  telegram: null, // TODO: подтвердить публичный Telegram
  mapCoordinates: null, // TODO: подтвердить координаты
  catalogUrl: null, // TODO: добавить утверждённый каталог
  analytics: {
    googleTagManagerId: process.env.GTM_ID || '',
    googleAnalyticsId: process.env.GA4_ID || '',
    yandexMetrikaId: process.env.YM_ID || '',
    metaPixelId: process.env.META_PIXEL_ID || ''
  }
};

module.exports = siteConfig;
