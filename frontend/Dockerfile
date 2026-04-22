FROM node:25-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29.8-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html


EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
