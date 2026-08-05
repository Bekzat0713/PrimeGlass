const assert = require('assert');
const { services } = require('./services');
const { renderHome, renderService, renderContacts, render404 } = require('./render');

assert.strictEqual(services.length, 10, 'Expected 10 service routes');
const pages = [renderHome(), ...services.map(renderService), renderContacts(), render404()];
const titles = new Set();
for (const html of pages) {
  assert.match(html, /<h1[ >]/, 'Every page needs an H1');
  assert.strictEqual((html.match(/<h1[ >]/g) || []).length, 1, 'Every page needs exactly one H1');
  assert.match(html, /<link rel="canonical"/, 'Canonical is required');
  assert.match(html, /application\/ld\+json/, 'Structured data is required');
  assert.doesNotMatch(html, /href="#"/, 'Empty hash links are not allowed');
  const title = html.match(/<title>(.*?)<\/title>/)[1];
  assert(!titles.has(title), `Duplicate title: ${title}`);
  titles.add(title);
}
for (const service of services) {
  assert(service.faq.length >= 6, `${service.slug} needs at least 6 FAQs`);
  assert(service.gallery.length >= 10, `${service.slug} needs a complete gallery`);
  assert(service.calculator.length >= 6, `${service.slug} needs calculator parameters`);
}
console.log(`Validated ${pages.length} pages, ${services.length} service configs and unique metadata.`);
