from flask import Flask, send_from_directory


your_host_ip = '45.63.90.169'
your_port = '80'


app = Flask(__name__)

@app.route('/')
def home_page():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def any_path(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    print('http://{}:{}'.format(your_host_ip, your_port))
    app.run(host='0.0.0.0', port=your_port)
