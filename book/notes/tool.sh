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

publish() {
    push
    mkdir ../../Python/yingshaoxo.github.io/book
    mkdir ../../Python/yingshaoxo.github.io/book/notes
    cp _book/* ../../Python/yingshaoxo.github.io/book/notes -fr
    cd ../../Python/yingshaoxo.github.io
    bash tool.sh push
    cd ../../School/University_Notes
}

if [ "$1" == "run" ]; then
    run

elif [ "$1" == "pull" ]; then
    pull

elif [ "$1" == "push" ]; then
    push

elif [ "$1" == "publish" ]; then
    publish

elif [ "$1" == "" ]; then
    echo "pull
push
publish"

fi
