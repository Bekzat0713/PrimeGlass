(function () {
  'use strict';

  const site = window.PRIME_GLASS || {};
  const analyticsConfig = site.analytics || {};
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'yclid', 'fbclid', 'msclkid'];
  const params = new URLSearchParams(window.location.search);
  const currentCampaign = Object.fromEntries(campaignKeys.map(key => [key, params.get(key)]).filter(([, value]) => value));
  const storageKeys = {
    firstTouch: 'prime_glass_first_touch',
    lastTouch: 'prime_glass_last_touch',
    legacyUtm: 'prime_glass_utm'
  };

  function readStorage(key) {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); }
    catch (_) { return {}; }
  }

  function writeStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (_) { /* storage can be unavailable */ }
  }

  function inferTrafficSource(campaign = {}) {
    if (campaign.utm_source) return campaign.utm_source;
    if (campaign.gclid) return 'google';
    if (campaign.yclid) return 'yandex';
    if (campaign.fbclid) return 'meta';
    if (campaign.msclkid) return 'microsoft';
    if (document.referrer) {
      try { return new URL(document.referrer).hostname.replace(/^www\./, ''); }
      catch (_) { return 'referral'; }
    }
    return 'direct';
  }

  const touch = {
    ...currentCampaign,
    traffic_source: inferTrafficSource(currentCampaign),
    landing_page: `${window.location.pathname}${window.location.search}`,
    referrer: document.referrer || '',
    captured_at: new Date().toISOString()
  };
  const storedFirstTouch = readStorage(storageKeys.firstTouch);
  if (!Object.keys(storedFirstTouch).length) writeStorage(storageKeys.firstTouch, touch);
  if (Object.keys(currentCampaign).length || !Object.keys(readStorage(storageKeys.lastTouch)).length) {
    writeStorage(storageKeys.lastTouch, touch);
  }
  if (Object.keys(currentCampaign).length) writeStorage(storageKeys.legacyUtm, currentCampaign);

  function getAttribution() {
    const first = Object.keys(storedFirstTouch).length ? storedFirstTouch : touch;
    const last = { ...readStorage(storageKeys.lastTouch), ...currentCampaign };
    return {
      ...Object.fromEntries(campaignKeys.map(key => [key, last[key]]).filter(([, value]) => value)),
      traffic_source: last.traffic_source || inferTrafficSource(last),
      traffic_medium: last.utm_medium || (last.gclid || last.yclid || last.fbclid || last.msclkid ? 'paid' : 'unknown'),
      first_traffic_source: first.traffic_source || inferTrafficSource(first),
      first_landing_page: first.landing_page || '',
      landing_page: last.landing_page || first.landing_page || '',
      referrer: last.referrer || first.referrer || ''
    };
  }

  function getUtm() {
    return Object.fromEntries(Object.entries(getAttribution()).filter(([key]) => campaignKeys.includes(key)));
  }

  function appendAnalyticsScript(id, src) {
    if (!id || document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function initAnalyticsProviders() {
    window.dataLayer = window.dataLayer || [];
    const gtmId = /^GTM-[A-Z0-9]+$/i.test(analyticsConfig.googleTagManagerId || '') ? analyticsConfig.googleTagManagerId : '';
    const ga4Id = /^G-[A-Z0-9]+$/i.test(analyticsConfig.googleAnalyticsId || '') ? analyticsConfig.googleAnalyticsId : '';
    const metrikaId = /^\d+$/.test(String(analyticsConfig.yandexMetrikaId || '')) ? String(analyticsConfig.yandexMetrikaId) : '';
    const pixelId = /^\d+$/.test(String(analyticsConfig.metaPixelId || '')) ? String(analyticsConfig.metaPixelId) : '';

    if (gtmId) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      appendAnalyticsScript('prime-glass-gtm', `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`);
    } else if (ga4Id) {
      window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ga4Id, { anonymize_ip: true });
      appendAnalyticsScript('prime-glass-ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`);
    }

    if (metrikaId) {
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym.l = Date.now();
      window.ym(metrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
      appendAnalyticsScript('prime-glass-metrika', 'https://mc.yandex.ru/metrika/tag.js');
    }

    if (pixelId) {
      window.fbq = window.fbq || function () { (window.fbq.queue = window.fbq.queue || []).push(arguments); };
      window.fbq.loaded = true;
      window.fbq.version = '2.0';
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
      appendAnalyticsScript('prime-glass-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js');
    }

    return { gtmId, ga4Id: gtmId ? '' : ga4Id, metrikaId, pixelId };
  }

  const activeProviders = initAnalyticsProviders();
  const recentEvents = new Map();
  function track(name, details = {}, options = {}) {
    const normalizedOptions = typeof options === 'string' ? { dedupeKey: options } : options;
    const dedupeKey = normalizedOptions.dedupeKey || '';
    const dedupeMs = Number.isFinite(normalizedOptions.dedupeMs) ? normalizedOptions.dedupeMs : 1200;
    const key = dedupeKey ? `${name}:${dedupeKey}` : '';
    const now = Date.now();
    if (key && recentEvents.has(key) && now - recentEvents.get(key) < dedupeMs) return false;
    if (key) recentEvents.set(key, now);
    if (recentEvents.size > 100) {
      for (const [eventKey, timestamp] of recentEvents) if (now - timestamp > 60000) recentEvents.delete(eventKey);
    }

    const pageService = document.querySelector('[data-service-page]')?.dataset.servicePage || '';
    const selectedService = details.selected_service || pageService;
    const payload = {
      event: name,
      event_id: `${name}-${now}-${Math.random().toString(36).slice(2, 9)}`,
      event_time: new Date(now).toISOString(),
      page: window.location.pathname,
      page_path: window.location.pathname,
      page_url: window.location.href,
      page_title: document.title,
      service: selectedService,
      ...getAttribution(),
      ...details
    };
    window.dataLayer.push(payload);

    const vendorPayload = { ...payload };
    delete vendorPayload.event;
    if (activeProviders.ga4Id && typeof window.gtag === 'function') window.gtag('event', name, vendorPayload);
    if (activeProviders.metrikaId && typeof window.ym === 'function') window.ym(activeProviders.metrikaId, 'reachGoal', name, vendorPayload);
    if (activeProviders.pixelId && typeof window.fbq === 'function') window.fbq('trackCustom', name, vendorPayload);
    window.dispatchEvent(new CustomEvent('primeglass:analytics', { detail: payload }));
    return true;
  }
  const analyticsEvents = Object.freeze([
    'click_phone', 'click_whatsapp', 'click_telegram', 'open_calculator',
    'submit_calculation', 'submit_callback', 'submit_measurement', 'submit_project',
    'request_commercial_offer', 'download_catalog', 'view_service', 'view_case',
    'click_instagram', 'view_reel'
  ]);
  window.PrimeGlassAnalytics = { track, events: analyticsEvents, getAttribution, providers: activeProviders };

  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  function closeMenu() {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    mobileMenu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu?.setAttribute('aria-hidden', String(!open));
    mobileMenu?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  mobileMenu?.addEventListener('click', event => { if (event.target.closest('a,button')) closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1180) closeMenu(); }, { passive: true });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    closeMenu();
    document.querySelector('.nav-dropdown')?.classList.remove('is-open');
    servicesToggle?.setAttribute('aria-expanded', 'false');
  });

  const servicesToggle = document.querySelector('[data-services-toggle]');
  servicesToggle?.addEventListener('click', event => {
    const dropdown = event.currentTarget.closest('.nav-dropdown');
    const open = !dropdown.classList.contains('is-open');
    dropdown.classList.toggle('is-open', open);
    servicesToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown')) {
      document.querySelector('.nav-dropdown')?.classList.remove('is-open');
      servicesToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', event => {
    const tracked = event.target.closest('[data-track]');
    if (tracked) {
      track(tracked.dataset.track, { link_url: tracked.href || '', selected_service: tracked.dataset.service || '', reel_id: tracked.dataset.reelId || '' }, `${tracked.dataset.track}:${tracked.href || tracked.dataset.service || ''}`);
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && window.innerWidth > 900 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  function initDepthScroll() {
    if (!document.body.classList.contains('page-home') || window.innerWidth <= 900 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const depthItems = [
      ...document.querySelectorAll('[data-depth]'),
      ...document.querySelectorAll('.page-home .service-grid, .page-home .production-grid, .page-home .home-gallery, .page-home .process-list, .page-home .cta-panel')
    ];
    depthItems.forEach((item, index) => {
      item.classList.add('depth-layer');
      if (!item.dataset.depth) item.dataset.depth = String(14 + (index % 3) * 7);
    });
    const heroVisuals = document.querySelectorAll('.page-home .hero-picture img, .page-home .hero-video');
    const hero = document.querySelector('.page-home .home-hero');
    const heroCopy = document.querySelector('.page-home .hero-copy');
    const heroFacts = document.querySelector('.page-home .fact-strip');
    const heroCue = document.querySelector('.page-home .hero-scroll-cue');
    const tiltButtons = document.querySelectorAll('.page-home .hero-actions .button');
    let frame = 0;
    const renderDepth = () => {
      frame = 0;
      const viewportHeight = window.innerHeight || 1;
      const scrollTop = window.scrollY;
      const heroTop = hero?.offsetTop || 0;
      const heroTravel = Math.max((hero?.offsetHeight || viewportHeight) - viewportHeight, 1);
      const heroProgress = Math.max(0, Math.min(1, (scrollTop - heroTop) / heroTravel));
      const easedHeroProgress = heroProgress * heroProgress * (3 - 2 * heroProgress);
      const contentFade = Math.max(0, Math.min(1, (heroProgress - 0.62) / 0.32));
      heroVisuals.forEach(visual => {
        visual.style.setProperty('--hero-parallax', `${(easedHeroProgress * 24).toFixed(2)}px`);
        visual.style.setProperty('--hero-zoom', (1.08 + easedHeroProgress * 0.48).toFixed(3));
      });
      heroCopy?.style.setProperty('--hero-content-zoom', (1 + easedHeroProgress * 0.12).toFixed(3));
      heroCopy?.style.setProperty('--hero-content-opacity', (1 - contentFade).toFixed(3));
      heroFacts?.style.setProperty('--hero-facts-opacity', (1 - contentFade).toFixed(3));
      heroCue?.style.setProperty('--hero-cue-opacity', Math.max(0, 1 - heroProgress * 2.1).toFixed(3));
      depthItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const relative = Math.max(-1.15, Math.min(1.15, (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight));
        const strength = Number(item.dataset.depth || 18);
        item.style.setProperty('--depth-y', `${(relative * strength).toFixed(2)}px`);
        item.style.setProperty('--depth-z', `${((1 - Math.abs(relative)) * strength * 0.32).toFixed(2)}px`);
        item.style.setProperty('--depth-rx', `${(-relative * Math.min(strength / 12, 2.8)).toFixed(2)}deg`);
      });
    };
    const requestDepth = () => { if (!frame) frame = window.requestAnimationFrame(renderDepth); };
    renderDepth();
    window.addEventListener('scroll', requestDepth, { passive: true });
    window.addEventListener('resize', requestDepth, { passive: true });
    tiltButtons.forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        button.style.setProperty('--button-x', `${(x * 5).toFixed(1)}px`);
        button.style.setProperty('--button-y', `${(y * 4).toFixed(1)}px`);
        button.style.setProperty('--button-rx', `${(-y * 7).toFixed(1)}deg`);
        button.style.setProperty('--button-ry', `${(x * 9).toFixed(1)}deg`);
      });
      button.addEventListener('pointerleave', () => ['--button-x','--button-y','--button-rx','--button-ry'].forEach(property => button.style.removeProperty(property)));
    });
  }
  function initHeroVideo() {
    const video = document.querySelector('[data-hero-video]');
    const source = video?.querySelector('source[data-desktop-src][data-mobile-src]');
    if (!video || !source) return;
    const clientNavigator = window.navigator || {};
    const connection = clientNavigator.connection || clientNavigator.mozConnection || clientNavigator.webkitConnection;
    const constrainedNetwork = connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
    if (constrainedNetwork || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mobileVideoQuery = window.matchMedia('(max-width: 767px)');
    const loadVideoVariant = () => {
      const selectedSource = mobileVideoQuery.matches ? source.dataset.mobileSrc : source.dataset.desktopSrc;
      if (!selectedSource || source.getAttribute('src') === selectedSource) return;
      video.classList.remove('is-ready');
      video.addEventListener('loadeddata', () => {
        video.classList.add('is-ready');
        video.play().catch(() => {});
      }, { once: true });
      source.src = selectedSource;
      video.load();
    };
    loadVideoVariant();
    mobileVideoQuery.addEventListener?.('change', loadVideoVariant);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && !video.paused) video.pause();
      else if (!document.hidden) video.play().catch(() => {});
    });
  }

  function initSectionVideos() {
    const videos = document.querySelectorAll('[data-section-video]');
    if (!videos.length) return;
    const sectionConnection = window.navigator?.connection || window.navigator?.mozConnection || window.navigator?.webkitConnection;
    if (sectionConnection?.saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const playVideo = video => video.play().catch(() => {});
    if (!('IntersectionObserver' in window)) {
      videos.forEach(playVideo);
      return;
    }
    const videoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) playVideo(entry.target);
        else entry.target.pause();
      });
    }, { threshold: 0.22, rootMargin: '120px 0px' });
    videos.forEach(video => videoObserver.observe(video));
  }
  initHeroVideo();
  initSectionVideos();
  initDepthScroll();

  const filterButtons = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery] [data-category]');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.galleryFilter;
    filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
    galleryItems.forEach(item => {
      const visible = filter === 'Все' || item.dataset.category === filter;
      item.hidden = !visible;
      if (visible) item.classList.add('is-visible');
    });
  }));

  const lightbox = document.querySelector('[data-lightbox-dialog]');
  const lightboxImage = lightbox?.querySelector('img');
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-lightbox]');
    if (!trigger || !lightbox || !lightboxImage) return;
    lightboxImage.src = trigger.dataset.lightbox;
    lightboxImage.alt = trigger.dataset.alt || 'Увеличенное изображение';
    lightbox.showModal();
  });
  document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox?.close());
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

  const dialog = document.querySelector('[data-form-dialog]');
  const dialogForm = dialog?.querySelector('[data-lead-form]');
  const dialogTitle = dialog?.querySelector('[data-dialog-title]');
  const dialogCopy = dialog?.querySelector('[data-dialog-copy]');
  const fileField = dialog?.querySelector('[data-file-field]');
  const dialogKinds = {
    calculation: ['Получить расчёт', 'Опишите задачу — форма подготовит сообщение для WhatsApp.'],
    project: ['Отправить проект', 'Выберите файлы и затем прикрепите их вручную в открывшемся чате WhatsApp.'],
    measurement: ['Заказать замер', 'Оставьте контакт и адрес объекта в комментарии. Условия выезда уточнит менеджер.'],
    commercial: ['Получить коммерческое предложение', 'Укажите компанию, объект и исходные параметры проекта.'],
    callback: ['Заказать звонок', 'Укажите удобный способ связи и кратко опишите вопрос.']
  };
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-form]');
    if (!trigger || !dialog || !dialogForm) return;
    const kind = trigger.dataset.openForm || 'calculation';
    const [title, copy] = dialogKinds[kind] || dialogKinds.calculation;
    dialogTitle.textContent = title;
    dialogCopy.textContent = copy;
    dialogForm.dataset.formKind = kind;
    dialogForm.elements.kind.value = kind;
    dialogForm.elements.page.value = window.location.pathname;
    if (trigger.dataset.service && dialogForm.elements.service) dialogForm.elements.service.value = trigger.dataset.service;
    fileField.hidden = kind !== 'project';
    dialogForm.querySelector('.form-status').textContent = '';
    dialog.showModal();
    track(kind === 'calculation' ? 'open_calculator' : `open_${kind}`, {}, `open:${kind}:${window.location.pathname}`);
  });
  document.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  function formatPhone(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = `7${digits.slice(1)}`;
    if (!digits.startsWith('7')) digits = `7${digits}`;
    digits = digits.slice(0, 11);
    const parts = ['+7'];
    if (digits.length > 1) parts.push(` (${digits.slice(1, 4)}`);
    if (digits.length >= 4) parts.push(')');
    if (digits.length > 4) parts.push(` ${digits.slice(4, 7)}`);
    if (digits.length > 7) parts.push(`-${digits.slice(7, 9)}`);
    if (digits.length > 9) parts.push(`-${digits.slice(9, 11)}`);
    return parts.join('');
  }
  document.querySelectorAll('[data-phone]').forEach(input => {
    input.addEventListener('input', () => { input.value = formatPhone(input.value); });
    input.addEventListener('focus', () => { if (!input.value) input.value = '+7'; });
  });

  function setFormStatus(form, message, type = '') {
    const status = form.querySelector('.form-status');
    if (!status) return;
    status.textContent = message;
    status.className = `form-status${type ? ` is-${type}` : ''}`;
  }

  function validateForm(form) {
    let valid = true;
    let validationMessage = 'Проверьте обязательные поля и номер телефона.';
    form.querySelectorAll('.has-error').forEach(field => field.classList.remove('has-error'));
    for (const input of form.querySelectorAll('[required]')) {
      const filled = input.type === 'checkbox' ? input.checked : input.value.trim();
      const phoneValid = input.matches('[data-phone]') ? input.value.replace(/\D/g, '').length === 11 : true;
      if (!filled || !phoneValid || !input.checkValidity()) {
        input.closest('.field')?.classList.add('has-error');
        valid = false;
      }
    }
    const files = form.querySelector('input[type="file"]')?.files;
    if (files?.length) {
      const maxFileSize = 10 * 1024 * 1024;
      const maxTotalSize = 25 * 1024 * 1024;
      const allowedExtensions = new Set(['pdf','jpg','jpeg','png','webp','dwg','dxf','doc','docx','xls','xlsx']);
      const totalSize = Array.from(files).reduce((sum, file) => sum + file.size, 0);
      const invalidType = Array.from(files).some(file => !allowedExtensions.has(file.name.split('.').pop()?.toLowerCase()));
      if (invalidType || Array.from(files).some(file => file.size > maxFileSize) || totalSize > maxTotalSize) {
        form.querySelector('input[type="file"]')?.closest('.field')?.classList.add('has-error');
        validationMessage = invalidType ? 'Недопустимый формат файла. Используйте PDF, изображения или указанные проектные форматы.' : 'Файл должен быть не больше 10 МБ, общий объём — не больше 25 МБ.';
        valid = false;
      }
    }
    if (!valid) setFormStatus(form, validationMessage, 'error');
    return valid;
  }

  function eventForKind(kind) {
    return {
      calculation: 'submit_calculation', project: 'submit_project', measurement: 'submit_measurement',
      commercial: 'request_commercial_offer', callback: 'submit_callback'
    }[kind] || 'submit_callback';
  }

  function buildLeadMessage(form, calculator = false) {
    const data = new FormData(form);
    const labels = { name:'Имя', phone:'Телефон', service:'Услуга', contactMethod:'Связь', comment:'Комментарий', width:'Ширина, мм', height:'Высота, мм', quantity:'Количество', installation:'Комплектация', area:'Площадь, м²', length:'Длина, м', projection:'Вылет, мм' };
    const lines = [`Здравствуйте! ${calculator ? 'Нужен индивидуальный расчёт.' : 'Запрос с сайта Prime Glass.'}`];
    for (const [key, value] of data.entries()) {
      if (!value || ['consent','kind','page','files'].includes(key)) continue;
      lines.push(`${labels[key] || form.elements[key]?.closest('label')?.querySelector('span')?.textContent || key}: ${value}`);
    }
    const files = form.querySelector('input[type="file"]')?.files;
    if (files?.length) lines.push(`Выбрано файлов: ${files.length}. Прикреплю их в этом чате вручную.`);
    const attribution = getAttribution();
    lines.push(`Источник: ${attribution.traffic_source}${attribution.traffic_medium ? ` / ${attribution.traffic_medium}` : ''}`);
    const utm = getUtm();
    if (Object.keys(utm).length) lines.push(`UTM: ${Object.entries(utm).map(([key,value]) => `${key}=${value}`).join(', ')}`);
    lines.push(`Страница: ${window.location.href.split('?')[0]}`);
    return lines.join('\n');
  }

  function openWhatsApp(form, message, eventName) {
    if (form.dataset.submitting === 'true') return;
    form.dataset.submitting = 'true';
    const serviceValue = form.elements.service?.value || form.dataset.service || '';
    track(eventName, { selected_service: serviceValue }, `${eventName}:${Date.now()}`);
    setFormStatus(form, 'Открываем WhatsApp. Проверьте сообщение и отправьте его в чате.', 'success');
    window.open(`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => { form.dataset.submitting = 'false'; }, 1800);
  }

  document.querySelectorAll('[data-lead-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm(form)) return;
    const kind = form.dataset.formKind || form.elements.kind?.value || 'callback';
    openWhatsApp(form, buildLeadMessage(form), eventForKind(kind));
  }));

  document.querySelectorAll('[data-calculator]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validateForm(form)) return;
    openWhatsApp(form, buildLeadMessage(form, true), 'submit_calculation');
  }));

  if (document.querySelector('[data-service-page]')) {
    track('view_service', {}, `page:${window.location.pathname}`);
  }
})();
