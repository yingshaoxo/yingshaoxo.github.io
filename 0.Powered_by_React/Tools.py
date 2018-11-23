#!/usr/bin/env /usr/bin/python3
 
#!/usr/bin/env /usr/bin/python3
from auto_everything.base import Python, Terminal, IO
py = Python()
t = Terminal()
io_ = IO()

class Tools():
    def build(self):
        t.run('yarn build')
        content = io_.read("./build/index.html")
        content = content.replace("<title>React App</title>", """
                <title>yingshaoxo | 技术宅</title>
                <meta name="author" content="yingshaoxo" />
                <meta name="description" content="yingshaoxo, born in 1998, love IT and AI. Want to be a great ML engineer. So I just keep learning and practice everyday." />
                <meta name="keywords" content="yingshaoxo, YS, 胡英杰, Python, AI, Keras, Tensorflow, React, Javascript, Kotlin, C++" />
                """.replace("\n", "")
                )
        io_.write("./build/index.html", content)

py.make_it_runnable()
py.fire(Tools)
