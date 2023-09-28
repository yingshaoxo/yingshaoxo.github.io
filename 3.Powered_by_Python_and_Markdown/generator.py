import os
import json
import shutil

import markdown2


class Updater():
    def __init__(self):
        # First, you should have a article dir under this path of __file__
        self.root = os.path.dirname(__file__)
        self.dir = os.path.join(self.root, 'article')
        if not os.path.exists(self.dir):
            os.mkdir(self.dir)

    def get_changed(self):
        self.update_info()
        self.read_info()
        self.check_if_changed()
        return self.changed

    def update_info(self):
        self.new_files_with_date = dict([(os.path.join(self.dir, name), os.path.getmtime(os.path.join(self.dir, name))) for name in os.listdir(self.dir) if name[-3:] == '.md'])

    def save_info(self):
        with open(os.path.join(self.dir, 'info.json'), mode='w') as f:
            f.write(json.dumps(self.new_files_with_date))

    def read_info(self):
        try:
            with open(os.path.join(self.dir, 'info.json'), mode='r') as f:
                content = f.read()
            self.old_files_with_date = json.loads(content)
        except Exception as e:
            print(e)
            self.old_files_with_date = {}

    def check_if_changed(self):
        new = dict()
        self.changed = list()
        for name, time in self.new_files_with_date.items():
            new.update({name: time})
            old_time = self.old_files_with_date.get(name)
            if old_time: # file exsist in old_info
                if time > old_time:
                    self.changed.append(name)
            else: # file do not exsist in old_info
                self.changed.append(name)
        self.new_files_with_date = new
        self.save_info()


class Generater():
    def __init__(self):
        self.root = os.path.dirname(__file__)
        self.mddir = os.path.join(self.root, 'article')
        self.postdir = os.path.join(self.root, 'post')
        self.staticdir = os.path.join(self.postdir, 'static')
        if not os.path.exists(self.mddir):
            os.mkdir(self.mddir)
        if not os.path.exists(self.postdir):
            os.mkdir(self.postdir)
        if not os.path.exists(self.staticdir):
            shutil.copytree(os.path.join(self.root, 'static'), self.staticdir)

    def get_all_md(self):
        all_ = os.listdir(self.mddir)
        all_ = [name[:-3] for name in all_ if name[-3:] == '.md']
        return all_

    def get_all_post(self):
        all_ = os.listdir(self.postdir)
        all_ = [name[:-5] for name in all_ if name[-5:] == '.html' and name[:-5] != 'index']
        return all_

    def get_all_post_by_time(self):
        try:
            with open(os.path.join(self.mddir, 'info.json'), mode='r') as f:
                content = f.read()
            files_with_date = json.loads(content)
        except Exception as e:
            print(e)
            files_with_date = {}

        all_ = []
        for key in sorted(files_with_date, key=files_with_date.get):
            all_.append(key)

        all_ = list(reversed(all_))
        all_ = [name[:-3][len('artical/'):] for name in all_]
        return all_

    def read_md(self, name):
        with open(os.path.join(self.mddir, name), mode='r') as f:
            text = f.read()
        title = name[:-3] 
        return '# ' + title +'\n\n' + text# 
        
    def write_html(self, name, html):
        with open(os.path.join(self.postdir, name), mode='w') as f:
            f.write(html)

    def remove_html(self, name):
        os.remove(os.path.join(self.postdir, name + '.html'))

    def render(self, title, html):
        # Make the whole page in the center
        prefix = '''
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="static/github-markdown.css">
<title>$title$</title>
<style>
    .content {
        max-width: 500px;
        margin: auto;
        padding: 10px;
    }
    .markdown-body {
        box-sizing: border-box;
        min-width: 200px;
        max-width: 980px;
        margin: 0 auto;
        padding: 45px;

        font-size: 20px; 
    }

    @media (max-width: 767px) {
        .markdown-body {
            padding: 15px;
        }
    }
</style>
</head>
'''.replace('$title$', title)
        html = prefix + '<article class="markdown-body">\n' + html + '\n</article>'
        
        # Add mathjax to it
        html += '''

<script type="text/javascript" async
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_HTML">
</script>
'''
        return html

    def generate(self, file_list):
        for name in file_list:
            name = os.path.basename(name)
            html = markdown2.markdown(self.read_md(name), extras=["code-friendly", "fenced-code-blocks"])
            name = name[:-3]
            html = self.render(name, html)
            self.write_html(name + '.html', html)

    def remove(self):
        mds = self.get_all_md()
        for name in self.get_all_post():
            if name not in mds and name != 'index':
                self.remove_html(name)

    def create_index(self):
        names = self.get_all_post_by_time()
        html = '''
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Post Links</title>
<style>
    .content {
        max-width: 500px;
        margin: auto;
        padding: 10px;
    }
    a {
        font-size: 50px; 
        text-decoration: none;
    }
</style>
</head>
'''
        list_html = '\n'.join(['<center><a href="{name}.html">{name}</a></center><br><hr>'.format(name=name) for name in names])
        html = html + '<div class="content">\n' + list_html + '</div>'
        with open(os.path.join(self.postdir, 'index.html'), 'w', encoding='utf-8') as f:
            f.write(html)
        

if __name__ == '__main__':
    u = Updater()
    g = Generater()
    need_to_change = u.get_changed()
    print(need_to_change)
    g.generate(need_to_change)
    g.remove()
    print('Done')
    g.create_index()
