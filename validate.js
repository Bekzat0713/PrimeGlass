const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { services } = require('./services');
const { renderHome, renderService, renderContacts, render404 } = require('./render');

assert.strictEqual(services.length, 10, 'Expected 10 service routes');
assert.deepStrictEqual(services.map(service => service.slug), ['steklopakety','osteklenie-zdaniy','alyuminievye-vitrazhi','plastikovye-okna','ofisnye-peregorodki','loft-peregorodki','dushevye-peregorodki','steklyannye-perila','steklyannye-kozyrki','zakalka-stekla']);
const servicePages = services.map(renderService);
const pages = [renderHome(), ...servicePages, renderContacts(), render404()];
const titles = new Set();
const descriptions = new Set();
for (const html of pages) {
  assert.match(html, /<h1[ >]/, 'Every page needs an H1');
  assert.strictEqual((html.match(/<h1[ >]/g) || []).length, 1, 'Every page needs exactly one H1');
  assert.match(html, /<link rel="canonical"/, 'Canonical is required');
  assert.match(html, /application\/ld\+json/, 'Structured data is required');
  assert.doesNotMatch(html, /href="#"/, 'Empty hash links are not allowed');
  assert.doesNotMatch(html, /src=""/, 'Empty image sources are not allowed');
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  assert(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
  const description = html.match(/<meta name="description" content="([^"]+)"/)[1];
  assert(!descriptions.has(description), `Duplicate description: ${description}`);
  descriptions.add(description);
}
assert.match(render404(), /name="robots" content="noindex,follow"/, '404 must be noindex');
const benefits = new Set();
const faqs = new Set();
for (const service of services) {
  assert(service.faq.length >= 6, `${service.slug} needs at least 6 FAQs`);
  assert(service.benefits.length >= 6, `${service.slug} needs at least 6 benefits`);
  assert(service.gallery.length >= 10, `${service.slug} needs a complete gallery`);
  assert(service.calculator.length >= 6, `${service.slug} needs calculator parameters`);
  assert(service.calculator.filter(field => field.required).length >= 4, `${service.slug} needs required calculator inputs`);
  benefits.add(JSON.stringify(service.benefits));
  faqs.add(JSON.stringify(service.faq));
  for (const image of service.gallery) {
    assert(image.alt.trim().length > 8, `${service.slug} gallery image needs alt text`);
    assert(fs.existsSync(path.join(__dirname, image.src)), `Missing image ${image.src}`);
    assert(fs.existsSync(path.join(__dirname, image.fallback)), `Missing fallback ${image.fallback}`);
  }
}
assert.strictEqual(benefits.size, services.length, 'Benefits must be service-specific');
assert.strictEqual(faqs.size, services.length, 'FAQ sets must be service-specific');
servicePages.forEach((html, index) => {
  const service = services[index];
  assert.match(html, new RegExp(`href="/${service.slug}" class="is-current" aria-current="page"`), `${service.slug} must be highlighted in navigation`);
  assert.match(html, /class="section service-production"/, `${service.slug} needs a production section`);
  assert.match(html, /class="mini-lead-form"/, `${service.slug} needs a final short form`);
  assert.doesNotMatch(html, /data-disabled-channel="telegram"/, 'Unconfirmed Telegram must not be shown');
});
const script = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');
for (const eventName of ['click_phone','click_whatsapp','click_telegram','open_calculator','submit_calculation','submit_callback','submit_measurement','submit_project','request_commercial_offer','download_catalog','view_service','view_case']) {
  assert(script.includes(`'${eventName}'`), `Missing analytics event ${eventName}`);
}
for (const attributionField of ['traffic_source','traffic_medium','first_traffic_source','first_landing_page','landing_page','page_url','page_title','event_id','event_time']) {
  assert(script.includes(attributionField), `Missing analytics attribution field ${attributionField}`);
}
for (const campaignKey of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','yclid','fbclid','msclkid']) {
  assert(script.includes(`'${campaignKey}'`), `Missing campaign parameter ${campaignKey}`);
}
for (const storageKey of ['prime_glass_first_touch','prime_glass_last_touch']) {
  assert(script.includes(storageKey), `Missing persistent attribution storage ${storageKey}`);
}
for (const providerHost of ['www.googletagmanager.com','mc.yandex.ru','connect.facebook.net']) {
  assert(script.includes(providerHost), `Missing conditional analytics provider ${providerHost}`);
}
assert.match(script, /recentEvents = new Map\(\)/, 'Analytics events need duplicate protection');
assert.match(script, /activeProviders\.ga4Id/, 'GA4 events need direct forwarding when GTM is absent');
assert.match(script, /reachGoal/, 'Yandex Metrika goals need forwarding');
assert.match(script, /trackCustom/, 'Meta Pixel custom events need forwarding');
const server = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
for (const providerHost of ['www.googletagmanager.com','mc.yandex.ru','connect.facebook.net','www.google-analytics.com']) {
  assert(server.includes(providerHost), `CSP must allow analytics provider ${providerHost}`);
}
const stylesheet = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
assert(stylesheet.includes('@media (max-width:390px)'), 'Small mobile breakpoint is required');
assert(stylesheet.includes('env(safe-area-inset-bottom)'), 'Mobile fixed actions need safe-area spacing');
assert.match(stylesheet, /\.mobile-menu\{position:absolute;top:82px[^}]*height:calc\(100dvh - 82px\)/, 'Tablet navigation must have an explicit viewport height');
assert.match(stylesheet, /\.mobile-menu,.site-header\.is-scrolled \.mobile-menu\{top:68px[^}]*height:calc\(100dvh - 68px\)/, 'Phone navigation must not use the filtered header as its height reference');
assert.match(stylesheet, /\.gallery-grid\{[^}]*grid-auto-flow:column/, 'Mobile gallery needs a horizontal touch layout');
assert.match(stylesheet, /\.spec-table,.spec-table tbody[^\n]*display:block/, 'Mobile specification table needs a stacked layout');
assert.match(stylesheet, /\.field input,[^\n]*font-size:16px/, 'Mobile form controls need a zoom-safe font size');
const combinedHtml = pages.join('\n');
assert.doesNotMatch(combinedHtml, /Актау/i, 'Old city name must not remain in generated pages');
assert.match(renderHome(), /Алматы/, 'Home page must use the current city');
assert.match(renderContacts(), /Алматы, Казахстан/, 'Contacts page must show the configured address');
for (const formKind of ['calculation','project','measurement','commercial']) {
  assert(combinedHtml.includes(`data-open-form="${formKind}"`) || combinedHtml.includes(`data-form-kind="${formKind}"`), `Missing form flow ${formKind}`);
}
assert.match(renderContacts(), /data-form-kind="callback"/, 'Missing callback form');
assert.match(combinedHtml, /Отправить в WhatsApp/, 'WhatsApp forms need an honest submit label');
console.log(`Validated ${pages.length} pages, ${services.length} service configs and unique metadata.`);
