FROM node:16 as build-stage

WORKDIR /usr/src/cars-management/app

COPY package.json .

RUN yarn

COPY . .

EXPOSE $REACT_LOCAL_PORT

#stage 2
# FROM nginx:1.17.0-alpine

# COPY --from=build-stage /usr/src/cars-management/app/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# WORKDIR /usr/share/nginx/html

# RUN rm -rf ./*

# COPY --from=build-stage /usr/src/cars-management/app/build .

# ENTRYPOINT ["nginx", "-g", "daemon off;"]