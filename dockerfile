FROM node:lts-alpine AS build
WORKDIR /app
COPY package* .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine AS deploy
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
