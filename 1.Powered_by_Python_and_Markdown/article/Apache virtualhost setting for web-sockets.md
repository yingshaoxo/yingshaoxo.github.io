##### Environment

1. A records in DNS manager

    | Type | Name | Value |

    | A | blog | your_server_ip |

    | A | math | your_server_ip |

2. Set up apache2 with this https://certbot.eff.org/

3. Add necessary module

```
a2enmod proxy proxy_http proxy_wstunnel proxy_balancer lbmethod_byrequests

systemctl restart apache2
```



##### HTML Codes

```
        var ws_link = 'ws://' + location.hostname + "/ws/";

        if (window.location.protocol === 'https:') {
            ws_link = 'wss://' + location.hostname + "/wss/";
        }

        var ws = new WebSocket(ws_link);
```


##### Apache Codes (at /etc/apache2/sites-available/000-default.conf)

```
<VirtualHost *:80>
        ServerName blog.yingshaoxo.xyz

        ProxyRequests Off
        ProxyPreserveHost On

        ProxyPass        "/" "http://127.0.0.1:2018/"
        ProxyPassReverse "/" "http://127.0.0.1:2018/"
</VirtualHost>

<VirtualHost *:80>
        ServerName math.yingshaoxo.xyz

        ProxyRequests Off
        ProxyPreserveHost On

        ProxyPass "/ws/" "ws://127.0.0.1:5277/"
        ProxyPassReverse "/ws/" "ws://127.0.0.1:5277/"

        ProxyPass "/wss/" "ws://127.0.0.1:5277/"
        ProxyPassReverse "/wss/" "ws://127.0.0.1:5277/"

        ProxyPass        "/" "http://127.0.0.1:5000/"
        ProxyPassReverse "/" "http://127.0.0.1:5000/"
</VirtualHost>
```


##### Finnaly

```
systemctl restart apache2
```
___

By the way, if you only need one page frome others, this will be fine

```
<VirtualHost *:80>
        ServerName net.yingshaoxo.xyz

        SSLProxyEngine on

        ProxyPass        "/" "https://www.baidu.com"
        ProxyPassReverse "/" "https://www.baidu.com"

        ErrorLog /etc/apache2/sites-available/error.log
</VirtualHost>
```
