#### 0. Read This
```
FROM ubuntu:17.10

ENV LANG C.UTF-8

RUN apt-get update
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install -y python3.6-dev

COPY ./requirements.txt /usr/src/Local_Show/requirements.txt
RUN pip3 install --no-cache-dir -r /usr/src/Local_Show/requirements.txt

COPY . /usr/src/Local_Show/

RUN chmod +x /usr/src/Local_Show/tool.sh

RUN mkdir -p /usr/src/Local_Show/files

EXPOSE 2018

CMD ["bash", "/usr/src/Local_Show/tool.sh", "docker_run"]
```


#### 1. Basic Things
`FROM` indicates what image you are based on.

`ENV LANG C.UTF-8` sets what encoding your system will use, something will go wrong in Chinese without it

`RUN` represents every stage you are going, docker will store that stage every time after that line is executed

`COPY` is like `cp`

The important thing is: **`CMD` is always the final line of your docker file, that command should be running forever as long as docker container is running** 


#### 2. The Principle
> Put those changeable things in the last, it allows you building docker image quicker


#### 2-3. Buliding
```
sudo docker build -t yingshaoxo/local_show:1.0 .
```


#### 3. Debug Stuff
```
sudo docker logs local_show
```

`sudo docker exec -i -t local_show /bin/bash` or `sudo docker run --name local_show -it yingshaoxo/local_show:1.0 /bin/bash`


#### 4. Come  and Push
[set proxy](https://docs.docker.com/config/daemon/systemd/)

```
sudo docker commit local_show yingshaoxo/local_show:1.0
```
