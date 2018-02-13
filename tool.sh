#!/bin/bash

pull() {
    git fetch --all
    git reset --hard origin/master
}

push() {
    git add .
    git commit -m "update"
    git push origin
}

if [ "$1" == "" ]; then
    echo " pull
push"

elif [ "$1" == "pull" ]; then
    pull

elif [ "$1" == "push" ]; then
    push

fi
