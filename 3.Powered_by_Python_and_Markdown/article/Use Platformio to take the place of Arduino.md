1. Set up a python2 environment

    ```
    cd your_project_path
    sudo pip install pipenv
    sudo pipenv --python 2.7
    sudo pipenv install platformio
    sudo pipenv shell
    ```

2. Find out your board name id

    ```
    platformio boards your_board_name
    ```
    https://platformio.org/boards

    http://docs.platformio.org/en/latest/quickstart.html

3. Initialize your project

    If you got an `uno` board, you just have to run this: `platformio init --board uno`

4. Writing codes

    ```
    mkdir src
    cd src
    ```

    > Write the following codes into `main.cpp`:

    ```
    #include "Arduino.h"

    void setup() {
    }

    void loop() {
    }
    ```

5. Run or Upload as you like

    Build your project: `platformio run`

    Upload your codes into board: `platformio run --target upload`
