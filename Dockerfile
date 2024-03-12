# 기본 이미지 설정 (Node.js)
FROM node:16

# 앱 디렉토리 생성 및 설정
WORKDIR /usr/src/app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# Prisma generate
RUN npm install --production=false && \
    npx prisma generate --schema=src/db/prisma/schema.prisma

# Vim 설치
RUN apt-get update && apt-get install -y vim

# 앱 빌드
RUN npm run build \
    rm -rf node_modules \
    npm install --production=true

# PM2 설치
RUN npm install -g pm2 
COPY ecosystem.config.js .

# 컨테이너 실행 시 실행될 명령어
CMD ["pm2-runtime", "start", "ecosystem.config.js"]