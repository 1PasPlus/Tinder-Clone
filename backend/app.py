from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/profiles', methods=['GET'])
def get_profiles():
    response = requests.get('https://randomuser.me/api/?results=30')
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch profiles"}), 500
    data = response.json()
    profiles = [{
        'first_name': user['name']['first'],
        'gender': user['gender'],
        'age': user['dob']['age'],
        'city': user['location']['city'],
        'photo': user['picture']['large']
    } for user in data['results']]
    return jsonify(profiles)

if __name__ == '__main__':
    app.run(debug=True)
