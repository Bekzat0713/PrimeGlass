const assert = require('assert');
const fs = require('fs');
const path = require('path');
const config = require('./site-config');
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
assert.strictEqual(config.analytics.googleAnalyticsId, 'G-LH761EGRGM', 'Approved GA4 measurement ID must be configured');
assert.strictEqual(config.analytics.yandexMetrikaId, '110987197', 'Approved Yandex Metrika counter ID must be configured');
const buildScript = fs.readFileSync(path.join(__dirname, 'build.js'), 'utf8');
for (const eventName of ['click_phone','click_whatsapp','click_telegram','open_calculator','submit_calculation','submit_callback','submit_measurement','submit_project','request_commercial_offer','download_catalog','view_service','view_case','click_instagram','view_reel']) {
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
assert.match(script, /function initDepthScroll\(\)/, 'Home page needs the requested 3D scroll system');
assert.match(script, /requestAnimationFrame\(renderDepth\)/, '3D scroll updates must be animation-frame throttled');
assert.match(script, /function initHeroVideo\(\)/, 'Home page needs responsive background-video loading');
const stylesheet = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');
assert.match(stylesheet, /@keyframes reelsMarquee/, 'Home page needs an infinite Reels marquee');
assert.match(stylesheet, /\.reels-carousel:hover \.reels-track,[^\n]*animation-play-state:paused/, 'Reels marquee must pause while hovered');
assert.match(script, /connection\?\.saveData/, 'Background video must respect reduced-data connections');
assert.match(script, /window\.matchMedia\('\(max-width: 767px\)'\)/, 'Mobile screens must select the portrait hero video');
assert.match(buildScript, /webp\|mp4/, 'Build must copy the MP4 hero asset');
const server = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
for (const providerHost of ['www.googletagmanager.com','mc.yandex.ru','connect.facebook.net','www.google-analytics.com']) {
  assert(server.includes(providerHost), `CSP must allow analytics provider ${providerHost}`);
}
assert(stylesheet.includes('@media (max-width:390px)'), 'Small mobile breakpoint is required');
assert(stylesheet.includes('env(safe-area-inset-bottom)'), 'Mobile fixed actions need safe-area spacing');
assert.match(stylesheet, /\.mobile-menu\{position:absolute;top:82px[^}]*height:calc\(100dvh - 82px\)/, 'Tablet navigation must have an explicit viewport height');
assert.match(stylesheet, /\.mobile-menu,.site-header\.is-scrolled \.mobile-menu\{top:68px[^}]*height:calc\(100dvh - 68px\)/, 'Phone navigation must not use the filtered header as its height reference');
assert.match(stylesheet, /\.gallery-grid\{[^}]*grid-auto-flow:column/, 'Mobile gallery needs a horizontal touch layout');
assert.match(stylesheet, /\.spec-table,.spec-table tbody[^\n]*display:block/, 'Mobile specification table needs a stacked layout');
assert.match(stylesheet, /\.field input,[^\n]*font-size:16px/, 'Mobile form controls need a zoom-safe font size');
assert.match(stylesheet, /\.benefit-card\{[^}]*grid-template-columns:32px minmax\(0,1fr\)/, 'Mobile benefit cards need aligned index and content columns');
assert.match(stylesheet, /@media \(max-width:900px\)[\s\S]*?\.reveal\{opacity:1;transform:none;transition:none\}/, 'Mobile text must not float in with scroll animations');
assert.match(stylesheet, /@media \(hover:none\)/, 'Touch devices need stable non-hover positioning');
assert.match(stylesheet, /\.home-hero\{position:relative;height:210svh/, 'Home page needs an extended architectural scroll scene');
assert.match(stylesheet, /\.home-hero-stage\{position:sticky;top:0;height:100svh/, 'Home page needs a sticky full-viewport hero stage');
assert.match(stylesheet, /\.home-hero \.hero-media\{[^}]*height:100%;min-height:100%/, 'Hero media must cover the complete mobile hero');
assert.doesNotMatch(stylesheet, /\.home-hero \.hero-video\{display:none!important\}/, 'Mobile hero video must remain visible');
assert.doesNotMatch(stylesheet, /\.page-home\{perspective:/, 'Page perspective must not break the fixed navigation header');
assert.match(stylesheet, /\.home-hero-grid\{[^}]*width:100%;max-width:none;margin-inline:0/, 'Home hero image must extend edge to edge');
assert.match(stylesheet, /\.page-home \.site-header\{position:fixed/, 'Home page navigation must overlay the hero');
const combinedHtml = pages.join('\n');
assert.doesNotMatch(combinedHtml, /Актау/i, 'Old city name must not remain in generated pages');
assert.match(renderHome(), /Алматы/, 'Home page must use the current city');
assert.match(renderHome(), /Завод-изготовитель/, 'Home page must present Prime Glass as the manufacturer');
assert.match(renderHome(), /4 000 м²/, 'Home page must prominently state the factory area');
assert.match(renderHome(), /class="factory-proof[^\"]*"/, 'Home page needs a prominent factory proof block');
assert.match(renderHome(), /<body class="page-home">/, 'Home page needs a visual theme hook');
assert.match(renderHome(), /Архитектура стекла/, 'Home page needs the premium architectural positioning');
assert.match(renderHome(), /\/photos\/image4\.webp/, 'Home hero must use a single uninterrupted architectural image');
assert.doesNotMatch(renderHome(), /<section class="home-hero">[\s\S]*?\/photos\/image2\.webp/, 'Composite image must not be used in the hero');
assert.match(renderHome(), /class="hero-scroll-cue"[^>]*><span>Смотреть дальше<\/span>/, 'Home page needs a visible centered scroll cue');
assert.match(renderHome(), /data-hero-video/, 'Home page needs the animated hero video');
assert.match(renderHome(), /class="home-hero-stage"/, 'Home page needs an extended sticky hero stage');
assert.match(renderHome(), /class="section reels-section" id="reels"/, 'Home page needs a dedicated Instagram Reels section');
assert.match(renderHome(), /id="reels"[\s\S]*id="services"/, 'Reels section must appear directly after the home hero');
assert.strictEqual((renderHome().match(/class="reel-card"/g) || []).length, 12, 'Infinite marquee needs two copies of all six supplied Reels');
assert.match(renderHome(), /instagram\.com\/prime\.glass\.technologies\//, 'Reels section must link to the supplied Instagram account');
assert.doesNotMatch(renderHome(), /reel-views|data-view-count/i, 'Reels cards must not show view counts');
assert.doesNotMatch(renderHome(), /data-reels-(?:prev|next)|<iframe[^>]+instagram/i, 'Reels section must not contain arrows or Instagram like panels');
for (const reelId of ['DYyxI4BMI1N','DYhoi6XMRh8','DYo6attsTGQ','DYoZ-c5MDJn','DX6Gi51MHz_','DbTPeuCoXTS']) {
  assert.match(renderHome(), new RegExp(`/photos/reel-${reelId}\\.jpg`), `Missing Reel card ${reelId}`);
  assert(fs.existsSync(path.join(__dirname, 'photos', `reel-${reelId}.jpg`)), `Missing Reel cover ${reelId}`);
}
assert.match(renderHome(), /data-desktop-src="\/photos\/prime-glass-intro\.mp4"/, 'Desktop hero video must load from the prepared landscape asset');
assert.match(renderHome(), /data-mobile-src="\/photos\/prime-glass-mobile\.mp4"/, 'Mobile hero video must load from the prepared portrait asset');
assert.match(renderHome(), /<video[^>]*\bloop\b/, 'Hero video must loop continuously');
assert.doesNotMatch(renderHome(), /data-video-toggle/, 'Hero video must not show pause controls');
assert.match(script, /const heroTravel = Math\.max\(\(hero\?\.offsetHeight \|\| viewportHeight\) - viewportHeight, 1\)/, 'Hero zoom must use the full sticky scroll distance');
assert(fs.existsSync(path.join(__dirname, 'photos', 'prime-glass-intro.mp4')), 'Hero video asset is missing');
assert(fs.existsSync(path.join(__dirname, 'photos', 'prime-glass-mobile.mp4')), 'Mobile hero video asset is missing');
for (const html of servicePages) {
  assert.match(html, /Завод-изготовитель · 4 000 м²/, 'Service pages must reinforce the manufacturing position');
}
assert.match(renderContacts(), /Алматы, Казахстан/, 'Contacts page must show the configured address');
assert.match(combinedHtml, /Решение для объекта/, 'Service benefit heading must stay concise on mobile');
for (const formKind of ['calculation','project','measurement','commercial']) {
  assert(combinedHtml.includes(`data-open-form="${formKind}"`) || combinedHtml.includes(`data-form-kind="${formKind}"`), `Missing form flow ${formKind}`);
}
assert.match(renderContacts(), /data-form-kind="callback"/, 'Missing callback form');
assert.match(combinedHtml, /Отправить в WhatsApp/, 'WhatsApp forms need an honest submit label');
console.log(`Validated ${pages.length} pages, ${services.length} service configs and unique metadata.`);
