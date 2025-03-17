import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import React, { useState } from "react";

const mapContainerStyle = {
    width: "100%",
    height: "calc(100vh - 64px)",
    marginTop: "64px"
};

const center = {
    lat: 40.7128,
    lng: -74.006,
};

const Homepage = () => {
    const [mapError, setMapError] = useState(null);
    const apiKey = import.meta.env.VITE_MAPS_KEY;

    console.log("Maps Key available:", !!apiKey);

    const handleLoadError = (error) => {
        console.error("Error loading Google Maps:", error);
        setMapError("Failed to load Google Maps");
    };

    if (!apiKey) {
        return <div className="container">Error: Google Maps API key not found</div>;
    }

    return (
        <div className="container">
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
    );
};

export default Homepage;
