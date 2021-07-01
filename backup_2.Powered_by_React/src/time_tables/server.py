from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin

import json

from table import data

app = Flask(__name__)
api = Api(app)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

class HelloWorld(Resource):
    def get(self):
        return json.dumps(data)

api.add_resource(HelloWorld, '/WorkingTable')

if __name__ == '__main__':
    app.run(debug=True)
