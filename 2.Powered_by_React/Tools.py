#!/usr/bin/env /opt/homebrew/opt/python@3.10/bin/python3.10
#!/usr/bin/env /Users/yingshaoxo/miniforge3/bin/python3
#!/usr/bin/env /usr/local/opt/python@3.9/bin/python3.9
#!/usr/bin/env /usr/bin/python3
#!/usr/bin/env /home/yingshaoxo/miniconda3/bin/python3
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
                <meta name="description" content="yingshaoxo, born in 1998, talented developer. Want to find out all those mysteries in this universe, especially how human thinks. So I embrace AI." />
                <meta name="keywords" content="yingshaoxo, Python, Javascript, Dart, Golang, C#, Kotlin, Java, C++" />
                """.replace("\n", "")
                )
        io_.write("./build/index.html", content)

py.make_it_runnable()
py.fire(Tools)
