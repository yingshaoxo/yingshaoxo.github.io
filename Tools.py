#!/usr/bin/env /usr/bin/python3
 
#!/usr/bin/env /usr/bin/python3
from auto_everything.base import Python, Terminal
py = Python()
t = Terminal()

from shlex import quote
import os


class Tools():
    def book_generation(self):
        if not t.exists("books"):
            print("You don't have book folder yet")
            t.run_command("mkdir book")
            #exit()
        if not t.exists("../Books"):
            print("You don't have any gitbooks in ../Books")
            exit()
        else:
            book_list = os.listdir("../Books")
            template = """
            cd ../Books

            cd $(pwd)/{book_name}
            gitbook install
            gitbook build .
            rm ../../yingshaoxo.github.io/books/{book_name} -fr
            mv _book ../../yingshaoxo.github.io/books/{book_name} -f
            """
            for book in book_list:
                command = template.format(book_name=quote(book))
                print(t.run_command(command, timeout=30000))

    def push(self, comment):
        t.run("""
        cd 2.Powered_by_React/
        ./Tools.py build
        cd ..
        """)
        t.run('git add .')
        t.run('git commit -m "{}"'.format(comment))
        t.run('git push origin')

    def pull(self):
        t.run("""
git fetch --all
git reset --hard origin/master
""")

    def reset(self):
        t.run("""
git reset --hard HEAD^
""")

py.make_it_runnable()
py.fire(Tools)
