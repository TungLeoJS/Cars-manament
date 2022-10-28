FROM node:16

WORKDIR /usr/src/cars-management/app

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 3000
