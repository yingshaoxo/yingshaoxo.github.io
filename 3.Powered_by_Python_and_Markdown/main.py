#!/usr/bin/env /usr/bin/python3
import os

from auto_everything.base import Python, Terminal, IO
py = Python()
t = Terminal()
io = IO()

class BlogTool():
    """
    Just try to simplify the work.
    """
    def __init__(self):
        if not t.exists('.last_article'):
            name = input("What's the name of your article? ").strip(' ')
            self.new(name)

    def new(self, article_name):
        """create an new article"""
        name = article_name.strip(" ")

        file_path = os.path.join('article', name + '.md')
        io.write(file_path, '')

        io.write('.last_article', file_path)

        self.write()

    def write(self):
        """start to write blog using web editor"""
        #t.run_program('code editor.html')
        last_article = io.read('.last_article')
        t.run_program(f'code "{last_article}"')

    def change(self):
        """change markdown file by vim"""
        last_article = io.read('.last_article')
        t.run_program('''terminator -e "vim '{}'"'''.format(last_article))

    def delete(self):
        """delete the last_article"""
        t.run_command('rm {}'.format(io.read('.last_article')))
        t.run_command('rm .last_article')

    def list(self):
        """list all articles"""
        articles = t.run_command('ls article').split('\n')
        articles = [article[:-3] for article in articles if article[-3:] == '.md']
        for article in articles:
            print(article)

py.fire(BlogTool)
