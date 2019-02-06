##### Normally, you can get all commands by typing: 

`docker`

##### See how many containers you got right now:

`docker ps -a`



##### Example

`docker run -it --publish 6606:80 --volume ${HOME}/Kivy-Chat:/Kivy-Chat --workdir /Kivy-Chat argensis/python3-kivy:nopip ls`

`--publish 6606:80`
container 80 part to host 6606 port

`-volume ${HOME}/Kivy-Chat:/Kivy-Chat`
forwarding Host `${HOME}/Kivy-Chat` to container `Kivy-Chat`


`--workdir /Kivy-Chat`
set container workdir to `Kivy-Chat`

`argensis/python3-kivy:nopip`
image name

`ls`
just command name, is also could be `python -c "print('hello, docker')"`
