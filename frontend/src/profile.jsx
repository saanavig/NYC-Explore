import "./profile.css";

import React, { useState } from "react";

const Profile = () => {
    const [preferences, setPreferences] = useState([]);
    const [boroughs, setBoroughs] = useState([]);

    const handlePreferencesChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setPreferences(selected);
    };

    const handleBoroughsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setBoroughs(selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Preferences:", preferences);
        console.log("Boroughs:", boroughs);

        // todo: save everything to supabase
        alert("Profile updated successfully!");
    };

    return (
        <div className="profile-container">
        <h2>My Profile</h2>

        <p> Use Shift to add multiple preferences </p>
        <form onSubmit={handleSubmit} className="profile-form">
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
        </div>
    );
};

export default Profile;
