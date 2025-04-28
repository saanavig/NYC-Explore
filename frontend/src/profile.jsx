import "./profile.css";

import React, { useEffect, useState } from "react";

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Profile = () => {
    const [preferences, setPreferences] = useState([]);
    const [boroughs, setBoroughs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState("");

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user)
                {
                    console.error("No logged-in user found.");
                    return;
                }

                const res = await fetch(`http://127.0.0.1:5000/user/preferences?user_id=${user.id}`);
                const json = await res.json();

                if (json.status === "success" && json.data)
                {
                    setPreferences(json.data.interests || []);
                    setBoroughs(json.data.boroughs || []);
                }
                else if (json.status === "success" && !json.data)
                {
                    console.log("No preferences yet. Starting fresh.");
                    setPreferences([]);
                    setBoroughs([]);
                }
                else {
                    console.error("Error loading preferences:", json.message || "Unknown error");
                }
            }
            catch (err) {
                console.error("Unexpected error fetching profile:", err);
            }
            finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, []);

    const handlePreferencesChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setPreferences(selected);
    };

    const handleBoroughsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setBoroughs(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("No user found.");
                return;
            }

            const res = await fetch("http://127.0.0.1:5000/user/preferences", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    interests: preferences,
                    boroughs: boroughs
                })
            });

            const json = await res.json();

            if (json.status === "success") {
                setToast("Profile updated successfully! 🎉");
                setTimeout(() => setToast(""), 3000);
            }
            else {
                console.error("Failed to save profile:", json.message);
                alert("Failed to save profile.");
            }
        }
        catch (err) {
            console.error("Unexpected error updating profile:", err);
            alert("An error occurred.");
        }
    };

    return (
        <div className="profile-container">
            <h2>My Profile</h2>

            {toast && <div className="toast">{toast}</div>}

            {loading ? (
                <p>Loading your profile...</p>
            ) : (
                <form onSubmit={handleSubmit} className="profile-form">
                    <p>Use Shift to select multiple preferences</p>
                    <div className="form-group">
                        <label htmlFor="preferences">Event Interests:</label>
                        <select
                            id="preferences"
                            multiple
                            value={preferences}
                            onChange={handlePreferencesChange}
                            className="form-select"
                        >
                            <option value="Food Festivals">Food Festivals</option>
                            <option value="Concerts">Concerts</option>
                            <option value="Art Exhibitions">Art Exhibitions</option>
                            <option value="Street Fairs">Street Fairs</option>
                            <option value="Outdoor Adventures">Outdoor Adventures</option>
                            <option value="Farmers Markets">Farmers Markets</option>
                            <option value="Sports Events">Sports Events</option>
                            <option value="Museum Tours">Museum Tours</option>
                            <option value="Theater Shows">Theater Shows</option>
                            <option value="Nightlife / Bars">Nightlife / Bars</option>
                            <option value="Family-friendly Events">Family-friendly Events</option>
                            <option value="Cultural Events">Cultural Events</option>
                            <option value="Tech Conferences">Tech Conferences</option>
                            <option value="Wellness Activities">Wellness Activities</option>
                            <option value="Free Events">Free Events</option>
                            <option value="Seasonal Celebrations">Seasonal Celebrations</option>
                            <option value="Pop-up Shops">Pop-up Shops</option>
                            <option value="Book Readings">Book Readings</option>
                            <option value="Comedy Shows">Comedy Shows</option>
                            <option value="Community Meetups">Community Meetups</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="boroughs">Preferred Boroughs:</label>
                        <select
                            id="boroughs"
                            multiple
                            value={boroughs}
                            onChange={handleBoroughsChange}
                            className="form-select"
                        >
                            <option value="Manhattan">Manhattan</option>
                            <option value="Brooklyn">Brooklyn</option>
                            <option value="Queens">Queens</option>
                            <option value="Bronx">Bronx</option>
                            <option value="Staten Island">Staten Island</option>
                        </select>
                    </div>

                    <button type="submit" className="save-button">Save Changes</button>
                </form>
            )}
        </div>
    );
};

export default Profile;
