#используем образ линукс Alpine с версией node 14
FROM node:19.5.0-alpine

#Указываем в какой папке будет приложение, рабочую директорию
WORKDIR /app

#Скопировать package json и json lock внутрь контейнера
COPY package*.json ./ 

#Устанавливаем зависимости
RUN npm install

#Копируем все остальное приложение в контейнер (откуда куда)
COPY . .

#Установить Prisma
RUN npm install -g prisma

#Генерируем Prisma client
RUN prisma generate 

#Копируем призму схему из клиента в контейнер (откуда куда)
COPY prisma/schema.prisma ./prisma/

#Контейнер будет изолирован, нужно открыть порт в контейнере
EXPOSE 3000

#внутри контейнера запускаем сервер
CMD ["npm","start"]
