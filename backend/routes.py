from flask import Flask, request, jsonify
from supabase import create_client
import os
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import json
# from google.transit import gtfs_realtime_pb2
# import re

app = Flask(__name__)
CORS(app)
load_dotenv()

supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
google_maps_key = os.getenv("GOOGLE_MAPS_API_KEY")
eventbrite_key = os.getenv("EVENTBRITE_KEY")
eventbrite_url = "https://www.eventbriteapi.com/v3/"
mta_key = os.getenv("MTA_API_KEY")
# open_data_key = os.getenv("NYC_API_KEY")

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

def get_lat_lng(address):

    geocode_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={google_maps_key}"

    response = requests.get(geocode_url)
    data = response.json()

    if data['status'] == 'OK':
        location = data['results'][0]['geometry']['location']
        return location['lat'], location['lng']
    else:
        return None, None

@app.route('/events', methods=['GET'])
def get_events():
    try:
        response = supabase.table("events").select("*").execute()

        if response.data:
            return jsonify({
                "status": "success",
                "data": response.data
            }), 200
        else:
            return jsonify({
                "status": "success",
                "data": []
            }), 200

    except Exception as e:
        print(f"Error fetching events: {str(e)}")
        return jsonify({
            "status": "error",
            "message": "Failed to fetch events"
        }), 500

@app.route('/events', methods=['POST'])
def add_event():
    try:
        data = request.json
        print("Received data:", data)

        required_fields = ['name', 'location', 'description', 'event_hours', 'cost', 'event_date']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "status": "error",
                    "message": f"Missing required field: {field}"
                }), 400

        lat, lng = get_lat_lng(data['location'])

        if lat is None or lng is None:
            return jsonify({"status": "error", "message": "Invalid address"}), 400

        response = supabase.table("events").insert({
            "name": data['name'],
            "location": data['location'],
            "latitude": lat,
            "longitude": lng,
            "description": data['description'],
            "event_hours": data['event_hours'],
            "cost": data['cost'],
            "image_url": data.get('image'),
            "event_date": data['event_date']
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

# https://api.mta.info/#/subwayRealTimeFeeds

# #subway enpoints
# subway_endpoints = {
#     "blue":"https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
#     "green": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
#     "yellow": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
#     "red_purple": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
#     "orange": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
#     "brown": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
#     "gray": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
#     "sir": "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-si"
# }

# def get_mta(line):
#     url = subway_endpoints.get(line)
#     if not url:
#         return []

#     try:
#         response = requests.get(url)

#         if response.status_code == 200:
#             feed = gtfs_realtime_pb2.FeedMessage()
#             feed.ParseFromString(response.content)

#             entity_data = []
#             for entity in feed.entity:
#                 if entity.HasField("vehicle") and entity.vehicle.HasField("position"):
#                     lat = entity.vehicle.position.latitude
#                     lon = entity.vehicle.position.longitude

#                     if lat != 0.0 and lon != 0.0:
#                         entity_data.append({
#                             "id": entity.id,
#                             "trip_id": entity.vehicle.trip.trip_id if entity.vehicle.HasField("trip") else None,
#                             "vehicle_id": entity.vehicle.vehicle.id if entity.vehicle.HasField("vehicle") else None,
#                             "timestamp": entity.vehicle.timestamp if entity.vehicle.HasField("timestamp") else None,
#                             "latitude": lat,
#                             "longitude": lon
#                         })
#             return entity_data
#         else:
#             return []

#     except Exception as e:
#         print(f"Error for {line}: {str(e)}")
#         return []

@app.route('/mta', methods=['GET'])
def get_data():
    mta_data = {}

    # for line in subway_endpoints:
    #     mta_data[line] = get_mta(line)

    try:
        bus_response = requests.get(
            "https://bustime.mta.info/api/siri/vehicle-monitoring.json",
            params={
                "key": mta_key
            }
        )

        buses = []
        if bus_response.status_code == 200:
            data = bus_response.json()
            activities = data["Siri"]["ServiceDelivery"]["VehicleMonitoringDelivery"][0]["VehicleActivity"]
            for activity in activities:
                loc = activity["MonitoredVehicleJourney"]["VehicleLocation"]
                if loc["Latitude"] != 0.0 and loc["Longitude"] != 0.0:
                    buses.append({
                        "latitude": loc["Latitude"],
                        "longitude": loc["Longitude"]
                    })

        mta_data["bus"] = buses

    except Exception as e:
        print("Error fetching or parsing bus data:", str(e))
        mta_data["bus"] = []

    return jsonify(mta_data)

#311 sound data
@app.route('/sound', methods=['GET'])
def get_311():
    try:
        response = requests.get(
            "https://data.cityofnewyork.us/resource/erm2-nwe9.json",
            params={
                "$limit": 500,
                "$where": "complaint_type='Noise - Street/Sidewalk' OR complaint_type='Noise - Commercial' OR complaint_type='Loud Music/Party' OR descriptor='Crowd'",
                "$order": "created_date DESC"
            }
        )

        data = response.json()
        results = []

        for item in data:
            if 'latitude' in item and 'longitude' in item:
                results.append({
                    "latitude": float(item["latitude"]),
                    "longitude": float(item["longitude"]),
                    "complaint_type": item.get("complaint_type"),
                    "descriptor": item.get("descriptor"),
                    "created_date": item.get("created_date")
                })

        print(f"Returning {len(results)} sound points")
        return jsonify(results)

    except Exception as e:
        print("Error fetching 311 data:", str(e))
        return jsonify([]), 500

# needs to be fixed
@app.route('/crowd', methods=['GET'])
def get_crowd():
    try:
        response = requests.get(
            "https://data.cityofnewyork.us/resource/erm2-nwe9.json",
            params={
                "$limit": 1000,
                "$where": "complaint_type in ('Noise - Street/Sidewalk', 'Noise - Commercial', 'Loud Music/Party') AND latitude IS NOT NULL AND longitude IS NOT NULL",
                "$order": "created_date DESC"
            }
        )
        data = response.json()
        points = []

        for row in data:
            try:
                lat = float(row["latitude"])
                lon = float(row["longitude"])
                points.append({
                    "latitude": lat,
                    "longitude": lon
                })
            except Exception as e:
                print("Skipping row:", e)

        print(f"Returning {len(points)} crowd points")
        return jsonify(points)

    except Exception as e:
        print("Error fetching crowd data:", str(e))
        return jsonify([]), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)