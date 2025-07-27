#FROM php:8.3-rc
FROM yeszao/php:5.4.45-fpm-alpine

#COPY ./ /root/html/
RUN mkdir -p /root/html/

WORKDIR /root/html/

EXPOSE 9190

CMD php -S 127.0.0.1:9190
