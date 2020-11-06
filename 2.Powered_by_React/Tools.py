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
                <title>yingshaoxo</title>
                <meta name="author" content="yingshaoxo" />
                <meta name="description" content="yingshaoxo, born in 1998, individual developer. Want to find out all those mysteries in this universe, especially how human thinks. So I embrace AI." />
                <meta name="keywords" content="yingshaoxo, Python, Javascript, Java, C++" />
                """.replace("\n", "")
                )
        io_.write("./build/index.html", content)

py.make_it_runnable()
py.fire(Tools)
