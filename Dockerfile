FROM php:8.3-rc

COPY ./ /root/html/

WORKDIR /root/html/

EXPOSE 9190

CMD php -S 127.0.0.1:9190
