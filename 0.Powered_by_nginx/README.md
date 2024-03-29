# Use docker-compse with Nginx

___

Generate key

```
apt install certbot

certbot certonly --standalone -d yingshaoxo.xyz

```

Download your key for backup (1)

```
tar -zcvf keys.tar.gz /etc/letsencrypt/live/

python3 -m http.server 8000

```

Download your key for backup (2)

```
# Back to your local terminal

wget your_server_ip:8000/keys.tar.gz

```

___

```
#docker-compose.yml

version: '3'
services:
  nginx: 
    image: nginx:latest
    container_name: nginx
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt/:/etc/letsencrypt/
    ports:
      - 80:80
      - 443:443
```

___


```
#nginx.conf

worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;


#    server {
#        listen       80;
#        server_name yingshaoxo.xyz www.yingshaoxo.xyz;
#
#        location / {
#            proxy_pass https://yingshaoxo.github.io;
#            proxy_set_header host yingshaoxo.github.io;
#            proxy_set_header referer https://yingshaoxo.github.io;
#
#            proxy_set_header user-agent $http_user_agent;
#            proxy_set_header x-real-ip $remote_addr;
#            proxy_set_header accept-encoding "";
#            proxy_set_header accept-language $http_accept_language;
#            proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;
#
#            #sub_filter yingshaoxo.github.io example.com;
#            #sub_filter_once off;
#        }
#    }
#
#    server {
#        listen       80;
#        server_name  blog.yingshaoxo.xyz;
#
#        location / {
#            proxy_pass https://yingshaoxo.blogspot.com;
#            proxy_set_header host yingshaoxo.blogspot.com;
#            proxy_set_header referer https://yingshaoxo.blogspot.com;
#
#            proxy_set_header user-agent $http_user_agent;
#            proxy_set_header x-real-ip $remote_addr;
#            proxy_set_header accept-encoding "";
#            proxy_set_header accept-language $http_accept_language;
#            proxy_set_header x-forwarded-for $proxy_add_x_forwarded_for;
#
#            sub_filter example.com yingshaoxo.blogspot.com;
#            sub_filter_once off;
#        }
#    }

    server {
        listen 443 ssl;
        server_name yingshaoxo.xyz www.yingshaoxo.xyz;

        ssl_certificate      /etc/letsencrypt/live/yingshaoxo.xyz/fullchain.pem;
        ssl_certificate_key  /etc/letsencrypt/live/yingshaoxo.xyz/privkey.pem;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        location / {
            proxy_pass https://yingshaoxo.github.io;
            proxy_set_header Host yingshaoxo.github.io;
            proxy_set_header Referer https://yingshaoxo.github.io;

            proxy_set_header User-Agent $http_user_agent;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Accept-Encoding "";
            proxy_set_header Accept-Language $http_accept_language;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            #sub_filter google.com example.com;
            #sub_filter_once off;
        }
    }

    server {
        listen 443 ssl;
        server_name blog.yingshaoxo.xyz;

        ssl_certificate      /etc/letsencrypt/live/blog.yingshaoxo.xyz/fullchain.pem;
        ssl_certificate_key  /etc/letsencrypt/live/blog.yingshaoxo.xyz/privkey.pem;

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        location / {
            proxy_pass https://yingshaoxo.blogspot.com;
            proxy_set_header Host yingshaoxo.blogspot.com;
            proxy_set_header Referer https://yingshaoxo.blogspot.com;

            proxy_set_header User-Agent $http_user_agent;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header Accept-Encoding "";
            proxy_set_header Accept-Language $http_accept_language;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

            sub_filter example.com yingshaoxo.blogspot.com;
            sub_filter_once off;
        }
    }
}
```

___

https://dev.to/domysee/setting-up-a-reverse-proxy-with-nginx-and-docker-compose-29jg

https://gist.github.com/soheilhy/8b94347ff8336d971ad0#step-9-optional----redirecting-based-on-host-name

https://github.com/kevin-lxh/Reverse-Proxy-for-Google
