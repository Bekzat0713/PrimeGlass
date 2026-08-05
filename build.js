const fs = require('fs');
const path = require('path');
const { services } = require('./services');
const config = require('./site-config');
const { renderHome, renderService, renderContacts, render404 } = require('./render');

const root = __dirname;
const output = path.join(root, 'dist');
const copyFile = name => fs.copyFileSync(path.join(root, name), path.join(output, name));
const writeRoute = (route, html) => {
  const directory = route === '/' ? output : path.join(output, route.slice(1));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, 'index.html'), html, 'utf8');
};

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const asset of ['style.css', 'script.js', 'favicon.png', 'og.png']) copyFile(asset);
fs.cpSync(path.join(root, 'photos'), path.join(output, 'photos'), { recursive: true });

writeRoute('/', renderHome());
for (const service of services) writeRoute(`/${service.slug}`, renderService(service));
writeRoute('/contacts', renderContacts());
writeRoute('/404', render404());
fs.copyFileSync(path.join(output, '404', 'index.html'), path.join(output, '404.html'));

const urls = ['/', ...services.map(service => `/${service.slug}`), '/contacts'];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(route => `  <url><loc>${config.domain}${route === '/' ? '/' : route}</loc><changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq><priority>${route === '/' ? '1.0' : '0.8'}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(output, 'sitemap.xml'), sitemap, 'utf8');
fs.writeFileSync(path.join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.domain}/sitemap.xml\n`, 'utf8');

fs.mkdirSync(path.join(output, 'server'), { recursive: true });
fs.mkdirSync(path.join(output, '.openai'), { recursive: true });
fs.writeFileSync(path.join(output, 'server', 'index.js'), `export default {\n  async fetch(request, env) {\n    return env.ASSETS.fetch(request);\n  }\n};\n`, 'utf8');
fs.copyFileSync(path.join(root, '.openai', 'hosting.json'), path.join(output, '.openai', 'hosting.json'));

console.log(`Built ${urls.length} routes and a 404 page in dist/`);
