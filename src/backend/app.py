from flask import Flask, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/users', methods=['GET'])
def get_users():
    response = requests.get('https://randomuser.me/api/?results=10')
    data = response.json()
    users = []
    for user in data['results']:
        users.append({
            'first_name': user['name']['first'],
            'age': user['dob']['age'],
            'gender': user['gender'],
            'city': user['location']['city'],
            'picture': user['picture']['medium']
        })
    return jsonify(users)

if __name__ == '__main__':
    app.run(debug=True)
