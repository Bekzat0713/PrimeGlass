const config = require('./site-config');
const { services } = require('./services');
const imageDimensions = {
  1: [1280, 853], 2: [853, 1280], 3: [853, 1280], 4: [1280, 853], 5: [853, 1280],
  6: [1280, 853], 7: [853, 1280], 8: [1280, 853], 9: [853, 1280], 10: [853, 1280]
};
const instagramProfile = 'https://www.instagram.com/prime.glass.technologies/';
const instagramReels = [
  'DYyxI4BMI1N',
  'DYhoi6XMRh8',
  'DYo6attsTGQ',
  'DYoZ-c5MDJn',
  'DX6Gi51MHz_',
  'DbTPeuCoXTS'
];

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const routeFor = service => `/${service.slug}`;
const picture = (image, className = '', eager = false) => {
  const photoNumber = Number(image.src.match(/image(\d+)/)?.[1] || 1);
  const [width, height] = imageDimensions[photoNumber] || [1280, 853];
  return `
  <picture class="${className}">
    <source srcset="${image.src}" type="image/webp">
    <img src="${image.fallback}" alt="${escapeHtml(image.alt)}" width="${width}" height="${height}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
  </picture>`;
};

const trackedLink = (href, label, event, className = '') => `<a class="${className}" href="${href}" data-track="${event}">${label}</a>`;

function header(currentPath = '/') {
  const active = path => currentPath === path ? ' class="is-current" aria-current="page"' : '';
  const serviceLinks = services.map(item => `<a href="${routeFor(item)}"${active(routeFor(item))}>${item.title}</a>`).join('');
  const catalogLinks = services.map(item => `<a class="catalog-item${currentPath === routeFor(item) ? ' is-current' : ''}" href="${routeFor(item)}"${currentPath === routeFor(item) ? ' aria-current="page"' : ''}><span><strong>${item.title}</strong><small>${item.eyebrow}</small></span><i aria-hidden="true">↗</i></a>`).join('');
  return `
    <a class="skip-link" href="#content">К содержанию</a>
    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="/" aria-label="Prime Glass — главная"${currentPath === '/' ? ' aria-current="page"' : ''}>
          <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span><strong>Prime Glass</strong><small>Technologies</small></span>
        </a>
        <nav class="desktop-nav" aria-label="Основная навигация">
          <div class="nav-dropdown">
            <button type="button" aria-expanded="false" aria-controls="services-menu" data-services-toggle>Каталог продукции <span aria-hidden="true">⌄</span></button>
            <div class="services-menu" id="services-menu">
              <div class="services-menu-intro"><p>Каталог Prime Glass</p><strong>10 направлений<br>для частных и коммерческих объектов</strong><span>Изготовление на собственном заводе площадью 4 000 м² в Алматы.</span><a class="catalog-all" href="/#services">Смотреть весь каталог <i aria-hidden="true">↓</i></a></div>
              <div class="catalog-link-grid">${catalogLinks}</div>
            </div>
          </div>
          <a href="/#production">Производство</a>
          <a href="/#gallery">Проекты</a>
          <a href="/#about">О компании</a>
          <a href="/contacts"${active('/contacts')}>Контакты</a>
        </nav>
        <div class="header-actions">
          ${trackedLink(`tel:${config.phoneHref}`, config.phoneDisplay, 'click_phone', 'header-phone')}
          <button class="button button-primary button-compact" type="button" data-open-form="calculation">Получить расчёт</button>
        </div>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle><span></span><span></span><span></span><b class="sr-only">Меню</b></button>
      </div>
      <div class="mobile-menu" id="mobile-menu" data-mobile-menu aria-hidden="true">
        <div class="container">
          <p class="menu-label">Каталог продукции · 10 направлений</p>
          <div class="mobile-service-links">${serviceLinks}</div>
          <div class="mobile-main-links"><a href="/#production">Производство</a><a href="/#gallery">Проекты</a><a href="/#about">О компании</a><a href="/contacts"${active('/contacts')}>Контакты</a></div>
          <div class="mobile-menu-actions">${trackedLink(`tel:${config.phoneHref}`, 'Позвонить', 'click_phone', 'button button-secondary')}<button class="button button-primary" type="button" data-open-form="calculation">Получить расчёт</button></div>
        </div>
      </div>
    </header>`;
}

function breadcrumbs(items) {
  return `<nav class="breadcrumbs container" aria-label="Хлебные крошки"><ol>${items.map((item, index) => `<li>${item.href && index < items.length - 1 ? `<a href="${item.href}">${item.label}</a>` : `<span aria-current="page">${item.label}</span>`}</li>`).join('')}</ol></nav>`;
}

function contactActions(service = '') {
  const waText = encodeURIComponent(`Здравствуйте! Нужна консультация Prime Glass${service ? ` по услуге «${service}»` : ''}.`);
  return `<div class="contact-actions">
    ${trackedLink(`tel:${config.phoneHref}`, `<span class="action-icon">↗</span><span><small>Позвонить</small>${config.phoneDisplay}</span>`, 'click_phone', 'contact-action')}
    ${trackedLink(`https://wa.me/${config.whatsapp}?text=${waText}`, '<span class="action-icon action-icon-whatsapp"><img src="/icons/whatsapp.svg" alt="" width="20" height="20"></span><span><small>Написать</small>WhatsApp</span>', 'click_whatsapp', 'contact-action')}
  </div>`;
}

function heroActions(service = '', withDepth = false) {
  return `<div class="hero-actions${withDepth ? ' depth-layer' : ''}"${withDepth ? ' data-depth="34"' : ''}>
    <button class="button button-primary" type="button" data-open-form="calculation" data-service="${escapeHtml(service)}">Получить расчёт <span aria-hidden="true">↗</span></button>
    <button class="button button-secondary" type="button" data-open-form="project" data-service="${escapeHtml(service)}">Отправить проект</button>
  </div>`;
}

function homePage() {
  const primary = { src: '/photos/image4.webp', fallback: '/photos/image4.jpg', alt: 'Современная архитектура с панорамным стеклянным фасадом' };
  return `
    <main id="content">
      <section class="home-hero">
        <div class="home-hero-stage">
          <div class="container home-hero-grid">
          <div class="hero-copy depth-layer" data-depth="22">
            <p class="eyebrow">Prime Glass · Завод-изготовитель</p>
            <h1>Архитектура стекла<br><span>начинается здесь</span></h1>
            <div class="factory-proof depth-layer" data-depth="44" aria-label="Площадь завода Prime Glass — 4 000 квадратных метров"><strong>4 000 м²</strong><span>площадь собственного<br>завода-изготовителя</span></div>
            <p class="hero-lead">Производим стеклопакеты, фасады, перегородки, ограждения и изделия из закалённого стекла для частных и коммерческих объектов.</p>
            ${heroActions('', true)}
            ${contactActions()}
          </div>
          <div class="hero-media reveal">
            ${picture(primary, 'hero-picture', true)}
            <video class="hero-video" muted loop playsinline preload="none" poster="/photos/image4.jpg" data-hero-video aria-hidden="true" tabindex="-1"><source data-desktop-src="/photos/prime-glass-intro.mp4" data-mobile-src="/photos/prime-glass-mobile.mp4" type="video/mp4"></video>
            <div class="hero-media-caption"><span>01</span><p>Стеклянные конструкции<br>по индивидуальному проекту</p></div>
          </div>
          </div>
          <div class="container fact-strip depth-layer" data-depth="28" aria-label="Ключевые преимущества">
          <div><strong>4 000 м²</strong><span>площадь завода-изготовителя в Алматы</span></div>
          <div><strong>Казахстан</strong><span>география проектных задач</span></div>
          <div><strong>B2C + B2B</strong><span>частные и коммерческие объекты</span></div>
          <div><strong>Полный цикл</strong><span>от консультации до монтажа</span></div>
          </div>
          <a class="hero-scroll-cue" href="#reels" aria-label="Смотреть дальше"><span>Смотреть дальше</span><i aria-hidden="true">↓</i></a>
        </div>
      </section>

      ${instagramReelsSection()}
      <section class="section glass-section" id="services">
        <div class="container">
          <div class="section-intro catalog-intro reveal"><p class="eyebrow">Каталог продукции · 10 направлений</p><h2>Каталог решений<br>из стекла</h2><p>Стеклопакеты, фасадное и интерьерное остекление, окна, перегородки, ограждения и обработка стекла — от изготовления до монтажа.</p></div>
          <div class="solutions-film reveal">
            <video muted loop playsinline preload="metadata" poster="/photos/image6.jpg" data-section-video aria-label="Инженерные решения Prime Glass из стекла"><source src="/photos/prime-glass-solutions.mp4" type="video/mp4"></video>
            <div class="solutions-film-caption"><span>Завод-изготовитель · Алматы</span><strong>4 000 м²</strong><p>собственное производство стеклянных конструкций</p></div>
          </div>
          <div class="service-grid">
            ${services.map(service => `<a class="service-card reveal" href="${routeFor(service)}"><div class="service-card-media">${picture({src:`/photos/image${service.image}.webp`,fallback:`/photos/image${service.image}.jpg`,alt:service.title})}</div><div class="service-card-content"><h3>${service.title}</h3><p>${service.lead}</p></div></a>`).join('')}
          </div>
        </div>
      </section>

      <section class="section section-dark glass-section" id="about">
        <div class="container split-intro">
          <div class="reveal"><p class="eyebrow eyebrow-light">Подход Prime Glass</p><h2>Сначала задача.<br>Затем конструкция.</h2></div>
          <div class="large-copy reveal"><p>Мы строим работу вокруг объекта: уточняем геометрию, условия эксплуатации, требования к безопасности, внешний вид и монтаж.</p><p class="muted-light">Каждое решение проходит техническую проработку: от выбора стекла и обработки кромки до комплектации, доставки и установки на объекте.</p></div>
        </div>
        <div class="container capability-grid">
          ${[['01','Частным клиентам','Окна, душевые, перегородки, козырьки и ограждения по индивидуальным размерам.'],['02','Архитекторам','Помощь в подборе стекла, профильной системы, обработки и узлов реализации.'],['03','Подрядчикам','Производственная проработка и комплектация для строительных и интерьерных проектов.'],['04','Корпоративным заказчикам','Коммерческое предложение, техническая коммуникация и планирование реализации.']].map(item => `<article class="capability-card reveal"><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('')}
        </div>
      </section>

      <section class="section production-section glass-section" id="production">
        <div class="container production-grid">
          <div class="production-media reveal">${picture({src:'/photos/image6.webp',fallback:'/photos/image6.jpg',alt:'Производственная обработка листового стекла'},'production-picture')}<p class="media-caption">Обработка стекла по техническому заданию проекта</p></div>
          <div class="production-copy reveal"><p class="eyebrow">Завод-изготовитель · 4 000 м²</p><h2>Собственное производство<br>полного цикла</h2><p>Изготавливаем стеклянные конструкции на заводе Prime Glass площадью 4 000 м² в Алматы. До запуска проверяем размеры, отверстия, вырезы, обработку кромки и комплектацию по техническому заданию.</p><ul class="line-list"><li><span>01</span>Проверка исходных данных</li><li><span>02</span>Подбор стекла и обработки</li><li><span>03</span>Согласование комплектации</li><li><span>04</span>Изготовление и контроль</li></ul><a class="button button-secondary" href="/zakalka-stekla">Закалка и обработка</a></div>
        </div>
      </section>

      <section class="section gallery-section glass-section" id="gallery">
        <div class="container"><div class="section-intro reveal"><p class="eyebrow">Решения для объектов</p><h2>Архитектура стекла</h2><p>Фасады, ограждения, перегородки и интерьерные конструкции — ориентиры для обсуждения вашего проекта.</p></div>
          <div class="home-gallery">
            ${[4,10,9,7].map((n,index) => `<button class="gallery-tile tile-${index+1} reveal" type="button" data-lightbox="/photos/image${n}.webp" data-alt="Визуальный пример решения из стекла">${picture({src:`/photos/image${n}.webp`,fallback:`/photos/image${n}.jpg`,alt:'Визуальный пример решения из стекла'},'',false)}<span>Смотреть <b>↗</b></span></button>`).join('')}
          </div>
        </div>
      </section>

      ${processSection(true)}
      ${ctaSection('Обсудим ваш проект?', 'Пришлите размеры, чертёж или описание задачи. Мы соберём исходные данные и подготовим индивидуальный расчёт.')}
      ${contactSection()}
    </main>`;
}

function instagramReelsSection() {
  const cards = duplicate => instagramReels.map((id, index) => {
    const reelUrl = `https://www.instagram.com/reel/${id}/`;
    return `<a class="reel-card" href="${reelUrl}" target="_blank" rel="noopener noreferrer" data-track="view_reel" data-reel-id="${id}" aria-label="Открыть Reel ${index + 1} в Instagram"${duplicate ? ' tabindex="-1"' : ''}>
      <img src="/photos/reel-${id}.jpg" alt="" width="360" height="640" loading="lazy" decoding="async">
      <span class="reel-badge">Reels</span><span class="reel-open">Смотреть в Instagram <b>↗</b></span>
    </a>`;
  }).join('');
  return `<section class="section reels-section glass-section" id="reels">
    <div class="container reels-heading reveal">
      <div><p class="eyebrow">Prime Glass · Instagram</p><h2>Стекло<br>в движении</h2><p>Производство, монтаж и готовые решения — в коротких видео команды Prime Glass.</p></div>
      <div class="reels-actions"><a class="button button-primary" href="${instagramProfile}" target="_blank" rel="noopener noreferrer" data-track="click_instagram">Смотреть Instagram <span aria-hidden="true">↗</span></a></div>
    </div>
    <div class="reels-carousel reveal" data-reels-carousel>
      <div class="reels-viewport" aria-label="Reels Prime Glass"><div class="reels-track">${cards(false)}<div class="reels-copy" aria-hidden="true">${cards(true)}</div></div></div>
    </div>
  </section>`;
}

function processSection(withGlassEdge = false) {
  const steps = [['01','Заявка или чертёж','Получаем размеры, фото, файл проекта и требования.'],['02','Уточнение и замер','Проверяем исходные данные, при необходимости согласуем выезд.'],['03','Коммерческое предложение','Фиксируем решение, комплектацию и условия.'],['04','Производство','Изготавливаем после согласования технических параметров.'],['05','Доставка и монтаж','Организуем логистику, установку и сдачу работ.']];
  return `<section class="section process-section${withGlassEdge ? ' glass-section' : ''}" id="process"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Как мы работаем</p><h2>Понятный маршрут<br>от идеи до монтажа</h2></div><ol class="process-list">${steps.map(step => `<li class="reveal"><span>${step[0]}</span><div><h3>${step[1]}</h3><p>${step[2]}</p></div></li>`).join('')}</ol></div></section>`;
}

function calculatorField(field) {
  const attributes = `${field.min ? `min="${field.min}"` : ''} ${field.value !== undefined ? `value="${field.value}"` : ''} ${field.placeholder ? `placeholder="${field.placeholder}"` : ''} ${field.required ? 'required' : ''}`;
  return `<label class="field"><span>${field.label}${field.required ? ' *' : ''}</span>${field.type === 'select' ? `<select name="${field.name}" ${field.required ? 'required' : ''}>${field.options.map(option => `<option>${option}</option>`).join('')}</select>` : `<input type="${field.type}" name="${field.name}" ${attributes}>`}</label>`;
}

function servicePage(service) {
  const heroImage = service.gallery.find(item => item.src.includes(`image${service.image}.`)) || service.gallery[0];
  return `
    <main id="content" data-service-page="${service.slug}">
      ${breadcrumbs([{href:'/',label:'Главная'},{href:'/#services',label:'Услуги'},{label:service.title}])}
      <section class="service-hero ${service.theme === 'dark' ? 'service-hero-dark' : ''}">
        <div class="container service-hero-grid">
          <div class="hero-copy reveal"><p class="eyebrow">${service.eyebrow}</p><h1>${service.h1}</h1><p class="hero-lead">${service.lead}</p>${heroActions(service.title)}${contactActions(service.title)}</div>
          <div class="service-hero-media reveal">${picture(heroImage,'hero-picture',true)}<div class="glass-note"><span>Prime Glass</span><p>Изготовление · доставка · монтаж</p></div></div>
        </div>
      </section>

      <section class="section benefits-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Преимущества</p><h2>Решение для объекта</h2></div><div class="benefit-grid">${service.benefits.map((item,index) => `<article class="benefit-card reveal"><span>${String(index+1).padStart(2,'0')}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div></div></section>

      <section class="section section-soft gallery-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Варианты решений</p><h2>${service.title}: варианты исполнения</h2><p>Подборка помогает определить желаемую геометрию, стиль и тип конструкции перед технической проработкой.</p></div><div class="filter-row" role="group" aria-label="Фильтр галереи"><button class="filter-button is-active" type="button" data-gallery-filter="Все">Все</button>${['Производство','Архитектура','Интерьер'].map(item => `<button class="filter-button" type="button" data-gallery-filter="${item}">${item}</button>`).join('')}</div><div class="gallery-grid" data-gallery>${service.gallery.map((image,index) => `<button class="gallery-item reveal" type="button" data-category="${image.category}" data-lightbox="${image.src}" data-alt="${escapeHtml(image.alt)}">${picture(image)}<span>${String(index+1).padStart(2,'0')} <b>↗</b></span></button>`).join('')}</div></div></section>

      <section class="section calculator-section" id="calculator"><div class="container calculator-shell reveal"><div class="calculator-copy"><p class="eyebrow eyebrow-light">Индивидуальный расчёт</p><h2>Соберите параметры</h2><p>Калькулятор не показывает вымышленную цену. Он сформирует понятное техническое сообщение для расчёта.</p><div class="calculator-progress"><span></span></div><p class="small-note">Стоимость определит специалист после проверки исходных данных.</p></div><form class="calculator-form" data-calculator data-service="${service.title}" novalidate><div class="form-grid">${service.calculator.map(calculatorField).join('')}<label class="field field-wide"><span>Комментарий</span><textarea name="comment" rows="3" placeholder="Особенности объекта, цвет, сроки или другие требования"></textarea></label><label class="field"><span>Ваше имя</span><input name="name" autocomplete="name" required></label><label class="field"><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required data-phone></label></div><label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку данных для ответа на обращение</span></label><button class="button button-primary" type="submit">Отправить параметры в WhatsApp</button><p class="form-status" role="status" aria-live="polite"></p></form></div></section>

      <section class="section applications-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Применение</p><h2>Где используется</h2></div><div class="application-grid">${service.applications.map((item,index)=>`<article class="application-card reveal"><span>${String(index+1).padStart(2,'0')}</span><h3>${item}</h3><p>Конфигурация и материалы подбираются под геометрию, условия эксплуатации и требования объекта.</p></article>`).join('')}</div></div></section>

      <section class="section section-dark variants-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow eyebrow-light">Конструкции</p><h2>Варианты исполнения</h2></div><div class="variant-grid">${service.types.map((item,index)=>`<article class="variant-card reveal"><span>${String(index+1).padStart(2,'0')}</span><h3>${item}</h3><p>Конфигурацию адаптируем под размеры, нагрузки, условия эксплуатации и выбранный способ монтажа.</p></article>`).join('')}</div></div></section>

      <section class="section specs-section"><div class="container specs-grid"><div class="reveal"><p class="eyebrow">Комплектация</p><h2>Что учитываем<br>в предложении</h2><ol class="package-list">${service.extras.map((item,index)=>`<li><span>${String(index+1).padStart(2,'0')}</span>${item}</li>`).join('')}</ol></div><div class="spec-table-wrap reveal"><table class="spec-table"><caption>Параметры для подбора решения</caption><tbody>${service.specs.map(row=>`<tr><th scope="row">${row[0]}</th><td>${row[1]}</td></tr>`).join('')}</tbody></table><p class="table-note">Итоговые размеры, толщина стекла, крепления и обработка определяются специалистом по геометрии и условиям конкретного объекта.</p></div></div></section>

      ${serviceProductionSection(service)}
      ${processSection()}
      <section class="section project-support"><div class="container trust-panel reveal"><div><p class="eyebrow">Инженерная проработка</p><h2>Решение под ваш объект</h2></div><div><p>Перед изготовлением команда Prime Glass уточнит размеры, условия эксплуатации, комплектацию и монтаж. Вы получите предложение, собранное под конкретную задачу.</p><p class="placeholder-tag">Чертёж · спецификация · расчёт</p><button class="button button-secondary" type="button" data-open-form="commercial" data-service="${service.title}">Получить коммерческое предложение</button></div></div></section>
      ${faqSection(service)}
      ${ctaSection(`Нужен расчёт: ${service.title.toLowerCase()}?`, 'Оставьте контакт — подготовим индивидуальное предложение без вымышленных цен.', service.title)}
      ${contactSection()}
    </main>`;
}

function faqSection(service) {
  return `<section class="section faq-section"><div class="container faq-grid"><div class="section-intro reveal"><p class="eyebrow">FAQ</p><h2>Частые вопросы</h2><p>Если вопрос связан с нестандартным узлом, лучше сразу приложить чертёж или фото.</p></div><div class="accordion">${service.faq.map((item,index)=>`<details class="faq-item reveal" ${index===0?'open':''}><summary>${item[0]}<span aria-hidden="true">+</span></summary><div><p>${item[1]}</p></div></details>`).join('')}</div></div></section>`;
}

function serviceProductionSection(service) {
  return `<section class="section service-production"><div class="container production-grid"><div class="production-media reveal">${picture({src:'/photos/image6.webp',fallback:'/photos/image6.jpg',alt:`Производственная обработка стекла для направления «${service.title}»`},'production-picture')}<p class="media-caption">Подготовка стекла и комплектации к реализации проекта</p></div><div class="production-copy reveal"><p class="eyebrow">Завод-изготовитель · 4 000 м²</p><h2>От чертежа<br>к готовому изделию</h2><p>Изделия для направления «${service.title}» изготавливаются на заводе Prime Glass площадью 4 000 м² в Алматы. До запуска проверяем размеры, материалы, обработку, крепления и условия монтажа, затем комплектуем заказ для доставки на объект.</p><ul class="line-list"><li><span>01</span>Проверка размеров и чертежей</li><li><span>02</span>Согласование материалов и обработки</li><li><span>03</span>Изготовление по утверждённому заданию</li><li><span>04</span>Комплектация к доставке и монтажу</li></ul></div></div></section>`;
}

function ctaSection(title, copy, service = '') {
  return `<section class="section cta-section"><div class="container cta-panel reveal"><div><p class="eyebrow eyebrow-light">Следующий шаг</p><h2>${title}</h2><p>${copy}</p></div><form class="mini-lead-form" data-lead-form data-form-kind="calculation" novalidate><input type="hidden" name="service" value="${escapeHtml(service)}"><label><span>Имя</span><input name="name" autocomplete="name" required></label><label><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required data-phone></label><label class="mini-consent"><input type="checkbox" name="consent" required><span>Согласен на обработку данных</span></label><button class="button button-light" type="submit">Отправить в WhatsApp</button><button class="mini-secondary" type="button" data-open-form="measurement" data-service="${escapeHtml(service)}">Или заказать замер</button><p class="form-status" role="status" aria-live="polite"></p></form></div></section>`;
}

function contactSection() {
  return `<section class="section contact-section" id="contacts"><div class="container contact-grid"><div class="reveal"><p class="eyebrow">Контакты</p><h2>Prime Glass<br>Technologies</h2><p>Алматы · работаем с проектами по Казахстану</p></div><div class="contact-list reveal"><a href="tel:${config.phoneHref}" data-track="click_phone"><small>Телефон</small><strong>${config.phoneDisplay}</strong></a><a href="mailto:${config.email}"><small>Email</small><strong>${config.email}</strong></a><div><small>График</small><strong>${config.schedule}</strong></div><div><small>Адрес</small><strong>${config.address}</strong></div></div></div></section>`;
}

function contactsPage() {
  return `<main id="content">${breadcrumbs([{href:'/',label:'Главная'},{label:'Контакты'}])}<section class="contacts-hero"><div class="container contacts-hero-grid"><div class="reveal"><p class="eyebrow">Связаться с нами</p><h1>Обсудим задачу<br>на языке проекта</h1><p class="hero-lead">Позвоните, напишите в WhatsApp или отправьте исходные данные для индивидуального расчёта.</p>${heroActions()}</div><div class="contact-card reveal"><a href="tel:${config.phoneHref}" data-track="click_phone"><small>Телефон</small><strong>${config.phoneDisplay}</strong></a><a href="https://wa.me/${config.whatsapp}" data-track="click_whatsapp"><small>WhatsApp</small><strong>${config.phoneDisplay}</strong></a><a href="mailto:${config.email}"><small>Email</small><strong>${config.email}</strong></a><div><small>Город</small><strong>${config.city}</strong></div><div><small>Адрес</small><strong>${config.address}</strong></div><div><small>График</small><strong>${config.schedule}</strong></div></div></div><div class="container map-placeholder location-panel reveal"><div><span>Алматы · Казахстан</span><strong>Производство, консультации и выезд на объекты по согласованию с командой Prime Glass</strong></div></div></section><section class="section section-soft"><div class="container contacts-form-grid"><div class="section-intro reveal"><p class="eyebrow">Оставить запрос</p><h2>Как вам удобнее?</h2><p>Форма сформирует готовое сообщение и откроет WhatsApp — останется проверить данные и отправить его менеджеру.</p></div>${inlineLeadForm()}</div></section>${contactSection()}</main>`;
}

function inlineLeadForm() {
  return `<form class="lead-form reveal" data-lead-form data-form-kind="callback" novalidate><div class="form-grid"><label class="field"><span>Имя</span><input name="name" autocomplete="name" required></label><label class="field"><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required data-phone></label><label class="field"><span>Услуга</span><select name="service"><option value="">Нужна консультация</option>${services.map(item=>`<option>${item.title}</option>`).join('')}</select></label><label class="field"><span>Желаемый способ ответа</span><select name="contactMethod"><option>WhatsApp</option><option>Телефон</option><option>Email</option></select></label><label class="field field-wide"><span>Комментарий</span><textarea name="comment" rows="4" placeholder="Кратко опишите задачу"></textarea></label></div><label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку данных для ответа на обращение</span></label><button class="button button-primary" type="submit">Отправить в WhatsApp</button><p class="form-status" role="status" aria-live="polite"></p></form>`;
}

function footer() {
  const year = new Date().getFullYear();
  const serviceLinks = services.map(service => `<a href="${routeFor(service)}">${service.title}</a>`).join('');
  return `<footer class="site-footer">
    <div class="container footer-lead">
      <div><p class="eyebrow eyebrow-light">Prime Glass · Завод 4 000 м²</p><h2>Стекло. Точно.<br>Для архитектуры.</h2></div>
      <div><p>Производим стеклянные конструкции в Алматы и реализуем проекты для частных и коммерческих объектов по Казахстану.</p><button class="button button-light" type="button" data-open-form="calculation">Получить расчёт <span aria-hidden="true">↗</span></button></div>
    </div>
    <div class="container footer-directory">
      <div class="footer-brand-block"><a class="brand brand-footer" href="/"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span><strong>Prime Glass</strong><small>Technologies</small></span></a><p>Завод-изготовитель стеклянных конструкций полного цикла.</p></div>
      <div class="footer-column footer-services"><h3>Услуги</h3><div class="footer-service-links">${serviceLinks}</div></div>
      <div class="footer-column"><h3>Связаться</h3><a href="tel:${config.phoneHref}" data-track="click_phone">${config.phoneDisplay}</a><a href="https://wa.me/${config.whatsapp}" data-track="click_whatsapp">WhatsApp ↗</a><a href="${instagramProfile}" target="_blank" rel="noopener noreferrer" data-track="click_instagram">Instagram ↗</a><a href="mailto:${config.email}">${config.email}</a></div>
      <div class="footer-column"><h3>Адрес и график</h3><p>${config.address}</p><p>${config.schedule}</p><a href="/contacts">Все контакты ↗</a></div>
    </div>
    <div class="container footer-bottom"><span>© ${year} Prime Glass Technologies</span><span>Алматы · Казахстан</span><span>Информация на сайте не является публичной офертой</span></div>
  </footer>`;
}

function modalAndFloating() {
  const telegramButton = config.telegram ? `<a class="floating-button telegram" href="https://t.me/${String(config.telegram).replace('@','')}" data-track="click_telegram" aria-label="Написать в Telegram"><span class="floating-logo"><img src="/icons/telegram.svg" alt="" width="24" height="24"></span><span class="floating-label"><strong>Telegram</strong><small>Написать сейчас</small></span></a>` : '';
  return `
    <div class="floating-actions" aria-label="Быстрые способы связи">
      <a class="floating-button whatsapp" href="https://wa.me/${config.whatsapp}" data-track="click_whatsapp" aria-label="Написать в WhatsApp"><span class="floating-logo"><img src="/icons/whatsapp.svg" alt="" width="24" height="24"></span><span class="floating-label"><strong>WhatsApp</strong><small>Написать сейчас</small></span></a>
      ${telegramButton}
    </div>
    <div class="mobile-cta"><a href="tel:${config.phoneHref}" data-track="click_phone"><span class="mobile-action-symbol">↗</span><span>Позвонить</span></a><a href="https://wa.me/${config.whatsapp}" data-track="click_whatsapp"><img src="/icons/whatsapp.svg" alt="" width="19" height="19"><span>WhatsApp</span></a><button type="button" data-open-form="calculation"><span class="mobile-action-symbol">+</span><span>Расчёт</span></button></div>
    <dialog class="form-dialog" data-form-dialog aria-labelledby="dialog-title">
      <div class="dialog-shell">
        <button class="dialog-close" type="button" data-dialog-close aria-label="Закрыть">×</button>
        <div class="dialog-intro"><p class="eyebrow">Запрос Prime Glass</p><h2 id="dialog-title" data-dialog-title>Получить расчёт</h2><p data-dialog-copy>Заполните исходные данные — мы сформируем сообщение для WhatsApp.</p></div>
        <form class="lead-form" data-lead-form data-form-kind="calculation" novalidate>
          <input type="hidden" name="kind" value="calculation"><input type="hidden" name="page" value="">
          <div class="form-grid"><label class="field"><span>Имя</span><input name="name" autocomplete="name" required></label><label class="field"><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required data-phone></label><label class="field"><span>Услуга</span><select name="service"><option value="">Нужна консультация</option>${services.map(item=>`<option>${item.title}</option>`).join('')}</select></label><label class="field"><span>Желаемый способ ответа</span><select name="contactMethod"><option>WhatsApp</option><option>Телефон</option><option>Email</option></select></label><label class="field field-wide"><span>Комментарий</span><textarea name="comment" rows="3" placeholder="Размеры, количество, сроки или особенности объекта"></textarea></label><label class="field field-wide file-field" data-file-field hidden><span>Файлы проекта</span><input name="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,.dwg,.dxf,.doc,.docx,.xls,.xlsx"><small>PDF, изображения и проектные форматы — до 10 МБ каждый и до 25 МБ суммарно. Файлы нужно будет прикрепить вручную в WhatsApp.</small></label></div>
          <label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку данных для ответа на обращение</span></label><button class="button button-primary" type="submit">Отправить в WhatsApp</button><p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </dialog>
    <dialog class="lightbox" data-lightbox-dialog><button class="lightbox-close" type="button" data-lightbox-close aria-label="Закрыть">×</button><img alt="" width="1280" height="853"></dialog>`;
}

function organizationSchema() {
  return {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    name: config.name, url: config.domain, telephone: config.phoneDisplay, email: config.email,
    address: { '@type': 'PostalAddress', addressLocality: config.city, addressCountry: 'KZ' },
    areaServed: { '@type': 'Country', name: 'Казахстан' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' }]
  };
}

function pageSchema(page) {
  const schema = [organizationSchema()];
  if (page.kind === 'service') {
    schema.push({ '@context':'https://schema.org','@type':'Service',name:page.service.title,description:page.service.lead,provider:{'@type':'Organization',name:config.name},areaServed:'Казахстан',url:`${config.domain}/${page.service.slug}` });
    schema.push({ '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{ '@type':'ListItem',position:1,name:'Главная',item:config.domain },{ '@type':'ListItem',position:2,name:'Услуги',item:`${config.domain}/#services`},{ '@type':'ListItem',position:3,name:page.service.title,item:`${config.domain}/${page.service.slug}` }] });
    schema.push({ '@context':'https://schema.org','@type':'FAQPage',mainEntity:page.service.faq.map(item=>({ '@type':'Question',name:item[0],acceptedAnswer:{'@type':'Answer',text:item[1]} })) });
  }
  return schema;
}

function documentTemplate(page) {
  const title = page.metaTitle;
  const description = page.metaDescription;
  const canonical = `${config.domain}${page.path === '/' ? '' : page.path}`;
  const socialImage = `${config.domain}/og.png`;
  return `<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  ${page.kind === '404' ? '<meta name="robots" content="noindex,follow">' : ''}
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website"><meta property="og:locale" content="ru_KZ"><meta property="og:site_name" content="Prime Glass Technologies"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${socialImage}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${socialImage}">
  <meta name="theme-color" content="#0b2534"><link rel="icon" type="image/png" href="/favicon.png">
  <link rel="preload" href="/style.css?v=20260810-large-catalog-whatsapp" as="style"><link rel="stylesheet" href="/style.css?v=20260810-large-catalog-whatsapp">
  <script type="application/ld+json">${JSON.stringify(pageSchema(page)).replaceAll('<','\\u003c')}</script>
</head>
<body class="page-${page.kind}">
  ${header(page.path)}
  ${page.content}
  ${footer()}
  ${modalAndFloating()}
  <script>window.PRIME_GLASS=${JSON.stringify({ whatsapp: config.whatsapp, phone: config.phoneHref, analytics: config.analytics }).replaceAll('<','\\u003c')};</script>
  <script src="/script.js?v=20260808-solutions-film" defer></script>
</body>
</html>`;
}

function renderHome() {
  return documentTemplate({kind:'home',path:'/',metaTitle:'Prime Glass — завод стеклянных конструкций 4 000 м² в Алматы',metaDescription:'Prime Glass — завод-изготовитель площадью 4 000 м² в Алматы. Производство, доставка и монтаж стеклопакетов, фасадов, перегородок, ограждений и закалённого стекла по Казахстану.',content:homePage()});
}

function renderService(service) {
  return documentTemplate({kind:'service',service,path:`/${service.slug}`,metaTitle:service.metaTitle,metaDescription:service.metaDescription,content:servicePage(service)});
}

function renderContacts() {
  return documentTemplate({kind:'contacts',path:'/contacts',metaTitle:'Контакты Prime Glass Technologies в Алматы',metaDescription:`Связаться с Prime Glass Technologies: ${config.phoneDisplay}, WhatsApp и email. Расчёт стеклянных конструкций в Алматы и по Казахстану.`,content:contactsPage()});
}

function render404() {
  return documentTemplate({kind:'404',path:'/404',metaTitle:'Страница не найдена | Prime Glass',metaDescription:'Запрошенная страница не найдена.',content:`<main id="content"><section class="not-found"><div class="container"><p class="eyebrow">Ошибка 404</p><h1>Эта страница<br>не существует</h1><p>Вернитесь на главную или выберите нужное направление.</p><a class="button button-primary" href="/">На главную</a></div></section></main>`});
}

module.exports = { renderHome, renderService, renderContacts, render404 };
