# NYC-Explore

## Project Setup Instructions

### 1. Install Node.js and Setup React Frontend

### Download Node.js
If you haven't installed Node.js, download it from the official [Node.js website](https://nodejs.org/). This will also install npm (Node Package Manager), which is used to install project dependencies.

After installing Node.js, verify that it's installed correctly:

```
node -v
npm -v
```

Install Frontend Dependencies
Navigate to the frontend project directory:

```
cd frontend
```

Install necessary dependencies:

```
npm install
```

This will install the dependencies listed in the package.json file.

2. Setting up Python Environment

Create a Virtual Environment
Navigate to the backend project directory:

```
cd backend
```

Create a virtual environment:

```
python -m venv venv
```

Activate the Virtual Environment (Mac)

```
source venv/bin/activate
```

Install Requirements:

```
pip install -r requirements.txt
```

3. Running the Project
You need to run both the frontend and the backend simultaneously in a split terminal. Follow these steps:

Step 1: Open a Split Terminal
In VSCode or other code editors with split terminal support, open a split terminal (use Command + \).

Step 2: Run the Frontend
In one terminal window (for the frontend), run the following command to start the React development server:

```
npm run dev
```

Step 3: Run the Backend
In the other terminal window (for the backend), run the following command to start the Python backend server:

```
python routes.py
```

Note: You can cmd+click the frontend URL to see what we have built so far. I am connecting as we go!

4. Adding Necessary Keys to .env File

Backend .env Keys:
Create a .env file in the backend project root directory if it doesn’t already exist.

Add the necessary keys in the following format:

```
# Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

SUPABASE_DB_NAME=your_supabase_db_name_here
SUPABASE_PASS=your_supabase_pass_here
SUPABASE_USER=your_supabase_user_here
SUPABASE_HOST=your_supabase_host_here
SUPABASE_PORT=your_supabase_port_here
SUPABASE_ENGINE=your_supabase_engine_here

# Google Authentication Keys
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

Note: I have already shared all the Supabase information with you, and you should be able to generate Google Authentication Keys directly from Cloud.

Frontend .env Keys:
Create a .env file in the frontend project root directory if it doesn’t already exist.

Add the necessary keys in the following format:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_API_URL=http://localhost:5000

# Google Maps API Key
VITE_MAPS_KEY=your_google_maps_api_key_here
```

Note: These keys should be the same as in the backend folder!
