# Используем официальный образ Puppeteer
FROM ghcr.io/puppeteer/puppeteer:latest

WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости от имени root
USER root
RUN npm install

# Устанавливаем необходимые зависимости для Puppeteer и Chrome
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libgbm-dev \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxtst6 \
    wget \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Установка Chrome вручную
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && dpkg -i google-chrome-stable_current_amd64.deb || apt-get -f install -y \
    && rm google-chrome-stable_current_amd64.deb

# Создаем папку uploads и настраиваем права
RUN mkdir -p /app/uploads && chmod -R 777 /app/uploads

# Копируем остальные файлы приложения
COPY . .

# Открываем порт 3002 для вашего приложения
EXPOSE 3002

# Запускаем приложение
CMD ["npm", "start"]
