# build stage
FROM node:16.0.0-alpine as build

WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

# production stage
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]