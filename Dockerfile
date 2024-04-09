FROM node:20.9.0-alpine

# Çalışma dizinini belirle
WORKDIR /app

# Uygulama bağımlılıklarını kopyala ve yükle
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Uygulama kodunu kopyala
COPY . .

# Uygulamayı build et
RUN npm run build

# PM2'yi yükle
RUN npm install -g pm2

# PM2 ile uygulamayı başlat
ENV TZ=Europe/Istanbul

RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone
    
CMD pm2-runtime start npm -- start -i 1