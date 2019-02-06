#!/bin/bash

run() {
    python3 generater.py
}

pull() {
    git fetch --all
    git reset --hard origin/master
}

push() {
    git add .
    git commit -m "update"
    git push origin
    cp post ../post -fr
}

show() {
    xdg-open post/index.html
}

if [ "$1" == "run" ]; then
    run

elif [ "$1" == "show" ]; then
    show

elif [ "$1" == "pull" ]; then
    pull

elif [ "$1" == "push" ]; then
    push

elif [ "$1" == "publish" ]; then
    publish

elif [ "$1" == "" ]; then
    echo "run 
show
pull
push
"

fi
