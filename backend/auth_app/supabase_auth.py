import os
import requests

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def authenticate_google_user(id_token):
    url = f"{SUPABASE_URL}/auth/v1/token?grant_type=id_token"
    headers = {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
    }
    data = {"id_token": id_token, "provider": "google"}

    response = requests.post(url, json=data, headers=headers)
    return response.json()
