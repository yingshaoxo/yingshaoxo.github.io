`sudo apt install polipo`

`sudo vim /etc/polipo/config`

add following and save it:

```
proxyAddress = "0.0.0.0"
proxyPort = 1088

socksParentProxy = "localhost:1080"
socksProxyType = socks5
```

`sudo service polipo restart`

Now you got a http_proxy at `localhost:1088`
