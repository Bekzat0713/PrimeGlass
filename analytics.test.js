const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const source = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

function runAnalytics(analytics = {}) {
  const storage = new Map();
  const appendedScripts = [];
  const servicePage = { dataset: { servicePage: 'steklopakety' } };
  const document = {
    title: 'Стеклопакеты Prime Glass',
    referrer: 'https://www.google.com/search?q=glass',
    head: { appendChild: node => appendedScripts.push(node) },
    body: { classList: { add() {}, remove() {}, toggle() {} } },
    createElement: tagName => ({ tagName, id: '', async: false, src: '' }),
    getElementById: () => null,
    querySelector: selector => selector === '[data-service-page]' ? servicePage : null,
    querySelectorAll: () => [],
    addEventListener() {}
  };
  const window = {
    PRIME_GLASS: { whatsapp: '77770910888', analytics },
    dataLayer: [],
    location: {
      pathname: '/steklopakety',
      search: '?utm_source=google&utm_medium=cpc&utm_campaign=spring&gclid=test-click',
      href: 'https://primeglass.kz/steklopakety?utm_source=google&utm_medium=cpc&utm_campaign=spring&gclid=test-click'
    },
    scrollY: 0,
    addEventListener() {},
    dispatchEvent() {},
    matchMedia: () => ({ matches: true }),
    open() {},
    setTimeout() {}
  };
  window.window = window;
  const localStorage = {
    getItem: key => storage.has(key) ? storage.get(key) : null,
    setItem: (key, value) => storage.set(key, value)
  };
  const context = {
    window,
    document,
    localStorage,
    URL,
    URLSearchParams,
    CustomEvent: class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    console
  };
  vm.runInNewContext(source, context, { filename: 'script.js' });
  return { window, storage, appendedScripts };
}

const base = runAnalytics();
const attribution = base.window.PrimeGlassAnalytics.getAttribution();
assert.strictEqual(attribution.utm_source, 'google');
assert.strictEqual(attribution.utm_medium, 'cpc');
assert.strictEqual(attribution.traffic_source, 'google');
assert(base.storage.has('prime_glass_first_touch'));
assert(base.storage.has('prime_glass_last_touch'));
const viewEvent = base.window.dataLayer.find(item => item.event === 'view_service');
assert(viewEvent, 'Service page view must be tracked');
assert.strictEqual(viewEvent.service, 'steklopakety');
assert.strictEqual(viewEvent.page_path, '/steklopakety');
assert.strictEqual(viewEvent.utm_campaign, 'spring');
assert.strictEqual(viewEvent.gclid, 'test-click');
assert.strictEqual(base.window.PrimeGlassAnalytics.track('click_phone', {}, { dedupeKey: 'phone', dedupeMs: 5000 }), true);
assert.strictEqual(base.window.PrimeGlassAnalytics.track('click_phone', {}, { dedupeKey: 'phone', dedupeMs: 5000 }), false);
assert.strictEqual(base.window.dataLayer.filter(item => item.event === 'click_phone').length, 1);
assert.strictEqual(base.appendedScripts.length, 0, 'No external analytics scripts should load without IDs');

const connected = runAnalytics({
  googleTagManagerId: 'GTM-TEST123',
  googleAnalyticsId: 'G-TEST12345',
  yandexMetrikaId: '12345678',
  metaPixelId: '1234567890'
});
assert.deepStrictEqual(Array.from(connected.appendedScripts, item => item.id).sort(), [
  'prime-glass-gtm',
  'prime-glass-meta-pixel',
  'prime-glass-metrika'
]);
assert.strictEqual(connected.window.PrimeGlassAnalytics.providers.ga4Id, '', 'Direct GA4 must stay off when GTM is active');

const directGa = runAnalytics({ googleAnalyticsId: 'G-TEST12345' });
assert.deepStrictEqual(Array.from(directGa.appendedScripts, item => item.id), ['prime-glass-ga4']);
assert.strictEqual(directGa.window.PrimeGlassAnalytics.providers.ga4Id, 'G-TEST12345');

console.log('Analytics attribution, event payloads, deduplication and provider loading validated.');
