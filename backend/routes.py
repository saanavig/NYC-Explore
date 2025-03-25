from flask import Flask, request, jsonify
from supabase import create_client
import os
from flask_cors import CORS
from dotenv import load_dotenv
import requests


app = Flask(__name__)
CORS(app)
load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

eventbrite_key = os.getenv("EVENTBRITE_KEY")
eventbrite_url = "https://www.eventbriteapi.com/v3/"

@app.route('/')
def home():
    return "Welcome to the NYC Explore!"

@app.route('/about')
def about():
    return "This is the about page."

@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    try:
        response = supabase.auth.sign_up({
            "email": data['email'],
            "password": data['password']
        })
        return jsonify({"status": "success", "data": response}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data['email'],
            "password": data['password']
        })

        if response and "user" in response:
            return jsonify({"status": "success", "data": response}), 200
        else:
            return jsonify({"status": "error", "message": "Invalid login credentials"}), 401

    except Exception as e:
        error_message = str(e)

        if "User not found" in error_message or "Invalid login credentials" in error_message:
            return jsonify({
                "status": "error",
                "message": "User not found. Please sign up first."
            }), 404
        return jsonify({"status": "error", "message": error_message}), 400

@app.route('/api/auth/google', methods=['GET'])
def google_auth():
    try:
        redirect_uri = "http://127.0.0.1:5000/api/auth/google/callback"
        client_id = os.getenv('GOOGLE_CLIENT_ID')

        oauth_url = (
            "https://accounts.google.com/o/oauth2/auth"
            f"?client_id={client_id}"
            "&response_type=code"
            "&scope=openid%20email%20profile"
            f"&redirect_uri={redirect_uri}"
            "&access_type=offline"
            "&prompt=consent"
        )

        print(f"Generated OAuth URL: {oauth_url}")

        return jsonify({"url": oauth_url}), 200
    except Exception as e:
        print(f"Error in google_auth: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/events', methods=['GET'])
def get_events():
    location = request.args.get('location', 'New York')
    category = request.args.get('category', '')
    url = f"{eventbrite_url}events/search/"

    headers = {
        "Authorization": f"Bearer {eventbrite_key}"
    }

    params = {
        "location.address": location,
        "categories": category,
        "expand": "venue"
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({"error": "Failed to fetch events"}), response.status_code

@app.route('/events', methods=['POST'])
def add_event():
    try:
        data = request.json
        print("Received data:", data)

        required_fields = ['name', 'location', 'description', 'event_hours', 'cost']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400

        response = supabase.table("events").insert({
            "name": data['name'],
            "location": data['location'],
            "description": data['description'],
            "event_hours": data['event_hours'],
            "cost": data['cost'],
            "image_url": data.get('image'),
        }).execute()

        print("Database response:", response)

        return jsonify({
            "status": "success",
            "data": response.data
        }), 201

    except Exception as e:
        print("Error:", str(e))
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)