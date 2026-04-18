# Prime Glass Technologies - Корпоративный сайт

Премиальный корпоративный сайт для Prime Glass Technologies на чистом HTML/CSS/JS.

## Особенности

- **Статическая страница**: HTML + CSS + JavaScript
- **Анимация загрузки**: Стильное появление контента на первом экране
- **Node.js Backend**: Express сервер с защитой (helmet, cors, rate-limit)
- **Контактная форма**: Обработка данных через `POST /api/contact`

## Структура проекта

```
├── src/
│   ├── index.js          # Точка входа React приложения
│   ├── styles.css        # Tailwind CSS стили
│   └── SplashScreen.jsx  # Компонент анимированного splash screen
├── dist/                 # Production сборка
├── server.js             # Node.js Express сервер
├── webpack.config.js     # Конфигурация webpack
├── tailwind.config.js    # Конфигурация Tailwind CSS
├── postcss.config.js     # Конфигурация PostCSS
└── package.json          # Зависимости и скрипты
```

## Запуск

### Backend (порт 3002)
```bash
npm start          # Production режим
npm run dev        # Development режим с nodemon
```

### Frontend (порт 3000)
```bash
npm run client     # Webpack dev server
npm run build      # Production сборка
```

## Анимации Splash Screen

- **Логотип**: 5 стеклянных панелей с эффектом "построения"
- **Время**: 3 секунды на построение + 1 секунда пауза
- **Переход**: Плавное исчезновение с масштабированием
- **Цвета**: Градиент от синего к фиолетовому
- **Easing**: cubic-bezier(0.25, 0.1, 0.25, 1) для премиального вида

## Технологии

- **Frontend**: React 18.2.0, Framer Motion 12.38.0, Tailwind CSS 3.3.3
- **Backend**: Node.js, Express 4.18.4
- **Build**: Webpack 5.106.1, Babel, PostCSS
- **Security**: Helmet, CORS, Rate Limiting

## Развертывание

1. Соберите frontend: `npm run build`
2. Запустите backend: `npm start`
3. Откройте http://localhost:3002

## API Endpoints

- `GET /` - Главная страница с React splash screen
- `POST /api/contact` - Обработка контактной формы
- `GET /api/health` - Проверка состояния сервера</content>
<parameter name="filePath">c:\Users\mufta\Desktop\Glass\README.md