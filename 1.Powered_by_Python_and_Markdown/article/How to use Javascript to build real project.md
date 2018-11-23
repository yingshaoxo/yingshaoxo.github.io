# what is `Javascript`?

For most of the people, they may think JavaScript is nothing but a browser language, yes, but furthermore, it can be a common purpose programming language too.


# So how do you use it?

### 1. run it at a browser 
open your browser like `firefox` or `chrome`, press `F12`, you shell see a debug window. Click `Console`, you will see a `terminal-like` layout, yes, that's it, you can run `basic Javascript codes` in it.

### 2. we do it locally. (Actually writing it at local)
1. you shell know what is `npm` and what is `yarn`. Basically, they do the same things. But `yarn` is a newer tool for managing `Javascript packages`

2. let's creat a `Javascript project` first. 

    > 0. install `npm` or `yarn` by `sudo apt install npm` or `sudo apt install yarn`

    > 1. go to your terminal, `mkdir our_javascript_project`,  `cd our_javascript_project`

    > 2. use `npm init -y` or `yarn init -y` to initialize your project (you will get a file which names `package.json`, that's the `core configuration` for your `Javascript Project`)

    > 3. now, let's create our `index.js` file with `vim index.js`, typing following: `console.log("hello, world!")`, save it

3. instead of downloading your packages(like `yarn` or `npm` will do), if you want to run your `JavaScript` codes, you have to `import` your package, especially, compile your codes to the native codes that every browser can run. So this time, we have to use a new tool, `parcel`
    > 0. install `parcel` by this command: `sudo yarn global add parcel-bundler` (you can google the installation instruction too)

    > 1. create a html page which contains `<script src="./index.js"></script>`

    > 2. render this page using `parcel index.html`

    > 3. now open the local serving link, for example, `http://localhost:1234`, press `F12`, you'll see the `hello, world` was printed at your browser console, great!

4. see, what if we want to add a new package to this project, what we should do now?
    > just use `yarn add your_package_name`, that should do it

5. and, what if I want to get a single static website, which can run in any browser without the `yarn, parcel` tools, what I should do?
    > well, try this: `parcel build index.html`
    
    > after that, you can see a new folder `dist` has been created in your project folder. Inside it, it's your static website, cheer!

### 3. Beyond all of these, is endless packages and their own special usage, like `react`, `vue`
    
congratulations! you have learned all you should know to make a JavaScript project!

I'll see you soon, don't forget to support me, I am poor in Money: [PayPal](https://www.paypal.me/yingshaoxo)
