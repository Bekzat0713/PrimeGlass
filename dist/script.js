(function () {
  'use strict';

  const site = window.PRIME_GLASS || {};
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'yclid'];
  const params = new URLSearchParams(window.location.search);
  const currentUtm = Object.fromEntries(utmKeys.map(key => [key, params.get(key)]).filter(([, value]) => value));

  if (Object.keys(currentUtm).length) {
    try { localStorage.setItem('prime_glass_utm', JSON.stringify(currentUtm)); } catch (_) { /* storage can be unavailable */ }
  }

  function getUtm() {
    try { return { ...JSON.parse(localStorage.getItem('prime_glass_utm') || '{}'), ...currentUtm }; }
    catch (_) { return currentUtm; }
  }

  const trackedEvents = new Set();
  function track(name, details = {}, uniqueKey = '') {
    const key = `${name}:${uniqueKey}`;
    if (uniqueKey && trackedEvents.has(key)) return;
    if (uniqueKey) trackedEvents.add(key);
    const payload = {
      event: name,
      page: window.location.pathname,
      service: document.querySelector('[data-service-page]')?.dataset.servicePage || '',
      ...getUtm(),
      ...details
    };
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('primeglass:analytics', { detail: payload }));
  }
  const analyticsEvents = Object.freeze([
    'click_phone', 'click_whatsapp', 'click_telegram', 'open_calculator',
    'submit_calculation', 'submit_callback', 'submit_measurement', 'submit_project',
    'request_commercial_offer', 'download_catalog', 'view_service', 'view_case'
  ]);
  window.PrimeGlassAnalytics = { track, events: analyticsEvents };

  const toast = document.querySelector('[data-toast]');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }

  const header = document.querySelector('[data-header]');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  function closeMenu() {
    menuToggle?.setAttribute('aria-expanded', 'false');
    mobileMenu?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  mobileMenu?.addEventListener('click', event => { if (event.target.closest('a,button')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

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
      track(tracked.dataset.track, { link_url: tracked.href || '', selected_service: tracked.dataset.service || '' }, `${tracked.dataset.track}:${tracked.href || tracked.dataset.service || ''}`);
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    form.querySelectorAll('.has-error').forEach(field => field.classList.remove('has-error'));
    for (const input of form.querySelectorAll('[required]')) {
      const filled = input.type === 'checkbox' ? input.checked : input.value.trim();
      const phoneValid = input.matches('[data-phone]') ? input.value.replace(/\D/g, '').length === 11 : true;
      if (!filled || !phoneValid) {
        input.closest('.field')?.classList.add('has-error');
        valid = false;
      }
    }
    if (!valid) setFormStatus(form, 'Проверьте обязательные поля и номер телефона.', 'error');
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

  document.querySelectorAll('[data-disabled-channel]').forEach(button => button.addEventListener('click', () => {
    showToast('Telegram пока не подключён: публичный контакт ожидает подтверждения. Используйте WhatsApp или телефон.');
  }));

  if (document.querySelector('[data-service-page]')) {
    track('view_service', {}, `page:${window.location.pathname}`);
  }
})();
