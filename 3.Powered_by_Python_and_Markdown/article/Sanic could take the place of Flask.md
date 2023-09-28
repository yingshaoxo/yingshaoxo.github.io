#### Why Sanic?
1. Faster and More stable
2. `async` request handler
3. `WebSockets` support

#### For static files servering
```
app.static('/static', './static')
```

#### For jinja2 template rendering
```
from jinja2 import Template
from sanic import Sanic
from sanic.response import text

template = Template('Hello {{ name }}!')

app = Sanic()

@app.route("/")
async def test(request):
        data = request.json
        return text(template.render(name=data["name"]))

app.run(host="0.0.0.0", port=8000)
```

```
from jinja2 import Template
import os
from sanic import Sanic
from sanic.response import html

def render_template(html_name, **args):
    with open(os.path.join(os.path.dirname(__file__), 'templates', html_name), 'r') as f:
        html_text = f.read()
    template = Template(html_text)
    return html(template.render(args))

app = Sanic()

@app.route("/")
async def index(request):
        return render_template('index.html', author='yingshaoxo', url='http://yingshaoxo.xyz')

app.run(host="0.0.0.0", port=8000)
```

#### For more infomation
https://sanic.readthedocs.io/en/latest/sanic/getting_started.html
