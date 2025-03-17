import "./home.css";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState } from "react";

const mapContainerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 40.7128,
    lng: -74.006,
};

const Homepage = () => {
    const [mapError, setMapError] = useState(null);
    const apiKey = import.meta.env.VITE_MAPS_KEY;

    const handleLoadError = (error) => {
        console.error("Error loading Google Maps:", error);
        setMapError("Failed to load Google Maps");
    };

    if (!apiKey) {
        return <div className="container">Error: Google Maps API key not found</div>;
    }

    return (
        <div className="container">
            <div className="content-wrapper">
                <div className="page-layout">
                    <div className="map-container">
                        {mapError ? (
                            <div>Error: {mapError}</div>
                        ) : (
                            <LoadScript
                                googleMapsApiKey={apiKey}
                                onError={handleLoadError}
                            >
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={center}
                                    zoom={12}
                                >
                                    <Marker position={center} />
                                </GoogleMap>
                            </LoadScript>
                        )}
                    </div>
                    {/* Replace with user input data */}
                    <div className="places-list">
                        <h2>Places to Visit</h2>
                        <div className="place-card">
                            <div className="place-image">Image Placeholder</div>
                            <div className="place-details">
                                <h3>Central Park</h3>
                                <p className="location">Manhattan, New York</p>
                                <p className="description">
                                    An urban oasis featuring 843 acres of meadows, 
                                    gardens, and walking paths.
                                </p>
                                <div className="additional-info">
                                    <span>⭐ 4.8/5</span>
                                    <span>🕒 Open 6 AM - 1 AM</span>
                                    <span>🎫 Free Entry</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;
