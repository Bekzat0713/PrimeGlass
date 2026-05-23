/* ==========================================================================
   Data
   ========================================================================== */

const createIcon = (paths) => `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    ${paths}
  </svg>
`;

const iconMap = {
  shield: createIcon(`
    <path d="M12 3 5 6v6c0 4.3 2.7 8.2 7 9 4.3-.8 7-4.7 7-9V6l-7-3Z" />
    <path d="m9.4 12.2 1.8 1.8 3.6-4.1" />
  `),
  wallet: createIcon(`
    <path d="M4 8a2 2 0 0 1 2-2h10.5a1.5 1.5 0 0 1 0 3H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9.5A1.5 1.5 0 0 0 18.5 8H4Z" />
    <path d="M16 13h4" />
  `),
  map: createIcon(`
    <path d="M9 18 3.8 20V6L9 4l6 2 5.2-2v14L15 20 9 18Z" />
    <path d="M9 4v14" />
    <path d="M15 6v14" />
  `),
  delivery: createIcon(`
    <path d="M3 8h11v7H3z" />
    <path d="M14 10h3l3 3v2h-6Z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  `),
  experience: createIcon(`
    <path d="M5 20h14" />
    <path d="M6 20V8l6-4 6 4v12" />
    <path d="M10 12h4" />
    <path d="M10 16h4" />
  `),
  quality: createIcon(`
    <circle cx="12" cy="10" r="5" />
    <path d="m8.5 20 3.5-3 3.5 3v-6.2" />
    <path d="m10.8 10 1 1 2.2-2.4" />
  `),
  solutions: createIcon(`
    <path d="M4 7h16" />
    <path d="M7 12h10" />
    <path d="M10 17h4" />
    <rect x="3" y="4" width="18" height="16" rx="2" />
  `),
  shower: createIcon(`
    <path d="M7 4h10" />
    <path d="M8 4v16" />
    <path d="M16 4v16" />
    <path d="M8 12h8" />
    <path d="M18 18h2" />
  `),
  office: createIcon(`
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M12 4v16" />
    <path d="M4 12h16" />
  `),
  loft: createIcon(`
    <path d="M4 19V5" />
    <path d="M10 19V5" />
    <path d="M16 19V5" />
    <path d="M22 19V5" />
    <path d="M4 11h18" />
  `),
  railing: createIcon(`
    <path d="M4 8h10l6 4" />
    <path d="M7 8v10" />
    <path d="M12 8v10" />
    <path d="M17 12v6" />
    <path d="M4 18h16" />
  `),
  facade: createIcon(`
    <path d="M5 20V7l4-3 4 3v13" />
    <path d="M13 20V4l6 2v14" />
    <path d="M8 9h2" />
    <path d="M8 13h2" />
    <path d="M16 9h1.5" />
    <path d="M16 13h1.5" />
  `),
  factory: createIcon(`
    <path d="M3 20h18" />
    <path d="M4 20V8l5 3V8l5 3V5l6 4v11" />
    <path d="M15 5V3" />
  `),
  certificate: createIcon(`
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 8h8" />
    <path d="M8 12h8" />
    <path d="M9.5 17 12 15l2.5 2" />
  `),
  catalog: createIcon(`
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3V4Z" />
    <path d="M8 7h7" />
    <path d="M8 11h7" />
  `),
  team: createIcon(`
    <circle cx="9" cy="8" r="3" />
    <circle cx="17" cy="10" r="2" />
    <path d="M4 19a5 5 0 0 1 10 0" />
    <path d="M15 19a3.5 3.5 0 0 1 7 0" />
  `),
  phone: createIcon(`
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.3 1.3a16 16 0 0 0 6.5 6.5l1.3-1.3a2 2 0 0 1 1.8-.6l3 .5A2 2 0 0 1 22 16.9Z" />
  `),
  whatsapp: createIcon(`
    <path d="M20 11.5a8.5 8.5 0 1 0-15.7 4.4L3 21l5.3-1.3A8.5 8.5 0 0 0 20 11.5Z" />
    <path d="m9.1 8.8.7-.8c.3-.3.7-.3 1 0l1.2 1.3c.3.3.3.8 0 1.1l-.6.7a.7.7 0 0 0-.1.8c.5 1 1.3 1.8 2.3 2.3.3.1.6.1.8-.1l.7-.6c.3-.3.8-.3 1.1 0l1.3 1.2c.3.3.3.7 0 1l-.8.7c-.8.8-2 .9-3 .4a11 11 0 0 1-5.2-5.2c-.5-1-.4-2.2.4-3Z" />
  `),
  email: createIcon(`
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  `),
  location: createIcon(`
    <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" />
    <circle cx="12" cy="10" r="2.4" />
  `),
  arrowLeft: createIcon(`<path d="m15 18-6-6 6-6" />`),
  arrowRight: createIcon(`<path d="m9 18 6-6-6-6" />`)
};

function createArchitecturalVisual({ palette, accent, lineColor, variant, label, subtitle }) {
  const [bgStart, bgEnd, panelTone, highlightTone] = palette;

  const shapes = {
    hero: `
      <rect x="0" y="0" width="1200" height="900" fill="url(#gridGlow)" opacity="0.18" />
      <path d="M90 720 300 140h110L290 720Z" fill="url(#panel)" opacity="0.92" />
      <rect x="388" y="120" width="120" height="600" fill="url(#panel)" opacity="0.86" />
      <rect x="530" y="80" width="134" height="640" fill="url(#panel)" opacity="0.76" />
      <rect x="690" y="160" width="126" height="560" fill="url(#panel)" opacity="0.82" />
      <rect x="844" y="220" width="200" height="500" fill="url(#panel)" opacity="0.72" />
      <path d="M180 250h760" stroke="${lineColor}" stroke-opacity="0.14" />
      <path d="M240 370h690" stroke="${lineColor}" stroke-opacity="0.1" />
      <path d="M110 720h990" stroke="${lineColor}" stroke-opacity="0.22" />
    `,
    partitions: `
      <rect x="120" y="110" width="160" height="560" rx="8" fill="url(#panel)" opacity="0.9" />
      <rect x="312" y="110" width="160" height="560" rx="8" fill="url(#panel)" opacity="0.72" />
      <rect x="504" y="110" width="160" height="560" rx="8" fill="url(#panel)" opacity="0.82" />
      <rect x="696" y="110" width="160" height="560" rx="8" fill="url(#panel)" opacity="0.74" />
      <rect x="888" y="110" width="160" height="560" rx="8" fill="url(#panel)" opacity="0.86" />
      <path d="M120 300h928" stroke="${lineColor}" stroke-opacity="0.15" />
      <path d="M120 670h928" stroke="${lineColor}" stroke-opacity="0.24" />
    `,
    shower: `
      <rect x="140" y="140" width="310" height="520" rx="16" fill="url(#panel)" opacity="0.88" />
      <rect x="440" y="200" width="310" height="460" rx="16" fill="url(#panel)" opacity="0.66" />
      <path d="M770 180v500" stroke="${accent}" stroke-width="10" stroke-linecap="round" stroke-opacity="0.7" />
      <path d="M140 660h760" stroke="${lineColor}" stroke-opacity="0.22" />
      <path d="M230 215h130" stroke="${lineColor}" stroke-opacity="0.18" />
      <path d="M230 258h130" stroke="${lineColor}" stroke-opacity="0.14" />
      <circle cx="808" cy="248" r="38" fill="${accent}" fill-opacity="0.18" />
    `,
    facade: `
      <path d="M150 720V190l160-72v602Z" fill="url(#panel)" opacity="0.86" />
      <path d="M360 720V90l190 64v566Z" fill="url(#panel)" opacity="0.76" />
      <path d="M590 720V170l190-54v604Z" fill="url(#panel)" opacity="0.88" />
      <path d="M826 720V244l170 52v424Z" fill="url(#panel)" opacity="0.74" />
      <path d="M220 250h680" stroke="${lineColor}" stroke-opacity="0.16" />
      <path d="M220 410h680" stroke="${lineColor}" stroke-opacity="0.11" />
      <path d="M150 720h870" stroke="${lineColor}" stroke-opacity="0.24" />
    `,
    insulated: `
      <rect x="160" y="150" width="320" height="470" rx="16" fill="url(#panel)" opacity="0.85" />
      <rect x="200" y="190" width="320" height="470" rx="16" fill="url(#panel)" opacity="0.52" />
      <rect x="650" y="190" width="300" height="430" rx="16" fill="url(#panel)" opacity="0.75" />
      <rect x="688" y="228" width="300" height="430" rx="16" fill="url(#panel)" opacity="0.46" />
      <path d="M160 620h828" stroke="${lineColor}" stroke-opacity="0.24" />
    `,
    production: `
      <path d="M80 700 240 220h90L210 700Z" fill="url(#panel)" opacity="0.9" />
      <rect x="320" y="170" width="124" height="530" fill="url(#panel)" opacity="0.82" />
      <rect x="470" y="130" width="124" height="570" fill="url(#panel)" opacity="0.74" />
      <rect x="620" y="200" width="124" height="500" fill="url(#panel)" opacity="0.88" />
      <rect x="780" y="170" width="280" height="530" rx="18" fill="url(#panel)" opacity="0.62" />
      <path d="M160 262h848" stroke="${lineColor}" stroke-opacity="0.14" />
      <path d="M160 700h900" stroke="${lineColor}" stroke-opacity="0.24" />
    `,
    handrail: `
      <path d="M120 660h280l220-220h360" stroke="${lineColor}" stroke-width="12" stroke-linecap="round" stroke-opacity="0.22" fill="none" />
      <path d="M230 660V420" stroke="${accent}" stroke-width="8" stroke-opacity="0.62" />
      <path d="M360 660V360" stroke="${accent}" stroke-width="8" stroke-opacity="0.62" />
      <path d="M492 530V240" stroke="${accent}" stroke-width="8" stroke-opacity="0.62" />
      <path d="M624 398V140" stroke="${accent}" stroke-width="8" stroke-opacity="0.62" />
      <path d="M756 398V140" stroke="${accent}" stroke-width="8" stroke-opacity="0.62" />
      <rect x="120" y="300" width="560" height="320" rx="18" fill="url(#panel)" opacity="0.58" />
      <path d="M120 620h920" stroke="${lineColor}" stroke-opacity="0.24" />
    `
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgStart}" />
          <stop offset="100%" stop-color="${bgEnd}" />
        </linearGradient>
        <linearGradient id="panel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${panelTone}" stop-opacity="0.92" />
          <stop offset="100%" stop-color="${highlightTone}" stop-opacity="0.36" />
        </linearGradient>
        <radialGradient id="gridGlow" cx="20%" cy="18%" r="80%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.36" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)" />
      <g opacity="0.18">
        <path d="M0 180h1200" stroke="${lineColor}" />
        <path d="M0 340h1200" stroke="${lineColor}" />
        <path d="M0 500h1200" stroke="${lineColor}" />
        <path d="M0 660h1200" stroke="${lineColor}" />
        <path d="M180 0v900" stroke="${lineColor}" />
        <path d="M380 0v900" stroke="${lineColor}" />
        <path d="M580 0v900" stroke="${lineColor}" />
        <path d="M780 0v900" stroke="${lineColor}" />
        <path d="M980 0v900" stroke="${lineColor}" />
      </g>
      ${shapes[variant] || shapes.hero}
      <text x="120" y="806" fill="#edf5fb" fill-opacity="0.9" font-size="42" font-family="Georgia, serif">${label}</text>
      <text x="120" y="850" fill="#cfe1ef" fill-opacity="0.76" font-size="24" font-family="Segoe UI, sans-serif" letter-spacing="0">${subtitle}</text>
    </svg>
  `;

  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}

const whatsappMessage = encodeURIComponent(
  "Здравствуйте! Меня интересуют стеклянные конструкции. Подскажите, пожалуйста, по стоимости, срокам изготовления и доступным вариантам."
);

const siteContent = {
  brand: {
    name: "Prime Glass",
    tagline: "Завод закаленного стекла"
  },
  navigation: [
    { label: "О НАС", href: "#about" },
    { label: "Контакты", href: "#contacts" }
  ],
  hero: {
    eyebrow: "",
    title: "PRIME GLASS",
    subtitle: "",
    description: "",
    primaryAction: {
      label: "Перезвонить",
      href: "#contacts"
    },
    secondaryAction: {
      label: "Смотреть услуги",
      href: "#products"
    },
    metrics: [
      { value: "206+", label: "Клиентов выбрали Prime Glass" },
      { value: "1500 м²", label: "Производственная мощность в сутки" },
      { value: "35", label: "Квалифицированных специалистов" }
    ],
    background: "url('background.png')"
  },
  heroSlides: [
    {
      series: "01",
      category: "Закалка",
      title: "Закаленное стекло",
      description:
        "Прочная и безопасная основа для перегородок, фасадов, душевых и ограждений.",
      footerTitle: "Производство",
      footerText: "Контроль геометрии и качества обработки",
      visual: "url('photos/image1.jpg')"
    },
    {
      series: "02",
      category: "Интерьер",
      title: "Душевые кабины",
      description:
        "Душевые кабины, двери-купе и перегородки из закаленного стекла.",
      footerTitle: "Для дома и отелей",
      footerText: "Чистый внешний вид и надежная фурнитура",
      visual: "url('photos/image9.jpg')"
    },
    {
      series: "03",
      category: "Архитектура",
      title: "Фасады и витрины",
      description:
        "Остекление для объектов, где важны свет, статус и точность монтажа.",
      footerTitle: "Коммерческие объекты",
      footerText: "Входные группы, витрины и фасады",
      visual: "url('photos/image2.jpg')"
    },
    {
      series: "04",
      category: "Перегородки",
      title: "Офисные решения",
      description:
        "Стеклянные перегородки для переговорных, кабинетов и open space.",
      footerTitle: "Рабочие пространства",
      footerText: "Зонирование без потери света",
      visual: "url('photos/image10.jpg')"
    }
  ],
  shortBenefits: [
    {
      icon: "factory",
      title: "Закалка стекла",
      text: "Идеальная обработка стекла для любого проекта."
    },
    {
      icon: "quality",
      title: "Еврокромка",
      text: "Точная обработка торца в трех плоскостях."
    },
    {
      icon: "wallet",
      title: "Цена от завода",
      text: "Без лишних посредников и скрытых наценок."
    },
    {
      icon: "delivery",
      title: "В срок",
      text: "Понятный график изготовления и доставки."
    }
  ],
  about: {
    eyebrow: "О нашей компании",
    title: "Prime Glass Technologies",
    description:
      "Prime Glass Technologies — производственная компания, которая создает стеклянные решения для фасадов, интерьеров и коммерческих объектов. Мы работаем с закаленным стеклом, стеклопакетами, перегородками, ограждениями и душевыми конструкциями, соединяя точную обработку, прочность и чистый внешний вид.",
    points: [
      {
        icon: "factory",
        title: "Собственное производство",
        text: "Быстрее считаем, производим и контролируем результат."
      },
      {
        icon: "quality",
        title: "Точная обработка",
        text: "Закалка, кромка, отверстия и подготовка под фурнитуру."
      },
      {
        icon: "solutions",
        title: "Решение под объект",
        text: "Подбираем конструкцию под задачу, интерьер и сроки."
      }
    ],
    media: {
      title: "Производственный цех",
      caption: "Оборудование и команда под стабильный результат.",
      src: "photos/image1.jpg",
      alt: "Prime Glass production floor with insulating glass units and machinery"
    }
  },
  approach: {
    eyebrow: "Подход",
    title: "Быстро, понятно и без лишней бюрократии",
    description: "",
    cards: [
      {
        icon: "experience",
        title: "Замер и расчет",
        text: "Быстро уточняем задачу и готовим понятное предложение."
      },
      {
        icon: "quality",
        title: "Производство",
        text: "Изготавливаем стекло и конструкции на собственных мощностях."
      },
      {
        icon: "delivery",
        title: "Доставка и монтаж",
        text: "Согласуем сроки и доводим изделие до готового результата."
      }
    ]
  },
  productsSection: {
    eyebrow: "Услуги",
    title: "Что мы производим",
    description: ""
  },
  products: [
    {
      icon: "factory",
      label: "Производство",
      title: "Закалка стекла",
      description: "Идеальная обработка стекла для любого проекта.",
      tags: ["Закалка", "Безопасность", "Точный размер"],
      photos: [
        {
          src: "photos/image1.jpg",
          alt: "Производственная линия с готовыми стеклопакетами",
          note: "Производство"
        },
        {
          src: "photos/image8.jpg",
          alt: "Листы прозрачного стекла для изготовления интерьерных конструкций",
          note: "Подготовка"
        }
      ]
    },
    {
      icon: "quality",
      label: "Обработка",
      title: "Еврокромка",
      description: "Точная обработка торца в трех плоскостях.",
      tags: ["Три плоскости", "Чистый торец", "Готово к монтажу"],
      photos: [
        {
          src: "photos/image3.jpg",
          alt: "Стеклянные листы с чистой кромкой на производстве",
          note: "Кромка"
        },
        {
          src: "photos/image6.jpg",
          alt: "Современный стекольный цех с крупноформатными листами стекла",
          note: "Цех"
        }
      ]
    },
    {
      icon: "facade",
      label: "Экстерьер",
      title: "Стеклянные козырьки",
      description: "Прочные и стильные конструкции любой сложности.",
      tags: ["Триплекс", "Точечный крепеж", "Входные группы"],
      photos: [
        {
          src: "photos/image7.jpg",
          alt: "Стеклянный козырек и внешняя стеклянная конструкция с точечным креплением",
          note: "Козырек"
        },
        {
          src: "photos/image4.jpg",
          alt: "Стеклянный фасад здания на фоне неба",
          note: "Объект"
        }
      ]
    },
    {
      icon: "railing",
      label: "Безопасность",
      title: "Перила и ограждения",
      description: "Безопасность и эстетика для лестниц, балконов и террас.",
      tags: ["Триплекс", "Надежная фиксация", "Чистая геометрия"],
      photos: [
        {
          src: "photos/image5.jpg",
          alt: "Светлое коммерческое пространство с масштабным стеклянным перекрытием",
          note: "Ограждения"
        },
        {
          src: "photos/image7.jpg",
          alt: "Стеклянный козырек и внешняя стеклянная конструкция с точечным креплением",
          note: "Крепеж"
        }
      ]
    },
    {
      icon: "catalog",
      label: "Окна",
      title: "Стеклопакеты",
      description: "Надежные решения для застройщиков и подрядчиков.",
      tags: ["Сборка", "Теплоизоляция", "Для подрядчиков"],
      photos: [
        {
          src: "photos/image1.jpg",
          alt: "Стеклопакеты и стеклянные элементы на производственной линии",
          note: "Стеклопакеты"
        },
        {
          src: "photos/image8.jpg",
          alt: "Листы прозрачного стекла для изготовления интерьерных конструкций",
          note: "Стекло"
        }
      ]
    },
    {
      icon: "office",
      label: "Интерьер",
      title: "Стеклянные перегородки",
      description: "Элегантные решения для офиса и дома.",
      tags: ["Зонирование", "Свет", "B2B / B2C"],
      photos: [
        {
          src: "photos/image10.jpg",
          alt: "Офисные стеклянные перегородки с черным профилем",
          note: "Офис"
        },
        {
          src: "photos/image5.jpg",
          alt: "Светлое коммерческое пространство с масштабным стеклянным перекрытием",
          note: "Пространство"
        }
      ]
    },
    {
      icon: "shower",
      label: "Санузлы",
      title: "Душевые кабины и перегородки",
      description: "Душевые кабины, двери-купе и перегородки.",
      tags: ["Ванные", "Отели", "Фурнитура"],
      photos: [
        {
          src: "photos/image9.jpg",
          alt: "Стеклянная душевая перегородка в современном интерьере",
          note: "Душевая"
        },
        {
          src: "photos/image10.jpg",
          alt: "Офисные стеклянные перегородки с черным профилем",
          note: "Перегородки"
        }
      ]
    }
  ],
  application: {
    eyebrow: "Остались вопросы?",
    title: "Можете оставить свой номер! Мы вам перезвоним:",
    description: "Цены напрямую с завода. Быстро. Четко. В срок.",
    logoSrc: "logo-candidate.png",
    logoAlt: "Логотип Prime Glass",
    points: [
      "Цены напрямую с завода",
      "Быстро. Четко. В срок."
    ],
    buttonLabel: "Перезвонить",
    buttonHref: "#contacts",
    visual: "url('photos/image6.jpg')"
  },
  extendedBenefitsSection: {
    eyebrow: "Преимущества",
    title: "Почему Prime Glass выбирают для ответственных объектов",
    description: ""
  },
  extendedBenefits: [
    { icon: "factory", title: "Крупная производственная компания", text: "Собственные мощности." },
    { icon: "quality", title: "Высокое качество стекла", text: "Точность и безопасность." },
    { icon: "delivery", title: "Быстрые сроки изготовления", text: "Четкий производственный график." },
    { icon: "shield", title: "Гарантия до 4 лет", text: "Уверенность в результате." },
    { icon: "certificate", title: "Сертификаты качества", text: "Подтвержденные стандарты." },
    { icon: "catalog", title: "Широкий ассортимент", text: "Несколько продуктовых направлений." },
    { icon: "team", title: "Квалифицированные специалисты", text: "Опытная команда." },
    { icon: "map", title: "Работа по всему Казахстану", text: "Поставка по регионам." }
  ],
  contacts: {
    eyebrow: "",
    title: "Местоположение и контакты",
    description: "",
    phone: "+7 (777) 091-08-88",
    phoneLink: "tel:+77770910888",
    whatsappNumber: "77770910888",
    whatsapp: "+7 (777) 091-08-88",
    whatsappLink: `https://wa.me/77770910888?text=${whatsappMessage}`,
    email: "info@primeglass.kz",
    emailLink: "mailto:info@primeglass.kz",
    address: "Актау, промышленная зона, производственный блок Prime Glass",
    schedule: "Пн-Пт: 09:00-18:00",
    details: [
      { icon: "phone", title: "Телефон", value: "+7 (777) 091-08-88", href: "tel:+77770910888" },
      { icon: "whatsapp", title: "WhatsApp", value: "+7 (777) 091-08-88", href: `https://wa.me/77770910888?text=${whatsappMessage}` },
      { icon: "location", title: "Адрес", value: "Актау, промышленная зона" }
    ],
    form: {
      title: "Перезвонить",
      description: "Оставьте контакты, и мы вас проконсультируем.",
      fields: { name: "Имя", phone: "Телефон" },
      submitLabel: "Отправить"
    }
  },
  footer: {
    copy: "Prime Glass. Все права защищены.",
    note: ""
  }
};

/* ==========================================================================
   Template helpers
   ========================================================================== */

const dom = {};
const uiState = {
  activeSlide: 0,
  sliderTimer: null
};

function iconMarkup(name) {
  return iconMap[name] || iconMap.solutions;
}

function renderSectionHeading({ eyebrow, title, description, tag = "h2", compact = false }) {
  return `
    <div class="section-heading ${compact ? "section-heading--compact" : ""} reveal">
      ${eyebrow ? `<span class="section-heading__eyebrow">${eyebrow}</span>` : ""}
      <${tag}>${title}</${tag}>
      ${description ? `<p>${description}</p>` : ""}
    </div>
  `;
}

function linkMarkup(item) {
  if (item.href) {
    const rel = item.href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : "";
    return `<a href="${item.href}"${rel}>${item.value}</a>`;
  }

  return `<span>${item.value}</span>`;
}

function cacheDom() {
  dom.header = document.querySelector(".site-header");
  dom.menuToggle = document.querySelector(".menu-toggle");
  dom.navigation = document.querySelector(".site-navigation");
  dom.navLinks = document.getElementById("navLinks");
  dom.heroSection = document.getElementById("hero");
  dom.heroContent = document.getElementById("heroContent");
  dom.heroSlider = document.getElementById("heroSlider");
  dom.shortBenefits = document.getElementById("shortBenefits");
  dom.aboutSection = document.getElementById("aboutSection");
  dom.approachSection = document.getElementById("approachSection");
  dom.productsSection = document.getElementById("productsSection");
  dom.applicationSection = document.getElementById("applicationSection");
  dom.extendedBenefitsSection = document.getElementById("extendedBenefitsSection");
  dom.contactsSection = document.getElementById("contactsSection");
  dom.footerContent = document.getElementById("footerContent");
  dom.whatsAppFloat = document.getElementById("whatsAppFloat");
}

/* ==========================================================================
   Render functions
   ========================================================================== */

function renderNavigation() {
  dom.navLinks.innerHTML = siteContent.navigation.map((item) => `<a href="${item.href}">${item.label}</a>`).join("");

  const headerCta = document.querySelector(".site-navigation__cta");
  headerCta.textContent = "WhatsApp";
  headerCta.setAttribute("href", siteContent.contacts.whatsappLink);
  headerCta.setAttribute("target", "_blank");
  headerCta.setAttribute("rel", "noreferrer");
}

function renderHeroSlider() {
  dom.heroSlider.innerHTML = `
    <div class="hero-slider reveal">
      <div class="hero-slider__shell">
        <div class="hero-slider__label">
          <span>Продуктовые направления</span>
          <span>${siteContent.heroSlides.length} направления</span>
        </div>
        <div class="hero-slider__viewport" id="heroSliderViewport">
          ${siteContent.heroSlides.map((slide, index) => `
            <article class="hero-slide ${index === 0 ? "is-active" : ""}" data-slide aria-hidden="${index === 0 ? "false" : "true"}">
              <div class="hero-slide__visual" style="--slide-image:${slide.visual};"></div>
              <div class="hero-slide__body">
                <div class="hero-slide__meta">
                  <span>${slide.series}</span>
                  <span>${slide.category}</span>
                </div>
                <h3>${slide.title}</h3>
                <p>${slide.description}</p>
                <div class="hero-slide__footer">
                  <div>
                    <strong>${slide.footerTitle}</strong>
                    <span>${slide.footerText}</span>
                  </div>
                </div>
              </div>
            </article>
          `).join("")}
        </div>
        <div class="hero-slider__controls">
          <div class="hero-slider__arrows">
            <button class="hero-slider__arrow" type="button" data-slider-prev aria-label="Предыдущий слайд">${iconMarkup("arrowLeft")}</button>
            <button class="hero-slider__arrow" type="button" data-slider-next aria-label="Следующий слайд">${iconMarkup("arrowRight")}</button>
          </div>
          <div class="hero-slider__pagination">
            ${siteContent.heroSlides.map((_, index) => `
              <button
                class="hero-slider__bullet ${index === 0 ? "is-active" : ""}"
                type="button"
                data-slider-bullet
                data-slide-index="${index}"
                aria-label="Перейти к слайду ${index + 1}"
                aria-pressed="${index === 0 ? "true" : "false"}"
              ></button>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderHeroSection() {
  dom.heroSection.style.setProperty("--hero-backdrop", siteContent.hero.background);
  dom.heroContent.innerHTML = "";
}

function renderShortBenefits() {
  dom.shortBenefits.innerHTML = `
    <div class="benefits-grid">
      ${siteContent.shortBenefits.map((benefit) => `
        <article class="benefit-card card reveal">
          <div class="benefit-card__top">
            <span class="icon-badge">${iconMarkup(benefit.icon)}</span>
            <div>
              <h3>${benefit.title}</h3>
              <p>${benefit.text}</p>
            </div>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderAboutSection() {
  dom.aboutSection.innerHTML = `
    <div class="about-simple">
      ${renderSectionHeading(siteContent.about)}
    </div>
  `;
}

function renderApproachCards() {
  dom.approachSection.innerHTML = `
    ${renderSectionHeading(siteContent.approach)}
    <div class="approach-grid">
      ${siteContent.approach.cards.map((card) => `
        <article class="approach-card card reveal">
          <span class="icon-badge">${iconMarkup(card.icon)}</span>
          <h3>${card.title}</h3>
          <p>${card.text}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderProducts() {
  dom.productsSection.innerHTML = `
    ${renderSectionHeading(siteContent.productsSection)}
    <div class="products-carousel reveal">
      <div class="products-carousel__controls" aria-label="Навигация по продукции">
        <button class="products-carousel__arrow" type="button" data-products-prev aria-label="Предыдущая услуга">${iconMarkup("arrowLeft")}</button>
        <button class="products-carousel__arrow" type="button" data-products-next aria-label="Следующая услуга">${iconMarkup("arrowRight")}</button>
      </div>
      <div class="products-carousel__viewport" data-products-viewport>
        <div class="products-grid">
          ${siteContent.products.map((product, index) => `
            <article class="product-card card reveal">
              <figure class="product-card__media product-card__media--primary" data-product-photo>
                <img src="${product.photos[0].src}" alt="${product.photos[0].alt}" loading="lazy">
              </figure>
              <div class="product-card__content">
                <div class="product-card__top">
                  <span class="icon-badge">${iconMarkup(product.icon)}</span>
                  <span class="product-card__index">0${index + 1}</span>
                </div>
                <h3>${product.title}</h3>
                <p>${product.description}</p>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function initProductsCarousel() {
  const viewport = document.querySelector("[data-products-viewport]");
  const prevButton = document.querySelector("[data-products-prev]");
  const nextButton = document.querySelector("[data-products-next]");

  if (!viewport || !prevButton || !nextButton) {
    return;
  }

  const getStep = () => {
    const card = viewport.querySelector(".product-card");
    const track = viewport.querySelector(".products-grid");

    if (!card || !track) {
      return viewport.clientWidth;
    }

    const gapValue = Number.parseFloat(window.getComputedStyle(track).columnGap || "0");
    const gap = Number.isFinite(gapValue) ? gapValue : 0;
    return card.getBoundingClientRect().width + gap;
  };

  const moveProducts = (direction) => {
    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const atStart = viewport.scrollLeft <= 2;
    const atEnd = viewport.scrollLeft >= maxScroll - 2;

    if (direction > 0 && atEnd) {
      viewport.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction < 0 && atStart) {
      viewport.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    viewport.scrollBy({ left: getStep() * direction, behavior: "smooth" });
  };

  prevButton.addEventListener("click", () => moveProducts(-1));
  nextButton.addEventListener("click", () => moveProducts(1));
}

function renderApplicationSection() {
  dom.applicationSection.innerHTML = `
    <div class="application-shell reveal" style="--application-backdrop:${siteContent.application.visual};">
      <div class="application-layout">
        <div class="application-copy">
          ${renderSectionHeading({
            eyebrow: siteContent.application.eyebrow,
            title: siteContent.application.title,
            description: siteContent.application.description
          })}
          <form class="callback-form" id="contactForm" novalidate>
            <div class="form-field" data-form-field>
              <label for="contactName">${siteContent.contacts.form.fields.name}</label>
              <input id="contactName" name="name" type="text" autocomplete="name" placeholder="Имя" required>
              <span class="form-field__error" data-field-error="name"></span>
            </div>
            <div class="form-field" data-form-field>
              <label for="contactPhone">${siteContent.contacts.form.fields.phone}</label>
              <input id="contactPhone" name="phone" type="tel" autocomplete="tel" placeholder="+7 (700) 000-00-00" required>
              <span class="form-field__error" data-field-error="phone"></span>
            </div>
            <button class="button button--primary" type="submit">${siteContent.contacts.form.submitLabel}</button>
            <div class="form-status" id="formStatus" aria-live="polite"></div>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderExtendedBenefits() {
  dom.extendedBenefitsSection.innerHTML = `
    ${renderSectionHeading(siteContent.extendedBenefitsSection)}
    <div class="extended-benefits-grid">
      ${siteContent.extendedBenefits.map((benefit) => `
        <article class="extended-benefit card reveal">
          <span class="icon-badge">${iconMarkup(benefit.icon)}</span>
          <div class="extended-benefit__body">
            <strong>${benefit.title}</strong>
            <span>${benefit.text}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderContacts() {
  dom.contactsSection.innerHTML = `
    ${renderSectionHeading(siteContent.contacts)}
    <div class="contacts-layout contacts-layout--simple">
      <div class="contacts-panel reveal">
        <div class="contacts-list">
          ${siteContent.contacts.details.map((detail) => `
            <article class="contact-item">
              <span class="icon-badge">${iconMarkup(detail.icon)}</span>
              <div class="contact-item__body">
                <strong>${detail.title}</strong>
                ${linkMarkup(detail)}
              </div>
            </article>
          `).join("")}
        </div>
        <div class="contacts-panel__actions">
          <a class="button button--primary" href="${siteContent.contacts.phoneLink}">Позвонить</a>
          <a class="button button--ghost" href="${siteContent.contacts.whatsappLink}" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  dom.footerContent.innerHTML = `
    <div class="site-footer__layout">
      <div class="site-footer__copy">
        <strong>${siteContent.brand.name}</strong><br>
        <span>${siteContent.footer.copy.replace("Prime Glass.", "").trim()}</span><br>
        ${siteContent.footer.note ? `<span>${siteContent.footer.note}</span><br>` : ""}
        <span>&copy; <span data-current-year></span> Prime Glass.</span>
      </div>
      <nav class="site-footer__nav" aria-label="Дополнительная навигация">
        ${siteContent.navigation.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
      </nav>
    </div>
  `;
}

function renderSite() {
  renderNavigation();
  renderHeroSection();
  renderAboutSection();
  renderProducts();
  renderApplicationSection();
  renderContacts();
  renderFooter();

  dom.whatsAppFloat.setAttribute("href", siteContent.contacts.whatsappLink);
  dom.whatsAppFloat.setAttribute("target", "_blank");
  dom.whatsAppFloat.setAttribute("rel", "noreferrer");
}

/* ==========================================================================
   Event handlers and UI initialization
   ========================================================================== */

function showSlide(index) {
  const slides = [...document.querySelectorAll("[data-slide]")];
  const bullets = [...document.querySelectorAll("[data-slider-bullet]")];

  if (!slides.length) {
    return;
  }

  uiState.activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    const isActive = slideIndex === uiState.activeSlide;
    slide.classList.toggle("is-active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  bullets.forEach((bullet, bulletIndex) => {
    const isActive = bulletIndex === uiState.activeSlide;
    bullet.classList.toggle("is-active", isActive);
    bullet.setAttribute("aria-pressed", String(isActive));
  });
}

function stopHeroSlider() {
  window.clearInterval(uiState.sliderTimer);
  uiState.sliderTimer = null;
}

function startHeroSlider() {
  stopHeroSlider();
  uiState.sliderTimer = window.setInterval(() => {
    showSlide(uiState.activeSlide + 1);
  }, 5200);
}

function initHeroSlider() {
  const viewport = document.getElementById("heroSliderViewport");
  const prevButton = document.querySelector("[data-slider-prev]");
  const nextButton = document.querySelector("[data-slider-next]");
  const bullets = [...document.querySelectorAll("[data-slider-bullet]")];

  if (!viewport || !prevButton || !nextButton) {
    return;
  }

  prevButton.addEventListener("click", () => {
    showSlide(uiState.activeSlide - 1);
    startHeroSlider();
  });

  nextButton.addEventListener("click", () => {
    showSlide(uiState.activeSlide + 1);
    startHeroSlider();
  });

  bullets.forEach((bullet) => {
    bullet.addEventListener("click", () => {
      showSlide(Number(bullet.dataset.slideIndex));
      startHeroSlider();
    });
  });

  viewport.addEventListener("mouseenter", stopHeroSlider);
  viewport.addEventListener("mouseleave", startHeroSlider);

  showSlide(0);
  startHeroSlider();
}

function closeMenu() {
  dom.navigation.classList.remove("is-open");
  dom.menuToggle.classList.remove("is-open");
  dom.menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function initMobileMenu() {
  dom.menuToggle.addEventListener("click", () => {
    const isOpen = dom.navigation.classList.toggle("is-open");
    dom.menuToggle.classList.toggle("is-open", isOpen);
    dom.menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;

      if (!target) {
        return;
      }

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (!digits) {
    return "";
  }

  let normalized = digits;

  if (normalized[0] === "8") {
    normalized = `7${normalized.slice(1)}`;
  }

  if (normalized[0] !== "7") {
    normalized = `7${normalized.slice(0, 10)}`;
  }

  const country = normalized[0];
  const part1 = normalized.slice(1, 4);
  const part2 = normalized.slice(4, 7);
  const part3 = normalized.slice(7, 9);
  const part4 = normalized.slice(9, 11);

  let result = `+${country}`;

  if (part1) {
    result += ` (${part1}`;
  }

  if (part1.length === 3) {
    result += ")";
  }

  if (part2) {
    result += ` ${part2}`;
  }

  if (part3) {
    result += `-${part3}`;
  }

  if (part4) {
    result += `-${part4}`;
  }

  return result;
}

function validateField(field) {
  const formField = field.closest("[data-form-field]");
  const errorNode = document.querySelector(`[data-field-error="${field.name}"]`);
  let message = "";

  if (field.name === "name" && field.value.trim().length < 2) {
    message = "Введите имя не короче 2 символов.";
  }

  if (field.name === "phone") {
    const digits = field.value.replace(/\D/g, "");
    if (digits.length !== 11) {
      message = "Введите телефон в формате +7 (700) 000-00-00.";
    }
  }

  formField.classList.toggle("is-invalid", Boolean(message));
  errorNode.textContent = message;

  return !message;
}

function buildWhatsAppLink(message) {
  return `https://wa.me/${siteContent.contacts.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function initFormValidation() {
  const form = document.getElementById("contactForm");
  const phoneInput = document.getElementById("contactPhone");
  const nameInput = document.getElementById("contactName");
  const statusNode = document.getElementById("formStatus");

  if (!form || !phoneInput || !nameInput || !statusNode) {
    return;
  }

  phoneInput.addEventListener("input", () => {
    phoneInput.value = formatPhone(phoneInput.value);
    validateField(phoneInput);
  });

  nameInput.addEventListener("input", () => {
    validateField(nameInput);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const isNameValid = validateField(nameInput);
    const isPhoneValid = validateField(phoneInput);

    if (!isNameValid || !isPhoneValid) {
      statusNode.classList.remove("is-success");
      statusNode.textContent = "Проверьте поля формы и повторите отправку.";
      return;
    }

    statusNode.classList.remove("is-success");
    statusNode.textContent = "";

    const whatsappRequestMessage = [
      "Здравствуйте! Хочу оставить заявку.",
      `Имя: ${nameInput.value.trim()}.`,
      `Телефон: ${phoneInput.value.trim()}.`,
      "Подскажите, пожалуйста, по стоимости и срокам."
    ].join("\n");

    form.reset();
    window.open(buildWhatsAppLink(whatsappRequestMessage), "_blank", "noopener,noreferrer");
  });
}

function initRevealAnimations() {
  const revealElements = [...document.querySelectorAll(".reveal")];

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initGsapAnimations() {
  if (!window.gsap || !window.ScrollTrigger) {
    return;
  }

  window.gsap.registerPlugin(window.ScrollTrigger);

  window.gsap.utils.toArray(".product-card").forEach((card, index) => {
    const photos = card.querySelectorAll("[data-product-photo]");

    window.gsap.set(card, { transformPerspective: 1000 });

    window.gsap.fromTo(
      card,
      { y: 36, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: "power3.out",
        delay: index * 0.04,
        scrollTrigger: {
          trigger: card,
          start: "top 86%"
        }
      }
    );

    window.gsap.fromTo(
      photos,
      { y: 26, scale: 1.06, autoAlpha: 0 },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 84%"
        }
      }
    );
  });
}

function initHeaderState() {
  const updateHeader = () => {
    dom.header.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function initNavSpy() {
  const links = [...document.querySelectorAll('.site-navigation__links a, .site-footer__nav a')];
  const sections = siteContent.navigation.map((item) => document.querySelector(item.href)).filter(Boolean);

  if (!("IntersectionObserver" in window) || !sections.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { threshold: 0.55 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initCurrentYear() {
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
}

function initSite() {
  cacheDom();
  renderSite();
  initHeroSlider();
  initProductsCarousel();
  initMobileMenu();
  initSmoothScroll();
  initFormValidation();
  initRevealAnimations();
  initGsapAnimations();
  initHeaderState();
  initNavSpy();
  initCurrentYear();
}

document.addEventListener("DOMContentLoaded", initSite);
