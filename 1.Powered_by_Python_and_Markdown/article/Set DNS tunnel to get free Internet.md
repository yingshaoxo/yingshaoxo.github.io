0. setup

    https://qiuri.org/806.html

    https://www.rawidn.com/posts/how-to-use-dns-tunnel.html

    when you ready, do this test (put sub.your_domain.com in): http://code.kryo.se/iodine/check-it


1. in server: 

    `iodined -f -p 5353 -P password your_local_server_ip(192.168.100.1) sub.your_domain.com`

    `iptables -t nat -A PREROUTING -i eth0 -p udp --dport 53 -j DNAT --to :5353`


2. in local: 

    `sudo iodine -f -P password your_server_ip sub.your_domain.com`


3. around the corner

    set ssr, enjoy it.
