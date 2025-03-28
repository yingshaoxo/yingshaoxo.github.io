#!/usr/bin/env /usr/bin/python3
 
#!/usr/bin/env /usr/bin/python3
from auto_everything.base import Python, Terminal
py = Python()
t = Terminal()

from shlex import quote
import os


class Tools():
    def generate_books(self):
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

    def build_react_home_page(self):
        t.run(f"""
        cd 2.Powered_by_React/
        python3 Tools.py build
        """)

    def push(self, comment):
        t.run(f"""
        git add .
        git commit -m "{comment}"
        git push origin
        """)

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
