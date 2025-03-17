from flask import Flask, request, jsonify
from supabase import create_client
import os
from flask_cors import CORS
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

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
        return jsonify({"status": "success", "data": response}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

# @app.route('/api/auth/google', methods=['GET'])
# def google_auth():
#     try:
#         redirect_uri = "http://127.0.0.1:5000/api/auth/google/callback"
#         client_id = os.getenv('GOOGLE_CLIENT_ID')

#         oauth_url = (
#             f"{os.getenv('SUPABASE_URL')}/auth/v1/authorize"
#             "?provider=google"
#             f"&client_id={client_id}"
#             f"&redirect_to={redirect_uri}"
#             "&response_type=token"
#             "&prompt=consent"
#         )

#         print(f"Generated OAuth URL: {oauth_url}")

#         return jsonify({"url": oauth_url}), 200
#     except Exception as e:
#         print(f"Error in google_auth: {str(e)}")
#         return jsonify({"status": "error", "message": str(e)}), 400

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

if __name__ == '__main__':
    app.run(debug=True, port=5000)