1. See the useless official document

    https://developer.chrome.com/extensions/getstarted

2. See my codes

    https://github.com/yingshaoxo/No_More_Chinese/tree/example-of-chrome-extension

3. Core question

    + [Content scripts](https://developer.chrome.com/extensions/content_scripts) have only limited access to Chrome APIs. This access does not include the API you are trying to use (e.g. `chrome.tabs`). If you need to use that API, you will have to do so in a [background script](https://developer.chrome.com/extensions/background_pages).

    + You are going to need to separate your code into what needs to be in a background script and what needs to be in content scripts, based on the capabilities available to each type of script. Content scripts have access to the DOM of the web page into which they are injected, but limited access to extension APIs. Background scripts have full access to the extension APIs, but no access to web page content. 

    + https://developer.chrome.com/extensions/messaging#simple
