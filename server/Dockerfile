FROM node:16

WORKDIR /usr/src/cars-management/server

COPY package*.json ./

RUN yarn

COPY . .

EXPOSE 5000
