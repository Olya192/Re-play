# nginx/Dockerfile
FROM nginx:alpine

# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx.conf /etc/nginx/nginx.conf

# Создаем папки для SSL и логов
RUN mkdir -p /etc/nginx/ssl /var/log/nginx

# Проверяем конфиг
RUN nginx -t

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
