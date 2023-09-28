1. Set up `node.js` env
    ```
    sudo apt-get install nodejs npm
    ```

2. Install Gitbook
    ```
    sudo npm install -g gitbook-cli
    export PATH=$PATH:/opt/node/bin
    ```

3. Clone your `Gitbook` project from `Github`
    ```
    git clone your_github_project_address
    cd your_github_project_address
    ```

4. Install necessary gitbook plugins
    ```
    gitbook install ./
    ```

5. `Build and View` or `Output as pdf`
    ```
    gitbook build .
    gitbook serve .

    gitbook pdf .
    ```
6. Write in local

    https://github.com/GitbookIO/editor-legacy#how-to-install-it-on-linux
