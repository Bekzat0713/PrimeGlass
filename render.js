const config = require('./site-config');
const { services } = require('./services');
const imageDimensions = {
  1: [1280, 853], 2: [853, 1280], 3: [853, 1280], 4: [1280, 853], 5: [853, 1280],
  6: [1280, 853], 7: [853, 1280], 8: [1280, 853], 9: [853, 1280], 10: [853, 1280]
};

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

function header() {
  const serviceLinks = services.map(item => `<a href="${routeFor(item)}">${item.title}</a>`).join('');
  return `
    <a class="skip-link" href="#content">К содержанию</a>
    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="/" aria-label="Prime Glass — главная">
          <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span>
          <span><strong>Prime Glass</strong><small>Technologies</small></span>
        </a>
        <nav class="desktop-nav" aria-label="Основная навигация">
          <div class="nav-dropdown">
            <button type="button" aria-expanded="false" data-services-toggle>Услуги <span aria-hidden="true">⌄</span></button>
            <div class="services-menu">${serviceLinks}</div>
          </div>
          <a href="/#production">Производство</a>
          <a href="/#gallery">Проекты</a>
          <a href="/#about">О компании</a>
          <a href="/contacts">Контакты</a>
        </nav>
        <div class="header-actions">
          ${trackedLink(`tel:${config.phoneHref}`, config.phoneDisplay, 'click_phone', 'header-phone')}
          <button class="button button-primary button-compact" type="button" data-open-form="calculation">Получить расчёт</button>
        </div>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle><span></span><span></span><span></span><b class="sr-only">Меню</b></button>
      </div>
      <div class="mobile-menu" id="mobile-menu" data-mobile-menu>
        <div class="container">
          <p class="menu-label">Направления</p>
          <div class="mobile-service-links">${serviceLinks}</div>
          <div class="mobile-main-links"><a href="/#production">Производство</a><a href="/#gallery">Проекты</a><a href="/#about">О компании</a><a href="/contacts">Контакты</a></div>
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
    ${trackedLink(`https://wa.me/${config.whatsapp}?text=${waText}`, '<span class="action-icon">W</span><span><small>Написать</small>WhatsApp</span>', 'click_whatsapp', 'contact-action')}
  </div>`;
}

function heroActions(service = '') {
  return `<div class="hero-actions">
    <button class="button button-primary" type="button" data-open-form="calculation" data-service="${escapeHtml(service)}">Получить расчёт <span aria-hidden="true">↗</span></button>
    <button class="button button-secondary" type="button" data-open-form="project" data-service="${escapeHtml(service)}">Отправить проект</button>
  </div>`;
}

function homePage() {
  const primary = { src: '/photos/image2.webp', fallback: '/photos/image2.jpg', alt: 'Архитектурное здание со стеклянным фасадом' };
  return `
    <main id="content">
      <section class="home-hero">
        <div class="container home-hero-grid">
          <div class="hero-copy reveal">
            <p class="eyebrow">Производство · Актау · Казахстан</p>
            <h1>Стекло, которое<br><span>формирует архитектуру</span></h1>
            <p class="hero-lead">Производство, доставка и монтаж стеклопакетов, фасадов, перегородок и ограждений для частных и коммерческих объектов.</p>
            ${heroActions()}
            ${contactActions()}
          </div>
          <div class="hero-media reveal">
            ${picture(primary, 'hero-picture', true)}
            <div class="hero-media-caption"><span>01</span><p>Стеклянные конструкции<br>по индивидуальному проекту</p></div>
          </div>
        </div>
        <div class="container fact-strip" aria-label="Ключевые преимущества">
          <div><strong>Актау</strong><span>собственное направление производства</span></div>
          <div><strong>Казахстан</strong><span>география проектных задач</span></div>
          <div><strong>B2C + B2B</strong><span>частные и коммерческие объекты</span></div>
          <div><strong>Полный цикл</strong><span>от консультации до монтажа</span></div>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <div class="section-intro reveal"><p class="eyebrow">Направления</p><h2>Инженерные решения<br>из стекла</h2><p>От отдельного стеклопакета до комплексного фасадного или интерьерного решения.</p></div>
          <div class="service-grid">
            ${services.map((service, index) => `<a class="service-card reveal" href="${routeFor(service)}" data-track="view_service" data-service="${service.slug}"><span class="service-index">${String(index + 1).padStart(2, '0')}</span><h3>${service.title}</h3><p>${service.lead}</p><span class="text-link">Подробнее <b>↗</b></span></a>`).join('')}
          </div>
        </div>
      </section>

      <section class="section section-dark" id="about">
        <div class="container split-intro">
          <div class="reveal"><p class="eyebrow eyebrow-light">Подход Prime Glass</p><h2>Сначала задача.<br>Затем конструкция.</h2></div>
          <div class="large-copy reveal"><p>Мы строим работу вокруг объекта: уточняем геометрию, условия эксплуатации, требования к безопасности, внешний вид и монтаж.</p><p class="muted-light">Точные показатели компании, сертификаты и портфолио будут опубликованы после предоставления подтверждающих материалов.</p></div>
        </div>
        <div class="container capability-grid">
          ${[['01','Частным клиентам','Окна, душевые, перегородки, козырьки и ограждения по индивидуальным размерам.'],['02','Архитекторам','Помощь в подборе стекла, профильной системы, обработки и узлов реализации.'],['03','Подрядчикам','Производственная проработка и комплектация для строительных и интерьерных проектов.'],['04','Корпоративным заказчикам','Коммерческое предложение, техническая коммуникация и планирование реализации.']].map(item => `<article class="capability-card reveal"><span>${item[0]}</span><h3>${item[1]}</h3><p>${item[2]}</p></article>`).join('')}
        </div>
      </section>

      <section class="section production-section" id="production">
        <div class="container production-grid">
          <div class="production-media reveal">${picture({src:'/photos/image6.webp',fallback:'/photos/image6.jpg',alt:'Производственная линия обработки листового стекла'},'production-picture')}<p class="media-disclaimer">Изображение из текущих материалов сайта; статус как фото производства Prime Glass требует подтверждения.</p></div>
          <div class="production-copy reveal"><p class="eyebrow">Производство</p><h2>Точность начинается<br>до запуска в работу</h2><p>Размеры, отверстия, вырезы и обработка кромки должны быть согласованы до закалки. Поэтому мы просим чертёж или помогаем собрать техническое задание.</p><ul class="line-list"><li><span>01</span>Проверка исходных данных</li><li><span>02</span>Подбор стекла и обработки</li><li><span>03</span>Согласование комплектации</li><li><span>04</span>Изготовление и контроль</li></ul><a class="button button-secondary" href="/zakalka-stekla">Закалка и обработка</a></div>
        </div>
      </section>

      <section class="section gallery-section" id="gallery">
        <div class="container"><div class="section-intro reveal"><p class="eyebrow">Визуальные примеры</p><h2>Архитектура стекла</h2><p>Эти изображения показывают типы решений и не заявлены как выполненные объекты Prime Glass.</p></div>
          <div class="home-gallery">
            ${[4,10,9,7].map((n,index) => `<button class="gallery-tile tile-${index+1} reveal" type="button" data-lightbox="/photos/image${n}.webp" data-alt="Визуальный пример решения из стекла">${picture({src:`/photos/image${n}.webp`,fallback:`/photos/image${n}.jpg`,alt:'Визуальный пример решения из стекла'},'',false)}<span>Смотреть <b>↗</b></span></button>`).join('')}
          </div>
        </div>
      </section>

      ${processSection()}
      ${ctaSection('Обсудим ваш проект?', 'Пришлите размеры, чертёж или описание задачи. Мы соберём исходные данные и подготовим индивидуальный расчёт.')}
      ${contactSection()}
    </main>`;
}

function processSection() {
  const steps = [['01','Заявка или чертёж','Получаем размеры, фото, файл проекта и требования.'],['02','Уточнение и замер','Проверяем исходные данные, при необходимости согласуем выезд.'],['03','Коммерческое предложение','Фиксируем решение, комплектацию и условия.'],['04','Производство','Изготавливаем после согласования технических параметров.'],['05','Доставка и монтаж','Организуем логистику, установку и сдачу работ.']];
  return `<section class="section process-section" id="process"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Как мы работаем</p><h2>Понятный маршрут<br>от идеи до монтажа</h2></div><ol class="process-list">${steps.map(step => `<li class="reveal"><span>${step[0]}</span><div><h3>${step[1]}</h3><p>${step[2]}</p></div></li>`).join('')}</ol></div></section>`;
}

function calculatorField(field) {
  const attributes = `${field.min ? `min="${field.min}"` : ''} ${field.value !== undefined ? `value="${field.value}"` : ''} ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}`;
  return `<label class="field"><span>${field.label}</span>${field.type === 'select' ? `<select name="${field.name}">${field.options.map(option => `<option>${option}</option>`).join('')}</select>` : `<input type="${field.type}" name="${field.name}" ${attributes}>`}</label>`;
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

      <section class="section benefits-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Преимущества</p><h2>Решение под задачу объекта</h2></div><div class="benefit-grid">${service.benefits.map((item,index) => `<article class="benefit-card reveal"><span>${String(index+1).padStart(2,'0')}</span><h3>${item[0]}</h3><p>${item[1]}</p></article>`).join('')}</div></div></section>

      <section class="section section-soft gallery-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Визуальные примеры</p><h2>${service.title}: варианты решений</h2><p>Галерея иллюстрирует типы конструкций. Изображения не заявлены как портфолио Prime Glass до подтверждения происхождения.</p></div><div class="filter-row" role="group" aria-label="Фильтр галереи"><button class="filter-button is-active" type="button" data-gallery-filter="Все">Все</button>${['Производство','Архитектура','Интерьер'].map(item => `<button class="filter-button" type="button" data-gallery-filter="${item}">${item}</button>`).join('')}</div><div class="gallery-grid" data-gallery>${service.gallery.map((image,index) => `<button class="gallery-item reveal" type="button" data-category="${image.category}" data-lightbox="${image.src}" data-alt="${escapeHtml(image.alt)}">${picture(image)}<span>${String(index+1).padStart(2,'0')} <b>↗</b></span></button>`).join('')}</div></div></section>

      <section class="section calculator-section" id="calculator"><div class="container calculator-shell reveal"><div class="calculator-copy"><p class="eyebrow eyebrow-light">Индивидуальный расчёт</p><h2>Соберите параметры</h2><p>Калькулятор не показывает вымышленную цену. Он сформирует понятное техническое сообщение для расчёта.</p><div class="calculator-progress"><span></span></div><p class="small-note">Стоимость определит специалист после проверки исходных данных.</p></div><form class="calculator-form" data-calculator data-service="${service.title}" novalidate><div class="form-grid">${service.calculator.map(calculatorField).join('')}<label class="field field-wide"><span>Комментарий</span><textarea name="comment" rows="3" placeholder="Особенности объекта, цвет, сроки или другие требования"></textarea></label><label class="field"><span>Ваше имя</span><input name="name" autocomplete="name" required></label><label class="field"><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required data-phone></label></div><label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку данных для ответа на обращение</span></label><button class="button button-primary" type="submit">Отправить параметры в WhatsApp</button><p class="form-status" role="status" aria-live="polite"></p></form></div></section>

      <section class="section applications-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow">Применение</p><h2>Где используется</h2></div><div class="application-grid">${service.applications.map((item,index)=>`<article class="application-card reveal"><span>${String(index+1).padStart(2,'0')}</span><h3>${item}</h3><p>Конфигурация и материалы подбираются под геометрию, условия эксплуатации и требования объекта.</p></article>`).join('')}</div></div></section>

      <section class="section section-dark variants-section"><div class="container"><div class="section-intro reveal"><p class="eyebrow eyebrow-light">Конструкции</p><h2>Варианты исполнения</h2></div><div class="variant-grid">${service.types.map((item,index)=>`<article class="variant-card reveal"><span>${String(index+1).padStart(2,'0')}</span><h3>${item}</h3><p>Точная применимость подтверждается после проверки размеров и условий монтажа.</p></article>`).join('')}</div></div></section>

      <section class="section specs-section"><div class="container specs-grid"><div class="reveal"><p class="eyebrow">Комплектация</p><h2>Что учитываем<br>в предложении</h2><ol class="package-list">${service.extras.map((item,index)=>`<li><span>${String(index+1).padStart(2,'0')}</span>${item}</li>`).join('')}</ol></div><div class="spec-table-wrap reveal"><table class="spec-table"><caption>Ориентиры для подбора решения</caption><tbody>${service.specs.map(row=>`<tr><th scope="row">${row[0]}</th><td>${row[1]}</td></tr>`).join('')}</tbody></table><p class="table-note">Допустимые размеры, толщины и нагрузки не публикуются без подтверждённых технических данных. Их проверяет специалист по проекту.</p></div></div></section>

      ${processSection()}
      <section class="section trust-placeholder"><div class="container trust-panel reveal"><div><p class="eyebrow">Материалы к публикации</p><h2>Доверие должно подтверждаться</h2></div><div><p>Реальные кейсы, отзывы, сертификаты, мощности, годы работы и показатели команды будут размещены после получения подтверждающих материалов от Prime Glass.</p><p class="placeholder-tag">Не опубликовано — данные ожидают подтверждения</p><button class="button button-secondary" type="button" data-open-form="commercial" data-service="${service.title}">Получить коммерческое предложение</button></div></div></section>
      ${faqSection(service)}
      ${ctaSection(`Нужен расчёт: ${service.title.toLowerCase()}?`, 'Оставьте размеры и контакт — подготовим индивидуальное предложение без вымышленных цен.')}
      ${contactSection()}
    </main>`;
}

function faqSection(service) {
  return `<section class="section faq-section"><div class="container faq-grid"><div class="section-intro reveal"><p class="eyebrow">FAQ</p><h2>Частые вопросы</h2><p>Если вопрос связан с нестандартным узлом, лучше сразу приложить чертёж или фото.</p></div><div class="accordion">${service.faq.map((item,index)=>`<details class="faq-item reveal" ${index===0?'open':''}><summary>${item[0]}<span aria-hidden="true">+</span></summary><div><p>${item[1]}</p></div></details>`).join('')}</div></div></section>`;
}

function ctaSection(title, copy) {
  return `<section class="section cta-section"><div class="container cta-panel reveal"><div><p class="eyebrow eyebrow-light">Следующий шаг</p><h2>${title}</h2><p>${copy}</p></div><div class="cta-buttons"><button class="button button-light" type="button" data-open-form="calculation">Получить расчёт</button><button class="button button-outline-light" type="button" data-open-form="measurement">Заказать замер</button></div></div></section>`;
}

function contactSection() {
  return `<section class="section contact-section" id="contacts"><div class="container contact-grid"><div class="reveal"><p class="eyebrow">Контакты</p><h2>Prime Glass<br>Technologies</h2><p>Актау · работаем с проектами по Казахстану</p></div><div class="contact-list reveal"><a href="tel:${config.phoneHref}" data-track="click_phone"><small>Телефон</small><strong>${config.phoneDisplay}</strong></a><a href="mailto:${config.email}"><small>Email</small><strong>${config.email}</strong></a><div><small>График</small><strong>${config.schedule}</strong></div><div><small>Адрес</small><strong>Уточняется — требуется подтверждение</strong></div></div></div></section>`;
}

function contactsPage() {
  return `<main id="content">${breadcrumbs([{href:'/',label:'Главная'},{label:'Контакты'}])}<section class="contacts-hero"><div class="container contacts-hero-grid"><div class="reveal"><p class="eyebrow">Связаться с нами</p><h1>Обсудим задачу<br>на языке проекта</h1><p class="hero-lead">Позвоните, напишите в WhatsApp или отправьте исходные данные для индивидуального расчёта.</p>${heroActions()}</div><div class="contact-card reveal"><a href="tel:${config.phoneHref}" data-track="click_phone"><small>Телефон</small><strong>${config.phoneDisplay}</strong></a><a href="https://wa.me/${config.whatsapp}" data-track="click_whatsapp"><small>WhatsApp</small><strong>${config.phoneDisplay}</strong></a><a href="mailto:${config.email}"><small>Email</small><strong>${config.email}</strong></a><div><small>Город</small><strong>${config.city}</strong></div><div><small>График</small><strong>${config.schedule}</strong></div><div class="pending-contact"><small>Адрес и карта</small><strong>Ожидают подтверждения</strong></div></div></div></section><section class="section section-soft"><div class="container contacts-form-grid"><div class="section-intro reveal"><p class="eyebrow">Оставить запрос</p><h2>Как вам удобнее?</h2><p>Форма сформирует сообщение и откроет WhatsApp. Данные не будут скрытно отправлены в сторонний сервис.</p></div>${inlineLeadForm()}</div></section>${contactSection()}</main>`;
}

function inlineLeadForm() {
  return `<form class="lead-form reveal" data-lead-form data-form-kind="callback" novalidate><div class="form-grid"><label class="field"><span>Имя</span><input name="name" autocomplete="name" required></label><label class="field"><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required data-phone></label><label class="field"><span>Услуга</span><select name="service"><option value="">Нужна консультация</option>${services.map(item=>`<option>${item.title}</option>`).join('')}</select></label><label class="field"><span>Способ связи</span><select name="contactMethod"><option>WhatsApp</option><option>Телефон</option><option>Email</option></select></label><label class="field field-wide"><span>Комментарий</span><textarea name="comment" rows="4" placeholder="Кратко опишите задачу"></textarea></label></div><label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку данных для ответа на обращение</span></label><button class="button button-primary" type="submit">Отправить в WhatsApp</button><p class="form-status" role="status" aria-live="polite"></p></form>`;
}

function footer() {
  const year = new Date().getFullYear();
  return `<footer class="site-footer"><div class="container footer-top"><a class="brand brand-footer" href="/"><span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i></span><span><strong>Prime Glass</strong><small>Technologies</small></span></a><p>Производство и монтаж стеклянных конструкций в Актау и по Казахстану.</p><div class="footer-links"><a href="/#services">Услуги</a><a href="/#production">Производство</a><a href="/#gallery">Проекты</a><a href="/contacts">Контакты</a></div></div><div class="container footer-bottom"><span>© ${year} Prime Glass Technologies</span><span>Информация на сайте не является публичной офертой</span></div></footer>`;
}

function modalAndFloating() {
  return `
    <div class="floating-actions" aria-label="Быстрые способы связи">
      <a class="floating-button whatsapp" href="https://wa.me/${config.whatsapp}" data-track="click_whatsapp" aria-label="Написать в WhatsApp">W</a>
      <button class="floating-button telegram is-disabled" type="button" data-disabled-channel="telegram" aria-label="Telegram ожидает подтверждения">T</button>
    </div>
    <div class="mobile-cta"><a href="tel:${config.phoneHref}" data-track="click_phone">Позвонить</a><button type="button" data-open-form="calculation">Получить расчёт</button></div>
    <dialog class="form-dialog" data-form-dialog>
      <div class="dialog-shell">
        <button class="dialog-close" type="button" data-dialog-close aria-label="Закрыть">×</button>
        <div class="dialog-intro"><p class="eyebrow">Запрос Prime Glass</p><h2 data-dialog-title>Получить расчёт</h2><p data-dialog-copy>Заполните исходные данные — мы сформируем сообщение для WhatsApp.</p></div>
        <form class="lead-form" data-lead-form data-form-kind="calculation" novalidate>
          <input type="hidden" name="kind" value="calculation"><input type="hidden" name="page" value="">
          <div class="form-grid"><label class="field"><span>Имя</span><input name="name" autocomplete="name" required></label><label class="field"><span>Телефон</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required data-phone></label><label class="field"><span>Услуга</span><select name="service"><option value="">Нужна консультация</option>${services.map(item=>`<option>${item.title}</option>`).join('')}</select></label><label class="field"><span>Способ связи</span><select name="contactMethod"><option>WhatsApp</option><option>Телефон</option><option>Email</option></select></label><label class="field field-wide"><span>Комментарий</span><textarea name="comment" rows="3" placeholder="Размеры, количество, сроки или особенности объекта"></textarea></label><label class="field field-wide file-field" data-file-field hidden><span>Файлы проекта</span><input name="files" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp,.dwg,.dxf,.doc,.docx,.xls,.xlsx"><small>PDF, изображения и проектные форматы. Файлы нужно будет прикрепить вручную в WhatsApp.</small></label></div>
          <label class="consent"><input type="checkbox" name="consent" required><span>Согласен на обработку данных для ответа на обращение</span></label><button class="button button-primary" type="submit">Отправить в WhatsApp</button><p class="form-status" role="status" aria-live="polite"></p>
        </form>
      </div>
    </dialog>
    <dialog class="lightbox" data-lightbox-dialog><button class="lightbox-close" type="button" data-lightbox-close aria-label="Закрыть">×</button><img src="" alt="" width="1280" height="853"></dialog>
    <div class="toast" role="status" aria-live="polite" data-toast></div>`;
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
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website"><meta property="og:locale" content="ru_KZ"><meta property="og:site_name" content="Prime Glass Technologies"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${socialImage}">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escapeHtml(title)}"><meta name="twitter:description" content="${escapeHtml(description)}"><meta name="twitter:image" content="${socialImage}">
  <meta name="theme-color" content="#0b2534"><link rel="icon" type="image/png" href="/favicon.png">
  <link rel="preload" href="/style.css" as="style"><link rel="stylesheet" href="/style.css">
  <script type="application/ld+json">${JSON.stringify(pageSchema(page)).replaceAll('<','\\u003c')}</script>
</head>
<body>
  ${header()}
  ${page.content}
  ${footer()}
  ${modalAndFloating()}
  <script>window.PRIME_GLASS=${JSON.stringify({ whatsapp: config.whatsapp, phone: config.phoneHref, analytics: config.analytics }).replaceAll('<','\\u003c')};</script>
  <script src="/script.js" defer></script>
</body>
</html>`;
}

function renderHome() {
  return documentTemplate({kind:'home',path:'/',metaTitle:'Prime Glass — стекло и стеклянные конструкции в Актау',metaDescription:'Производство, доставка и монтаж стеклопакетов, фасадов, перегородок, ограждений и изделий из закалённого стекла в Актау и по Казахстану.',content:homePage()});
}

function renderService(service) {
  return documentTemplate({kind:'service',service,path:`/${service.slug}`,metaTitle:service.metaTitle,metaDescription:service.metaDescription,content:servicePage(service)});
}

function renderContacts() {
  return documentTemplate({kind:'contacts',path:'/contacts',metaTitle:'Контакты Prime Glass Technologies в Актау',metaDescription:`Связаться с Prime Glass Technologies: ${config.phoneDisplay}, WhatsApp и email. Расчёт стеклянных конструкций в Актау и по Казахстану.`,content:contactsPage()});
}

function render404() {
  return documentTemplate({kind:'404',path:'/404',metaTitle:'Страница не найдена | Prime Glass',metaDescription:'Запрошенная страница не найдена.',content:`<main id="content"><section class="not-found"><div class="container"><p class="eyebrow">Ошибка 404</p><h1>Эта страница<br>не существует</h1><p>Вернитесь на главную или выберите нужное направление.</p><a class="button button-primary" href="/">На главную</a></div></section></main>`});
}

module.exports = { renderHome, renderService, renderContacts, render404 };
